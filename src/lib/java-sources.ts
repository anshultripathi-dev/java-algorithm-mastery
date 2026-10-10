import { JAVA_SOURCES, JAVA_IO } from '@/data/generated/java-sources';

export function getJavaSource(file: string): string {
  const src = JAVA_SOURCES[file];
  if (src === undefined) throw new Error(`Java source not found: java/${file}`);
  return src;
}

export function hasJavaSource(file: string): boolean {
  return file in JAVA_SOURCES;
}

export function listJavaSources(): string[] {
  return Object.keys(JAVA_SOURCES);
}

/** Sample input / expected output files that sit next to a program (Name.in / Name.out). */
export function getJavaIO(file: string): { in?: string; out?: string } {
  return JAVA_IO[file] ?? {};
}
