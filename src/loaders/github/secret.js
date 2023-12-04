const { createLoader } = require("@foundernetes/blueprint")
const githubApi = require("~/libs/github-api")
const { githubDefaultOwner } = require("~/config")
module.exports = () =>
  createLoader({
    load: async ({
      owner = githubDefaultOwner,
      repo,
      name,
      environmentName,
      repoId,
    }) => {
      return githubApi({
        api: environmentName
          ? `/repositories/${repoId}/environments/${environmentName}/secrets/${name}`
          : `/repos/${owner}/${repo}/actions/secrets/${name}`,
      })
    },
  })
