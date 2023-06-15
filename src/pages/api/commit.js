import { GitHub } from "@/utils/github";
import { extractToken } from "@/utils/extractToken";

export default async function commit(req, res) {
  const {
    ownerUsername,
    repositoryName,
    filePath,
    commitMessage,
    fileContent,
    branchName,
  } = req.body;

  let access_token;
  try {
    access_token = extractToken(req);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }

  const github = new GitHub(access_token);

  try {
    const blobData = await github.createBlob(
      ownerUsername,
      repositoryName,
      fileContent
    );

    const refData = await github.getRef(
      ownerUsername,
      repositoryName,
      `heads/${branchName}`
    );
    const baseTreeSha = refData.object.sha;

    const treeData = await github.createTree(
      ownerUsername,
      repositoryName,
      baseTreeSha,
      [
        {
          path: filePath,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        },
      ]
    );

    const commitData = await github.createCommit(
      ownerUsername,
      repositoryName,
      commitMessage,
      treeData.sha,
      [baseTreeSha]
    );

    await github.updateRef(
      ownerUsername,
      repositoryName,
      `heads/${branchName}`,
      commitData.sha
    );

    res.status(200).json({ commitMessage: "Commit successfully created." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ commitMessage: "An error occurred while creating commit." });
  }
}
