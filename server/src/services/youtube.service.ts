import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// 1. Setup Proxies from Environment Variables
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

  // 2. Resolve Paths (The Render vs Windows Fix)
  const tmpDir = os.tmpdir();
  const outputBase = path.join(tmpDir, `sub_${videoId}`);
  const isLinux = process.platform === "linux";

  // Binary Path: Points to the curl-downloaded file on Render, or your local .exe
  const ytDlpPath = isLinux 
    ? path.join(process.cwd(), "yt-dlp") 
    : "C:\\tools\\yt-dlp\\yt-dlp.exe";

  // Cookies Path: Render mounts Secret Files in the project root by default
  const cookiesPath = path.join(process.cwd(), "youtube-cookies.txt");

  // --- DEBUGGING LOGS ---
  // If things fail, check your Render logs for these messages!
  console.log(`[DEBUG] Detected Platform: ${process.platform}`);
  console.log(`[DEBUG] yt-dlp binary exists: ${fs.existsSync(ytDlpPath)} at ${ytDlpPath}`);
  console.log(`[DEBUG] Cookies file exists: ${fs.existsSync(cookiesPath)} at ${cookiesPath}`);

  // 3. Safety Check
  if (!fs.existsSync(ytDlpPath)) {
    throw new Error(`[CRITICAL] yt-dlp binary missing at: ${ytDlpPath}. Verify Render Build Command.`);
  }

  const maxAttempts = proxyList.length > 0 ? proxyList.length : 1;
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxAttempts) {
    try {
      const proxyToUse = getNextProxy();
      attempt++;
      
      return await new Promise((resolve, reject) => {
        // 4. Command arguments
        const args = [
          "--skip-download",
          "--write-auto-subs",
          "--sub-format", "vtt",
          "--sub-lang", "en",
          "--geo-bypass",
          "--js-runtimes", "node", // Essential for the "n challenge"
        ];

        // Add cookies if the secret file was found
        if (fs.existsSync(cookiesPath)) {
          args.push("--cookies", cookiesPath);
        }

        // Add proxy if available
        if (proxyToUse) {
          args.push("--proxy", proxyToUse);
          console.log(`[DEBUG] Attempt ${attempt}/${maxAttempts} using proxy: ${proxyToUse}`);
        } else if (process.env.YOUTUBE_PROXY) {
          args.push("--proxy", process.env.YOUTUBE_PROXY);
        }

        args.push("-o", outputBase, link);

        execFile(ytDlpPath, args, (err, stdout, stderr) => {
          if (err) {
            console.error(`[yt-dlp ERROR]: ${stderr || err.message}`);
            return reject(new Error(`yt-dlp execution failed.`));
          }

          try {
            // 5. Find and read the generated .vtt file
            const files = fs.readdirSync(tmpDir);
            const subtitleFileName = files.find(f => f.startsWith(`sub_${videoId}`) && f.endsWith(".vtt"));

            if (!subtitleFileName) {
              return reject(new Error("No subtitles found. Video might not have English captions."));
            }

            const subtitleFilePath = path.join(tmpDir, subtitleFileName);
            const rawContent = fs.readFileSync(subtitleFilePath, "utf8");

            // 6. Clean & Deduplicate VTT content
            const cleanText = rawContent
              .split("\n")
              .map(line => line.replace(/<[^>]*>/g, "").trim()) // Remove VTT tags
              .filter(line => {
                const isHeader = line.includes("WEBVTT") || line.includes("Kind:") || line.includes("Language:");
                const isTimestamp = line.includes("-->");
                return !isHeader && !isTimestamp && line !== "";
              })
              .reduce((acc: string[], currentLine: string) => {
                // Prevent duplicate lines often found in auto-generated subs
                if (acc.length === 0 || acc[acc.length - 1] !== currentLine) {
                  acc.push(currentLine);
                }
                return acc;
              }, [])
              .join(" ")
              .replace(/\s+/g, " ");

            // 7. Cleanup temp file
            fs.unlinkSync(subtitleFilePath);
            resolve(cleanText);

          } catch (innerErr: any) {
            reject(innerErr);
          }
        });
      });
    } catch (error) {
      lastError = error;
      console.log(`[WARNING] Attempt ${attempt} failed. Retrying...`);
    }
  }

  throw new Error(`Failed to fetch transcript after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
}