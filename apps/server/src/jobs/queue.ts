import { Queue } from "bullmq";
import { env } from "../config/env.js";
import { getRedisClient, isRedisEnabled } from "../config/redis.js";
import { processGenerationJob } from "./processGeneration.js";

let generationQueue: Queue | null = null;

function getGenerationQueue(): Queue {
  if (!generationQueue) {
    generationQueue = new Queue("question-generation", {
      connection: getRedisClient(),
      defaultJobOptions: {
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
        attempts: 2,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
      },
    });
  }
  return generationQueue;
}

export async function addGenerationJob(assignmentId: string): Promise<string> {
  const jobId = `gen-${assignmentId}-${Date.now()}`;

  if (!isRedisEnabled) {
    console.log(
      `📝 Redis off — running generation in-process (job ${jobId})`
    );
    void processGenerationJob(assignmentId).catch((err) => {
      console.error(`❌ In-process generation failed: ${jobId}`, err);
    });
    return jobId;
  }

  const job = await getGenerationQueue().add(
    "generate-paper",
    { assignmentId },
    { jobId }
  );

  console.log(`📝 Job added to queue: ${job.id}`);
  return job.id!;
}
