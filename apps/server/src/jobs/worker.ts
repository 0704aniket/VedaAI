import { Worker, Job } from "bullmq";
import { getRedisClient, isRedisEnabled } from "../config/redis.js";
import { processGenerationJob } from "./processGeneration.js";

export function startWorker(): Worker | null {
  if (!isRedisEnabled) {
    console.log(
      "⏭️  BullMQ worker skipped (REDIS_ENABLED=false). Generation runs in-process."
    );
    return null;
  }

  const worker = new Worker(
    "question-generation",
    async (job: Job) => {
      const { assignmentId } = job.data;
      await job.updateProgress(10);
      return processGenerationJob(assignmentId);
    },
    {
      connection: getRedisClient(),
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job?.id}`, err.message);
  });

  console.log("✅ BullMQ Worker started");
  return worker;
}
