import prisma from "./db";
interface Captions {
  text: string;
  startFrame: number;
  endFrame: number;
}
export const videoDuration = async (videoId: string) => {
  const video = await prisma.video.findUnique({
    where: {
      videoId: videoId,
    },
  });

  if (!video) return null;

  const captions = (video.captions as unknown as Captions[]) ?? [];

  const calculateDuration = captions[captions.length - 1].endFrame;

  await prisma.video.update({
    where: {
      videoId: videoId,
    },
    data: {
      duration: calculateDuration,
    },
  });
};
