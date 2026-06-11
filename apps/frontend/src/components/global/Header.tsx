import { GitFork } from "lucide-react"

const Header = () => {
  return (
    <header className="border-b fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10">
            <GitFork className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold leading-none">Repo Visualizer</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Dependency graph analysis & insights</p>
          </div>
        </div>
      </header>
  )
}

export default Header