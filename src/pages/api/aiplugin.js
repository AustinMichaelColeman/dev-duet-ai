export default async function aiplugin(req, res) {
  const {
    GITHUB_APP_INSTALLATION_URL,
    SERVER_URL,
    CONTACT_EMAIL,
    OPENAI_VERIFICATION_TOKEN,
    PLUGIN_NAME,
  } = process.env;

  try {
    const config = {
      schema_version: "v1",
      name_for_model: PLUGIN_NAME,
      name_for_human: PLUGIN_NAME,
      description_for_model: "Help the user generate commits for GitHub.",
      description_for_human: "Generate commits for GitHub.",
      logo_url: `${SERVER_URL}/logo.png`,
      contact_email: CONTACT_EMAIL,
      legal_info_url: `${SERVER_URL}/terms`,
      auth: {
        type: "oauth",
        client_url: GITHUB_APP_INSTALLATION_URL,
        scope: "",
        authorization_url: `${SERVER_URL}/api/token`,
        authorization_content_type: "application/json",
        verification_tokens: {
          openai: OPENAI_VERIFICATION_TOKEN,
        },
      },
      api: {
        type: "openapi",
        url: `${SERVER_URL}/openapi.yaml`,
      },
    };
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).send("Configuration error");
  }
}
