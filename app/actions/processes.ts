"use server";
import { findPrompt } from "../lib/findPrompt";
import { generateScript } from "./script";
import prisma from "../lib/db";
import { generateImage } from "./image";

export const processes = async (videoId: string) => {
  try {
    const prompt = await findPrompt(videoId);
    //script, extract content and image prompt
    const script = await generateScript(prompt || "");
    const scriptData = JSON.parse(script || "");
    const contentText = scriptData.content.map(
      (data: { contentText: string }) => data.contentText
    );
    const fullContent = contentText.join(" ");
    const imageText = scriptData.content.map(
      (data: { ImagePrompt: string }) => data.ImagePrompt
    );
    //image generation

    await prisma.video.updateMany({
      where: {
        videoId: videoId,
      },
      data: {
        content: fullContent,
        imagePrompt: imageText,
      },
    });

    // const imageURLS = await imageUrls(videoId);

    //console.log(imageURLS);

    const imageLinks = await generateImage(videoId ?? "");
  } catch (error) {
    console.log("error in making video", error);
    throw error;
  }
};
