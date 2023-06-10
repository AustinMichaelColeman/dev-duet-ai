import axios from "axios";

export default async function token(req, res) {
  const { client_id, client_secret, code, redirect_uri } = req.body;

  const { GITHUB_OAUTH_TOKEN_URL } = process.env;

  try {
    const response = await axios.post(
      GITHUB_OAUTH_TOKEN_URL,
      {
        client_id,
        client_secret,
        code,
        redirect_uri,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.data.error) {
      throw new Error(
        `GitHub responded with an error: ${response.data.error_description}`
      );
    }

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth Error");
  }
}
