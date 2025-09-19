import prisma from "../lib/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET || "",
  },
});

const bucketname = process.env.S3_BUCKET_NAME;
export const generateAudio = async (videoId: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (!video || !video.content) throw null;

    console.log("in audio now");

    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      { text: video.content, voice_id: "en-US-daniel", style: "Storytelling" },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.MURF_API_KEY,
        },
      }
    );

    const audioResponse = await axios.get(response.data.audioFile, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(audioResponse.data);

    const fileName = `${randomUUID()}.mp3`;

    const command = new PutObjectCommand({
      Bucket: bucketname,
      Key: fileName,
      Body: buffer,
      ContentType: "audio/mpeg",
    });

    await s3Client.send(command);

    const audioUrl = `https://${bucketname}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // const audioUrl =
    //   "https://shorterr69.s3.us-east-1.amazonaws.com/770d4cbf-abbf-4f0a-8672-9ef2d63fcf7b.mp3";

    console.log(audioUrl);

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
