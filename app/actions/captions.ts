import prisma from "../lib/db";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export const generateCaptions = async (videoId: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (!video) return null;

    const transcript = await client.transcripts.transcribe({
      audio: video?.audio ?? "",
    });

    const captions = transcript.words
      ? transcript.words.map((word) => ({
          text: word.text,
          startFrame: Math.round((word.start / 1000) * 30),
          endFrame: Math.round((word.end / 1000) * 30),
        }))
      : [];

    await prisma.video.update({
      where: {
        videoId: videoId,
      },
      data: {
        captions: captions,
      },
    });
  } catch (error) {
    console.error("Error while generating Captions", error);
    throw error;
  }
};
