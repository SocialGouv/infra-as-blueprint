const { createLoader } = require("@foundernetes/blueprint");
const githubApi = require("~/libs/github-api");
const { githubDefaultOwner } = require("~/config");
module.exports = () =>
  createLoader({
    load: async ({ name, owner = githubDefaultOwner }) => {
      return githubApi({
        api: `/orgs/${owner}/teams/${name}/repos`,
      });
    },
  });
