import { Octokit } from "@octokit/rest";

export default async function listFiles(req, res) {
  const { ownerUsername, repositoryName, branchName } = req.body;

  const access_token = req.headers.authorization.split(" ")[1];
  const octokit = new Octokit({ auth: access_token });

  try {
    const { data: treeData } = await octokit.git.getTree({
      owner: ownerUsername,
      repo: repositoryName,
      tree_sha: branchName,
      recursive: true,
    });

    // Filter out tree entries that are not files.
    const files = treeData.tree.filter((item) => item.type === "blob");

    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while listing the files." });
  }
}
