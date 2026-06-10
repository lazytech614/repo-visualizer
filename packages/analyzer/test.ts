import { TreeService } from "./src";

const service = new TreeService();

const result = service.generateTree(
  "C:/Users/derup/OneDrive/Desktop/Open Projects/repo-visualizer/packages/analyzer"
);

console.log(
  JSON.stringify(result, null, 2)
);