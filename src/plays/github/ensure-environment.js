const { createPlay, ctx } = require("@foundernetes/blueprint")
const dayjs = require("dayjs")

const githubApi = require("~/libs/github-api")
module.exports = async () =>
  createPlay({
    async check({ owner, repo, environmentName }) {
      if (!environmentName) {
        return true
      }
      const { status } = await githubApi({
        api: `/repos/${owner}/${repo}/environments/${environmentName}`,
      })
      return status < 400
    },
    async run({ owner, repo, environmentName }) {
      await githubApi({
        method: "put",
        api: `/repos/${owner}/${repo}/environments/${environmentName}`,
      })
    },
  })
