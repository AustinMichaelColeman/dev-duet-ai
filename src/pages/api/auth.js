export default function auth(req, res) {
  try {
    const { response_type, client_id, scope, redirect_uri } = req.query;
    const { GITHUB_APP_INSTALLATION_URL } = process.env;

    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      response_type,
      scope,
    });

    // need to check if the app has been installed already or not here

    res.redirect(`${GITHUB_APP_INSTALLATION_URL}?${params.toString()}`);
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
