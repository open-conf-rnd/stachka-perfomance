import { defineConfig } from 'vitest/config'

/** Один инстанс приложения + долгие эндпоинты (реакция) — без параллельных it и с запасом по времени. */
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 20_000,
    maxWorkers: 1,
    fileParallelism: false,
  },
})
