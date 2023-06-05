import generateRandomString from "@/utils/generateRandomString";

export default function auth(req, res) {
  try {
    const { response_type, client_id, scope, redirect_uri } = req.query;
    const { GITHUB_OAUTH_AUTHORIZE_URL } = process.env;

    console.log("auth req.query", req.query);
    console.log("auth req.body", req.body);

    const state = generateRandomString(16);

    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      response_type,
      scope,
      state,
    });

    res.redirect(`${GITHUB_OAUTH_AUTHORIZE_URL}?${params.toString()}`);
  } catch (error) {
    console.error(
      "Auth Request Error:",
      error.name,
      error.message,
      "Status:",
      error.response?.status,
      error.response?.statusText
    );

    const errorCode = error.response?.status || 500;
    res
      .status(errorCode)
      .json({ error: "An error occurred while processing your request." });
  }
}
