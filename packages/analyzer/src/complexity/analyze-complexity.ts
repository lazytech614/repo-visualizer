import { Project } from "ts-morph";
import { FileComplexity } from "./complexity-types";

export function analyzeComplexity(
  repositoryPath: string,
): FileComplexity[] {

  const project = new Project();

  project.addSourceFilesAtPaths(
    `${repositoryPath}/**/*.{ts,tsx}`
  );

  const results: FileComplexity[] = [];

  project
    .getSourceFiles()
    .forEach((file) => {

      let complexity = 1;

      file.forEachDescendant((node) => {

          const kind = node.getKindName();

          if (
            kind === "IfStatement" ||
            kind === "SwitchStatement" ||
            kind === "ForStatement" ||
            kind === "ForOfStatement" ||
            kind === "ForInStatement" ||
            kind === "WhileStatement" ||
            kind === "DoStatement" ||
            kind === "CatchClause"
          ) {
            complexity++;
          }
        });

      results.push({
        file: file.getFilePath(),
        complexity,
      });
    });

  return results.sort(
    (a, b) =>
      b.complexity -
      a.complexity,
  );
}