import prisma from "../lib/db";
import Replicate from "replicate";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { randomUUID } from "crypto";

const replicate = new Replicate({
  auth: process.env.REPLICATE_TOKEN,
});

type ReplicateOutputItem = {
  url: () => string; // function that returns a string
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET || "",
  },
});

const bucketname = process.env.S3_BUCKET_NAME;

const processImage = async (img: string) => {
  try {
    const input = {
      prompt: img,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "9:16",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4,
    };
    const output = (await replicate.run("black-forest-labs/flux-schnell", {
      input,
    })) as ReplicateOutputItem[];
    const imageUrl = output[0].url().href;
    const fileName = `${randomUUID()}.png`;

    const response = await fetch(imageUrl);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketname,
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
    });

    await s3Client.send(command);

    const s3Url = `https://${bucketname}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return s3Url;
  } catch (error) {
    console.error("Error while generating the image from Replicate", error);
    throw error;
  }
};

export const generateImage = async (videoId: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (!video) return null;

    const imageUrls = await Promise.all(
      video.imagePrompt.map((item: string) => processImage(item))
    );

    console.log(imageUrls);
    // const imageUrls = [
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/6e4b06a4-16cc-46a1-a2ba-739c6fd9d0c2.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/a5c86b4b-707f-418b-878c-cb0ce41a2d3c.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/bc6a1edc-8d90-4bcd-97b3-62112141c317.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/97ca588f-8670-47f0-8e84-bf9fc6bd9c73.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/53db693d-736b-4693-90da-a27a61f0e95b.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/97743075-880a-43b4-a95a-8d6fb76193aa.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/2fd1dd10-5049-486b-8e05-7dfed517f0d5.webp",
    //   "https://res.cloudinary.com/deumgmewo/image/upload/v1757662176/259b487f-0c43-4038-a3c7-3e7ef78fa15a.webp",
    // ];
    await prisma.video.update({
      where: {
        videoId: videoId,
      },
      data: {
        imageLinks: imageUrls,
        thumbnail: imageUrls[0],
      },
    });
  } catch (error) {
    console.error("Error while generating the image", error);
    throw error;
  }
};
