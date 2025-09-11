import prisma from "../lib/db";
import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

const replicate = new Replicate({
  auth: process.env.REPLICATE_TOKEN,
});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (url: string, fileName: string) => {
  const result = await cloudinary.uploader.upload(url, {
    public_id: fileName,
  });

  return result?.secure_url;
};

type ReplicateOutputItem = {
  url: () => string; // function that returns a string
};

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
    const fileName = `${randomUUID()}`;

    //upload to cloudinary and store the url
    const secure_url = await uploadImageToCloudinary(imageUrl, fileName);
    return secure_url;
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
    return imageUrls;
  } catch (error) {
    console.error("Error while generating the image", error);
    throw error;
  }
};
