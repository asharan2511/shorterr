import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: {
        videoId: params.videoId,
      },
      select: {
        processing: true,
        failed: true,
        videoUrl: true,
      },
    });

    if (!video)
      return NextResponse.json({ error: "video not found" }, { status: 400 });

    return NextResponse.json({
      completed: !video.processing && !!video.videoUrl && !video.failed,
      failed: video.failed,
      processing: video.processing,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
