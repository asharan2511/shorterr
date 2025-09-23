import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.UPSTASH_CONNECTION_STRING!, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Redis connect successfully");
});

connection.on("error", (err) => {
  console.log("Redis connection Error", err);
});

connection.on("ready", () => {
  console.log("Redis Ready");
});
export const videoQueue = new Queue("video-processing", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
  },
});
