import { Project } from "ts-morph";
import fs from "fs";
import path from "path";
import {
  DependencyGraph,
  DependencyNode,
  DependencyEdge,
} from "./dependency-type.js";
import { IGNORED_DIRS } from "./constants.js";

// HELPER FUNCTION TO COLLECT FILES TS, JS, TSX, JSX FILES

function collectSourceFiles(
  dirPath: string,
  files: string[] = []
): string[] {
  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry)) {
        collectSourceFiles(fullPath, files);
      }

      continue;
    }

    if (
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx") ||
      fullPath.endsWith(".js") ||
      fullPath.endsWith(".jsx")
    ) {
      files.push(fullPath);
  }
}

  return files;
}

// HELPER FUNCTION TO GET RELATIVE PATH

function getRelativePath(
  repoPath: string,
  filePath: string
) {
  return path.relative(
    repoPath,
    filePath
  );
}

// MAIN FUNCTION

export function analyzeDependencies(
  repositoryPath: string
): DependencyGraph {
    const project = new Project({
        skipAddingFilesFromTsConfig: true,
    });

    // Get All Source Files
    const sourceFilePaths = collectSourceFiles(repositoryPath);

    // Add Files To ts-morph
    for (const filePath of sourceFilePaths) {
        project.addSourceFileAtPath(filePath);
    }

    // Create Nodes And Edges Arrays
    const nodes: DependencyNode[] = [];
    const edges: DependencyEdge[] = [];

    // Get Parsed Source Files
    const sourceFiles = project.getSourceFiles();

    // Generate Nodes
    for (const sourceFile of sourceFiles) {
        const relativePath = getRelativePath(
          repositoryPath,
          sourceFile.getFilePath()
        );

        nodes.push({
            id: relativePath,
            path: relativePath,
        });

        // Get Imports
        const imports = sourceFile.getImportDeclarations();
        for (const imp of imports) {
            // Ignore External Libraries
            if (!imp.isModuleSpecifierRelative()) {
                continue;
            }

            // Resolve Imported File
            const targetFile = imp.getModuleSpecifierSourceFile();
            if (!targetFile) continue;

            // Create Edge
            const edgeSet = new Set<string>();
            const key = `${sourceFile.getFilePath()}->${targetFile.getFilePath()}`;

            if (!edgeSet.has(key)) {
              edgeSet.add(key);

              edges.push({
                source: getRelativePath(
                  repositoryPath,
                  sourceFile.getFilePath()
                ),
                target: getRelativePath(
                  repositoryPath,
                  targetFile.getFilePath()
                ),
              });
            }
        }
    }

    return {
        nodes,
        edges,
    };
}