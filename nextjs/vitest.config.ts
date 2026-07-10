import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts", "**/*.test.tsx"],
    pool: "threads",
    fileParallelism: false,
    maxWorkers: 1,
  },
});

