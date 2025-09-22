import Redis from "ioredis";
import { Queue, tryCatch, Worker } from "bullmq";
import { processes } from "@/app/actions/processes";
import prisma from "@/app/lib/db";

const connection = new Redis({
  host: process.env.UPSTASH_REDIS_HOST,
  port: 6379,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null,
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
        where: videoId,
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
