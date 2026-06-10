import { type TreeResponse } from "../types/repository";

const API_URL = import.meta.env.VITE_API_URL;

export async function getRepositoryTree(
  repositoryPath: string
): Promise<TreeResponse> {
  const response = await fetch(
    `${API_URL}/repository/tree`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: repositoryPath,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function getDependencies(
  repositoryPath: string
) {
  const response = await fetch(
    `${API_URL}/repository/dependencies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: repositoryPath,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function getOverview(
  repositoryPath: string
) {

  const response =
    await fetch(
      `${API_URL}/repository/overview`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          path: repositoryPath,
        }),
      }
    );

  return response.json();
}

export async function getCycles(
  repositoryPath: string
) {

  const response =
    await fetch(
      `${API_URL}/repository/cycles`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          path: repositoryPath,
        }),
      }
    );

  return response.json();
}

export async function getDeadFiles(
  repositoryPath: string,
) {

  const response =
    await fetch(
      `${API_URL}/repository/dead-files`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          path: repositoryPath,
        }),
      },
    );

  return response.json();
}