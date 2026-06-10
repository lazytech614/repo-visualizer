import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getFileIcon } from "../repository-tree/utils";

interface Props {
  node: any;
  graph: any;
}

export default function NodeDetails({ node, graph }: Props) {
  if (!node) return null;

  const id: string = node.id ?? "";
  const fileName = id.split(/[/\\]/).pop() ?? id;

  // Shorten path for display: show last 3 segments
  const segments = id.split(/[/\\]/);
  const shortPath = segments.length > 3
    ? "…/" + segments.slice(-3).join("/")
    : segments.join("/");

  const imports = graph.edges.filter((e: any) => e.source === id);
  const importedBy = graph.edges.filter((e: any) => e.target === id);

  return (
    <ScrollArea className="h-full [&::-webkit-scrollbar]:hidden">
      <div className="p-3 space-y-4">

        {/* File header */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 border border-border">
          <div className="mt-0.5 shrink-0">
            {getFileIcon(fileName, true)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{fileName}</p>
            <p className="text-[10px] text-muted-foreground font-mono break-all mt-0.5 leading-relaxed">
              {shortPath}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
            <p className="text-lg font-semibold text-foreground">{imports.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Imports</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
            <p className="text-lg font-semibold text-foreground">{importedBy.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Used by</p>
          </div>
        </div>

        {/* Imports list */}
        {imports.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Imports
              </span>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-auto">
                {imports.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {imports.map((edge: any) => {
                const name = edge.target.split(/[/\\]/).pop() ?? edge.target;
                return (
                  <div
                    key={edge.target}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/60 transition-colors group"
                  >
                    <span className="shrink-0">{getFileIcon(name, true)}</span>
                    <span className="text-[11px] font-mono text-foreground truncate">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {imports.length > 0 && importedBy.length > 0 && <Separator />}

        {/* Imported by list */}
        {importedBy.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowLeft className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Used by
              </span>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-auto">
                {importedBy.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {importedBy.map((edge: any) => {
                const name = edge.source.split(/[/\\]/).pop() ?? edge.source;
                return (
                  <div
                    key={edge.source}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/60 transition-colors"
                  >
                    <span className="shrink-0">{getFileIcon(name, true)}</span>
                    <span className="text-[11px] font-mono text-foreground truncate">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {imports.length === 0 && importedBy.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No dependencies found
          </p>
        )}

      </div>
    </ScrollArea>
  );
}