import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  FileImage,
  File,
  FileType,
  Settings,
  Package,
  Database,
  Globe,
  Braces,
} from "lucide-react";

interface IconProps {
  className?: string;
}

export function getFileIcon(name: string, isLeaf: boolean): React.ReactNode {
  if (!isLeaf) return null; // folders handled separately

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const lower = name.toLowerCase();
  const cls = "w-3.5 h-3.5 shrink-0";

  // Config / dotfiles
  if (
    lower === ".env" ||
    lower === ".env.local" ||
    lower === ".env.example" ||
    lower === ".gitignore" ||
    lower === ".eslintrc" ||
    lower === ".prettierrc" ||
    lower === ".babelrc"
  ) return <Settings className={cls} style={{ color: "#6b7280" }} />;

  if (lower === "package.json" || lower === "package-lock.json")
    return <Package className={cls} style={{ color: "#cb3837" }} />;

  if (lower === "dockerfile" || lower.startsWith("docker-compose"))
    return <Database className={cls} style={{ color: "#2496ed" }} />;

  // By extension
  switch (ext) {
    case "ts":
      return <FileCode className={cls} style={{ color: "#3178c6" }} />;
    case "tsx":
      return <FileCode className={cls} style={{ color: "#61dafb" }} />;
    case "js":
      return <FileCode className={cls} style={{ color: "#f7df1e" }} />;
    case "jsx":
      return <FileCode className={cls} style={{ color: "#61dafb" }} />;
    case "json":
      return <FileJson className={cls} style={{ color: "#fbc02d" }} />;
    case "css":
      return <FileType className={cls} style={{ color: "#2965f1" }} />;
    case "scss":
    case "sass":
      return <FileType className={cls} style={{ color: "#cc6699" }} />;
    case "html":
      return <Globe className={cls} style={{ color: "#e44d26" }} />;
    case "md":
    case "mdx":
      return <FileText className={cls} style={{ color: "#519aba" }} />;
    case "svg":
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return <FileImage className={cls} style={{ color: "#a5c261" }} />;
    case "prisma":
      return <Database className={cls} style={{ color: "#5a67d8" }} />;
    case "graphql":
    case "gql":
      return <Braces className={cls} style={{ color: "#e535ab" }} />;
    case "yaml":
    case "yml":
      return <FileText className={cls} style={{ color: "#cb171e" }} />;
    case "toml":
      return <Settings className={cls} style={{ color: "#9c4221" }} />;
    case "sh":
    case "bash":
      return <FileCode className={cls} style={{ color: "#89e051" }} />;
    case "py":
      return <FileCode className={cls} style={{ color: "#3572a5" }} />;
    case "go":
      return <FileCode className={cls} style={{ color: "#00add8" }} />;
    case "rs":
      return <FileCode className={cls} style={{ color: "#dea584" }} />;
    default:
      return <File className={cls} style={{ color: "#6b7280" }} />;
  }
}

export function getFolderIcon(isOpen: boolean): React.ReactNode {
  const cls = "w-3.5 h-3.5 shrink-0";
  return isOpen
    ? <FolderOpen className={cls} style={{ color: "#dcb67a" }} />
    : <Folder className={cls} style={{ color: "#dcb67a" }} />;
}