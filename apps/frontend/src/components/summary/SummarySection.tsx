import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertTriangle, Wrench, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  content: string;
  index: number;
}

const SECTION_CONFIG: Record<string, {
  icon: LucideIcon;
  iconClass: string;
  badgeClass: string;
}> = {
  "repository overview": {
    icon: BookOpen,
    iconClass: "text-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  "key findings": {
    icon: AlertTriangle,
    iconClass: "text-red-500",
    badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  "recommendations": {
    icon: Wrench,
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

function getConfig(title: string) {
  const key = Object.keys(SECTION_CONFIG).find(k =>
    title.toLowerCase().includes(k)
  );
  return key ? SECTION_CONFIG[key] : {
    icon: BookOpen,
    iconClass: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground",
  };
}

export function SummarySection({ title, content }: Props) {
  const config = getConfig(title);
  const Icon = config.icon;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-medium">
          <span className={`p-1.5 rounded-md ${config.badgeClass}`}>
            <Icon className="w-3 h-3" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-1.5">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="text-xs text-muted-foreground flex gap-2 items-start">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                <span className="flex-1">{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-medium text-foreground">{children}</strong>
            ),
            code: ({ children }) => (
              <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {children}
              </span>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}