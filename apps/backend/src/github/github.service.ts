import { Injectable } from "@nestjs/common";
import { simpleGit } from "simple-git";
import fs from "fs";
import path from "path";
import os from "os";

@Injectable()
export class GithubService {

  async cloneRepository(
    repoUrl: string,
  ): Promise<string> {

    const repoName =
      `repo-${Date.now()}`;

    const clonePath =
      path.join(
        os.tmpdir(),
        repoName,
      );

    await simpleGit().clone(
      repoUrl,
      clonePath,
    );

    return clonePath;
  }

  cleanup(
    clonePath: string,
  ) {

    if (
      fs.existsSync(
        clonePath,
      )
    ) {

      fs.rmSync(
        clonePath,
        {
          recursive: true,
          force: true,
        },
      );
    }
  }
}