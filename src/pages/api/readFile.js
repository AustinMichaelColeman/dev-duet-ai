import { Octokit } from '@octokit/rest';
import extractToken from '@/utils/extractToken';

export default async function readFile(req, res) {
  const { ownerUsername, repositoryName, filePath } = req.body;

  let access_token;
  try {
    access_token = extractToken(req);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }

  const octokit = new Octokit({ auth: access_token });

  try {
    const { data: contentData } = await octokit.repos.getContent({
      owner: ownerUsername,
      repo: repositoryName,
      path: filePath,
    });

    const fileContent = Buffer.from(contentData.content, 'base64').toString('utf-8');

    res.status(200).json({ content: fileContent });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while reading the file.' });
  }
}