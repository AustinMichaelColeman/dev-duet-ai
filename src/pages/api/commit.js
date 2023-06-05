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
      owner: ownerUsername,
      repo: repositoryName,
      content: fileContent,
      encoding: "utf-8",
    });

    const { data: refData } = await octokit.git.getRef({
      owner: ownerUsername,
      repo: repositoryName,
      ref: `heads/${branchName}`,
    });
    const baseTreeSha = refData.object.sha;

    const { data: treeData } = await octokit.git.createTree({
      owner: ownerUsername,
      repo: repositoryName,
      base_tree: baseTreeSha,
      tree: [
        {
          path: filePath,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        },
      ],
    });

    const { data: commitData } = await octokit.git.createCommit({
      owner: ownerUsername,
      repo: repositoryName,
      message: commitMessage,
      tree: treeData.sha,
      parents: [baseTreeSha],
    });

    await octokit.git.updateRef({
      owner: ownerUsername,
      repo: repositoryName,
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
