import { Redis } from "ioredis";
import { Worker } from "bullmq";
import { processes } from "@/app/actions/processes";
import prisma from "@/app/lib/db";

const connection = new Redis(process.env.UPSTASH_CONNECTION_STRING!, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Redis connect successfully");
});

connection.on("error", (err) => {
  console.log("Redis connection Error", err);
});

const worker = new Worker(
  "video-processing",
  async (job) => {
    const { videoId } = job.data;

    console.log("processing video with ID: ", videoId);

    try {
      await processes(videoId);
      console.log("successfully processed video: ", videoId);
    } catch (err) {
      console.error("Error occured while processing video: ", videoId);

      await prisma.video.update({
        where: {
          videoId: videoId,
        },
        data: {
          processing: false,
          failed: true,
        },
      });
      throw err;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);

worker.on("completed", (job) => {
  console.log(`${job?.id} completed`);
});
worker.on("failed", (job, err) => {
  console.log(`${job?.id} failed`, err.message);
});

worker.on("error", (err) => {
  console.log("Worker error", err);
});

console.log("Worker started, waiting for jobs ");
console.log("Connected to redis");
