interface SummaryContext {
  totalFiles: number;
  totalDependencies: number;
  cycleCount: number;
  deadFiles: string[];
  hotspots: string[];
  complexityFiles: {
    file: string;
    complexity: number;
  }[];
  healthScore: number;
}

export function generateSummaryPrompt(context: SummaryContext): string {
  return `
Files: ${context.totalFiles}
Dependencies: ${context.totalDependencies}
Cycles: ${context.cycleCount}
Health Score: ${context.healthScore}/100
Dead Files (${context.deadFiles.length}): ${context.deadFiles.join(", ") || "none"}
Hotspots: ${context.hotspots.join(", ") || "none"}
Most Complex Files:
${context.complexityFiles
  .slice(0, 5)
  .map(f => `  ${f.file}: ${f.complexity}`)
  .join("\n")}
`;
}