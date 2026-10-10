export const JAVA_RELEASE: string;
export interface JavaStatus { available: boolean; javac: string | null; java: string | null; release: string }
export interface RunResult { ok: boolean; stage: 'setup' | 'compile' | 'run'; stdout: string; stderr: string; exitCode: number | null; timedOut: boolean; ms: number; mainClass?: string }
export function javaStatus(force?: boolean): Promise<JavaStatus>;
export function detectMainClass(code: string): string;
export function runJava(opts: { code: string; stdin?: string; timeoutMs?: number; args?: string[] }): Promise<RunResult>;
export function javaApiMiddleware(): (req: any, res: any, next: () => void) => Promise<void>;
