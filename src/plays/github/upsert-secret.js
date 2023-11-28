const { createPlay, ctx } = require("@foundernetes/blueprint");
const dayjs = require("dayjs");

const githubApi = require("~/libs/github-api");

const githubEncyptSecret = require("~/libs/github-encrypt-secret");

module.exports = async ({ loaders }) =>
  createPlay({
    async check({
      owner,
      repo,
      name,
      environmentName,
      repoId,
      valueLastModifiedDate,
    }) {
      const { data: { updated_at: secretLastModified } = {} } =
        await loaders.github.secret({
          owner,
          repo,
          name,
          environmentName,
          repoId,
        });
      const secretLastModifiedDate =
        secretLastModified ? dayjs(secretLastModified).toDate() : null;
      const logger = ctx.getLogger();
      const ok =
        secretLastModifiedDate && secretLastModifiedDate >= valueLastModifiedDate || false;
      if (ok) {
        logger.info("up to date", {
          secretLastModifiedDate,
          valueLastModifiedDate,
        });
      } else {
        if (!secretLastModifiedDate) {
          logger.info(`doesn't exists`);
        } else {
          logger.info(`not up to date`, {
            secretLastModifiedDate,
            valueLastModifiedDate,
          });
        }
      }
      return ok;
    },
    async run({ owner, repo, name, environmentName, repoId, value }) {
      const { data } = await loaders.github.repoPublicKey({
        owner,
        repo,
        repoId,
        environmentName,
      });
      const { key, key_id: keyId } = data;
      const encryptedValue = await githubEncyptSecret(value, key);

      await githubApi({
        method: "put",
        api: environmentName
          ? `/repositories/${repoId}/environments/${environmentName}/secrets/${name}`
          : `/repos/${owner}/${repo}/actions/secrets/${name}`,
        data: {
          encrypted_value: encryptedValue,
          key_id: keyId,
        },
      });
    },
  });
