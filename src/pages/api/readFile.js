import GitHub from "@/utils/github";
import { extractToken } from "@/utils/extractToken";

export default async function readFile(req, res) {
  const { ownerUsername, repositoryName, filePath } = req.body;

  let access_token;
  try {
    access_token = extractToken(req);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }

  const github = new GitHub(access_token);

  try {
    const contentData = await github.getContent(
      ownerUsername,
      repositoryName,
      filePath
    );

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
