import type { DependencyGraph } from "@/types/dependency";
import { type TreeResponse } from "../types/repository";
import type { Hotspot } from "@/types/hotspot";
import type { FileComplexity } from "@/types/complexity";
import type { OverviewStats } from "@/types/overview";
import type { HealthScore } from "@/types/health";

const API_URL = import.meta.env.VITE_API_URL;

export type RepositorySource =
  | "local"
  | "github";

export interface DependenciesResponse {
  graph: DependencyGraph;
  hotspots: Hotspot[];
}

export interface CyclesResponse {
  cycles: CyclesResponse[];
}

export interface DeadFilesResponse {
  deadFiles: string[];
}

export interface ComplexityResponse {
  files: FileComplexity[];
}

function createRepositoryPayload(
  source: RepositorySource,
  value: string,
) {
  return source === "github"
    ? {
        source: "github",
        githubUrl: value,
      }
    : {
        source: "local",
        path: value,
      };
}

async function postRepositoryRequest<T>(
  endpoint: string,
  source: RepositorySource,
  value: string,
): Promise<T> {

  const response = await fetch(
    `${API_URL}/repository/${endpoint}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        createRepositoryPayload(
          source,
          value,
        ),
      ),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`,
    );
  }

  return response.json();
}

export async function getRepositoryTree(
  source: RepositorySource,
  value: string,
): Promise<TreeResponse> {
  return postRepositoryRequest<TreeResponse>(
    "tree",
    source,
    value,
  );
}

export async function getDependencies(
  source: RepositorySource,
  value: string,
): Promise<DependenciesResponse> {
  return postRepositoryRequest(
    "dependencies",
    source,
    value,
  );
}

export async function getOverview(
  source: RepositorySource,
  value: string,
): Promise<OverviewStats> {
  return postRepositoryRequest(
    "overview",
    source,
    value,
  );
}

export async function getCycles(
  source: RepositorySource,
  value: string,
): Promise<any> {
  return postRepositoryRequest(
    "cycles",
    source,
    value,
  );
}

export async function getDeadFiles(
  source: RepositorySource,
  value: string,
): Promise<any> {
  return postRepositoryRequest(
    "dead-files",
    source,
    value,
  );
}

export async function getComplexity(
  source: RepositorySource,
  value: string,
): Promise<ComplexityResponse> {
  return postRepositoryRequest(
    "complexity",
    source,
    value,
  );
}

export async function getHealthScore(
  source: RepositorySource,
  value: string,
): Promise<HealthScore> {
  return postRepositoryRequest(
    "health",
    source,
    value,
  );
}

export async function getAiSummary(
  source: RepositorySource,
  value: string,
) {
  return postRepositoryRequest(
    "summary",
    source,
    value,
  );
}