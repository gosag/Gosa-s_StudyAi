declare module 'youtube-transcript-api' {
  export function getTranscript(videoId: string, config?: any): Promise<any>;
}