import { DependencyService }
from "./src";

const service =
  new DependencyService();

const graph =
  service.analyze(
    "C:/Users/derup/OneDrive/Desktop/Open Projects/repo-visualizer/packages/analyzer/src/dependency"
  );

console.log(
  JSON.stringify(graph, null, 2)
);