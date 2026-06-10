export interface TreeStats {
  totalFiles: number;
  totalDirectories: number;

  totalSize: number;

  typescriptFiles: number;
  javascriptFiles: number;

  jsxFiles: number;
  tsxFiles: number;

  largestFile?: {
    path: string;
    size: number;
  };
}