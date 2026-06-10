interface Props {
  node: any;
  graph: any;
}

export default function NodeDetails({ node, graph }: Props) {
  if (!node) {
    return (
      <div className="p-4 text-xs text-zinc-500 font-['Segoe_UI',sans-serif]">
        Click a node to see details
      </div>
    );
  }

  const id: string = node.id ?? "";
  const name = id.split(/[\\\/]/).pop() ?? id;
  const path = id;

  const imports = graph.edges.filter((edge: any) => edge.source === node.id);
  const importedBy = graph.edges.filter((edge: any) => edge.target === node.id);

  return (
    <div className="font-['Segoe_UI',sans-serif] text-sm text-zinc-300 h-full">
      <div className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-700">
        File Details
      </div>

      <div className="p-3 space-y-4 flex flex-col items-start">
        <Field label="Name" value={name} />
        <Field label="Path" value={path} />
        {imports?.length > 0 && (
          <ListField label="Imports" values={imports} field="target" />
        )}
        {importedBy?.length > 0 && (
          <ListField label="Imported By" values={importedBy} field="source" />
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-x-2">
      <div className="text-xs text-zinc-500 mb-1">{label}:</div>
      <div className="text-xs font-mono text-zinc-300 break-all text-start">{value}</div>
    </div>
  );
}

function ListField({
  label,
  values,
  field,
}: {
  label: string;
  values: any[];
  field: "source" | "target";
}) {
  return (
    <div className="flex gap-x-2">
      <div className="text-xs text-zinc-500 mb-2 shrink-0">{label}:</div>
      <ul className="space-y-1 text-start">
        {values.map((edge: any, index: number) => {
          const fullPath: string = edge[field] ?? "";
          const name = fullPath.split(/[\\\/]/).pop() ?? fullPath;
          return (
            <li key={fullPath} className="text-xs font-mono text-blue-300 break-all">
              {index + 1}.&nbsp;
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}