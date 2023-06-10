import { Octokit } from "@octokit/rest";

export default async function readFile(req, res) {
  const { ownerUsername, repositoryName, filePath } = req.body;

  const access_token = req.headers.authorization.split(" ")[1];
  const octokit = new Octokit({ auth: access_token });

  try {
    const { data: contentData } = await octokit.repos.getContent({
      owner: ownerUsername,
      repo: repositoryName,
      path: filePath,
    });

    const fileContent = Buffer.from(contentData.content, "base64").toString(
      "utf-8"
    );

    res.status(200).json({ content: fileContent });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while reading the file." });
  }
}
