const axios = require("@foundernetes/axios");
const { deepmerge } = require("@foundernetes/std");

const { githubApiEndpoint, githubToken } = require("~/config")

module.exports = ({ api, ...axiosOptions } = {}) =>
  axios(
    deepmerge(
      {
        url: `${githubApiEndpoint}${api}`,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        validateStatus: function (status) {
          return status >= 200 && status < 300 || status === 404;
        },
      },
      axiosOptions
    )
  );