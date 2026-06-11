import { File, GitFork, Heart } from "lucide-react";

const Footer = () => {
  const links = [
    { label: "GitHub", href: "https://github.com/lazytech614/repo-visualizer", icon: GitFork },
    { label: "Docs",   href: "https://github.com/lazytech614/repo-visualizer", icon: File },
  ];

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-3">

        {/* Branding */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <GitFork className="w-3.5 h-3.5" />
          <span className="text-[13px]">Repo Visualizer</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[12px] text-muted-foreground/60">v1.0.0</span>
        </div>

        {/* Credit */}
        <p className="text-[13px] text-muted-foreground/60">
          Built with{" "}
          <Heart className="w-3 h-3 inline-block text-red-500 mx-0.5 fill-red-500" />{" "}
          by{" "}
          <a
            href="https://github.com/lazytech614"
            className="text-muted-foreground font-medium border-b border-border hover:text-foreground transition-colors"
          >
            Lazy
          </a>
        </p>

        {/* Links */}
        <nav className="flex items-center gap-4">
          {links.map(({ label, href, icon: Icon }) => (
            <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
                <Icon className="w-3.5 h-3.5" />
                {label}
            </a>
            ))}
        </nav>

      </div>
    </footer>
  );
};

export default Footer;