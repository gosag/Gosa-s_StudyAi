import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// 1. Setup Proxies
const proxyList: string[] = process.env.YOUTUBE_PROXIES 
  ? process.env.YOUTUBE_PROXIES.split(",").map(p => p.trim())
  : [];

let currentProxyIndex = 0;

function getNextProxy(): string | null {
  if (proxyList.length === 0) return null;
  const proxy = proxyList[currentProxyIndex];
  currentProxyIndex = (currentProxyIndex + 1) % proxyList.length;
  return proxy ?? null;
}

export async function getYoutubeTranscript(link: string): Promise<string> {
  // 1. Validate and Extract Video ID
  const videoIdMatch = link.match(/(?:v=|youtu\.be\/|shorts\/)([0-9A-Za-z_-]{11})/);
  if (!videoIdMatch) {
    throw new Error("Invalid YouTube link format.");
  }
  const videoId = videoIdMatch[1];

  // 2. Resolve Paths (The fix for Render vs Local)
  const tmpDir = os.tmpdir();
  const outputBase = path.join(tmpDir, `sub_${videoId}`);
  
  // Detect if we are on Render (Linux) or Local (Windows)
  const isLinux = process.platform === "linux";
  
  // On Render, yt-dlp is in the project root folder (process.cwd())
  // On Windows, it uses your local path
  const ytDlpPath = isLinux 
    ? path.join(process.cwd(), "yt-dlp") 
    : "C:\\tools\\yt-dlp\\yt-dlp.exe";

  const cookiesPath = path.resolve(process.cwd(), "youtube-cookies.txt");

  // SAFETY CHECKS
  if (!fs.existsSync(ytDlpPath)) {
    throw new Error(`[CRITICAL] yt-dlp binary missing at: ${ytDlpPath}. Check Render build command.`);
  }

  if (!fs.existsSync(cookiesPath)) {
    console.error(`[CRITICAL] Cookies file missing at: ${cookiesPath}`);
    throw new Error("Cookies file not found. Ensure youtube-cookies.txt is in your project root.");
  }

  const maxAttempts = proxyList.length > 0 ? proxyList.length : 1;
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxAttempts) {
    try {
      const proxyToUse = getNextProxy();
      attempt++;
      
      return await new Promise((resolve, reject) => {
        // 3. Command arguments
        const args = [
          "--skip-download",
          "--write-auto-subs",
          "--sub-format", "vtt",
          "--sub-lang", "en",
          "--cookies", cookiesPath,
          "--geo-bypass",
          "--js-runtimes", "node", // Keeps the 'n' challenge happy
        ];

        if (proxyToUse) {
          args.push("--proxy", proxyToUse);
          console.log(`[DEBUG] yt-dlp attempt ${attempt}/${maxAttempts} using proxy: ${proxyToUse}`);
        } else if (process.env.YOUTUBE_PROXY) {
          args.push("--proxy", process.env.YOUTUBE_PROXY);
        }

        args.push("-o", outputBase, link);

        execFile(ytDlpPath, args, (err, stdout, stderr) => {
          if (err) {
            console.error(`[yt-dlp ERROR]: ${stderr || err.message}`);
            return reject(new Error(`yt-dlp failed to fetch transcript.`));
          }

          try {
            // 4. Find and read the file
            const files = fs.readdirSync(tmpDir);
            const subtitleFileName = files.find(f => f.startsWith(`sub_${videoId}`) && f.endsWith(".vtt"));

            if (!subtitleFileName) {
              return reject(new Error("No subtitles file generated. Video might not have English captions."));
            }

            const subtitleFilePath = path.join(tmpDir, subtitleFileName);
            const rawContent = fs.readFileSync(subtitleFilePath, "utf8");

            // 5. Clean & Deduplicate VTT content
            const cleanText = rawContent
              .split("\n")
              .map(line => line.replace(/<[^>]*>/g, "").trim())
              .filter(line => {
                const isHeader = line.includes("WEBVTT") || line.includes("Kind:") || line.includes("Language:");
                const isTimestamp = line.includes("-->");
                return !isHeader && !isTimestamp && line !== "";
              })
              .reduce((acc: string[], currentLine: string) => {
                if (acc.length === 0 || acc[acc.length - 1] !== currentLine) {
                  acc.push(currentLine);
                }
                return acc;
              }, [])
              .join(" ")
              .replace(/\s+/g, " ");

            // 6. Cleanup temp file
            fs.unlinkSync(subtitleFilePath);
            resolve(cleanText);

          } catch (innerErr: any) {
            reject(innerErr);
          }
        });
      });
    } catch (error) {
      lastError = error;
      console.log(`[WARNING] Attempt ${attempt} failed, trying next proxy...`);
    }
  }

  throw new Error(`Failed to fetch transcript after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
}