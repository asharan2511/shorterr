import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const video = await prisma.video.findUnique({
      where: {
        videoId: videoId,
      },
      select: {
        videoUrl: true,
      },
    });

    if (!video?.videoUrl)
      return NextResponse.json({ error: "Video not found" }, { status: 400 });

    const response = await fetch(video.videoUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch the video");
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-type": "video/mp4",
        "Content-Disposition": `attachment; filename="video-${videoId}.mp4"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("download error", error);
    return NextResponse.json({ error: "Download Failed" }, { status: 400 });
  }
}
