import { Octokit } from "@octokit/rest";

export default async function commit(req, res) {
  const {
    ownerUsername,
    repositoryName,
    filePath,
    commitMessage,
    fileContent,
    branchName,
  } = req.body;

  const access_token = req.headers.authorization.split(" ")[1];
  const octokit = new Octokit({ auth: access_token });

  try {
    const { data: blobData } = await octokit.git.createBlob({
      ownerUsername,
      repositoryName,
      fileContent,
      encoding: "utf-8",
    });

    const { data: refData } = await octokit.git.getRef({
      ownerUsername,
      repositoryName,
      ref: `heads/${branchName}`,
    });
    const baseTreeSha = refData.object.sha;

    const { data: treeData } = await octokit.git.createTree({
      ownerUsername,
      repositoryName,
      base_tree: baseTreeSha,
      tree: [
        {
          filePath,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        },
      ],
    });

    const { data: commitData } = await octokit.git.createCommit({
      ownerUsername,
      repositoryName,
      commitMessage,
      tree: treeData.sha,
      parents: [baseTreeSha],
    });

    await octokit.git.updateRef({
      ownerUsername,
      repositoryName,
      ref: `heads/${branchName}`,
      sha: commitData.sha,
    });

    res.status(200).json({ commitMessage: "Commit successfully created." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ commitMessage: "An error occurred while creating commit." });
  }
}
