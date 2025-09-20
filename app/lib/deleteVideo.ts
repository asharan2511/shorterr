"use server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "./db";
import { revalidatePath } from "next/cache";
export const deletVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    await prisma.video.delete({
      where: {
        videoId: videoId,
        userId: user.id,
      },
    });
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete video" };
  }
};
