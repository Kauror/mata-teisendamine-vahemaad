// Types for the science runner projection, so the unit test can import it.
export const RUNNER_OMITTED_TASK_FIELDS: string[];
export function projectScienceRunnerTasks(dataset: { tasks: object[] }): Record<string, unknown>[];
export function serializeRunnerTasks(tasks: unknown[]): string;
