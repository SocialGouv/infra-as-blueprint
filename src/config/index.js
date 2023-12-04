require("dotenv").config()
module.exports = {
  githubApiEndpoint: "https://api.github.com",
  githubToken: process.env.GITHUB_TOKEN,
  githubDefaultOwner: process.env.GITHUB_DEFAULT_OWNER || "SocialGouv",
}
