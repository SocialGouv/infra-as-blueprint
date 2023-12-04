const { createLoader } = require("@foundernetes/blueprint")
const githubApi = require("~/libs/github-api")
const { githubDefaultOwner } = require("~/config")
module.exports = () =>
  createLoader({
    load: async ({
      repo,
      owner = githubDefaultOwner,
      environmentName,
      repoId,
    }) => {
      return githubApi({
        api: environmentName
          ? `/repositories/${repoId}/environments/${environmentName}/secrets/public-key`
          : `/repos/${owner}/${repo}/actions/secrets/public-key`,
      })
    },
  })
