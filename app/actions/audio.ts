import prisma from "../lib/db";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const generateAudio = async (videoId: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (!video || !video.content) throw null;

    console.log("in audio now");

    const audioStream = await elevenlabs.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb",
      {
        text: video?.content,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );
  } catch (error) {
    console.error("Error while generating Audio", error);
    throw error;
  }
};
