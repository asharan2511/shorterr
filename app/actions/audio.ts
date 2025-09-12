import prisma from "../lib/db";
import axios from "axios";

import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadAudioToCloudinary = async (url: string, fileName: string) => {
  const result = await cloudinary.uploader.upload(url, {
    resource_type: "video",
    public_id: fileName,
    format: "mp3",
  });

  return result?.secure_url;
};

export const generateAudio = async (videoId: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (!video || !video.content) throw null;

    console.log("in audio now");

    // const response = await axios.post(
    //   "https://api.murf.ai/v1/speech/generate",
    //   { text: video.content, voice_id: "en-US-daniel", style: "Storytelling" },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       "api-key": process.env.MURF_API_KEY,
    //     },
    //   }
    // );

    // const fileName = `${randomUUID()}`;

    // const audioUrl = await uploadAudioToCloudinary(
    //   response.data.audioFile,
    //   fileName
    // );

    const audioUrl =
      "https://res.cloudinary.com/deumgmewo/video/upload/v1757662182/dcda4095-9f0c-4199-ad60-51421340c634.mp3";

    await prisma.video.update({
      where: {
        videoId: videoId,
      },
      data: {
        audio: audioUrl,
      },
    });
  } catch (error) {
    console.error("Error while generating Audio", error);
    throw error;
  }
};
