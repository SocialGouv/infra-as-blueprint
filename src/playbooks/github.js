const dayjs = require("dayjs")

const ctx = require("@foundernetes/ctx")
const { createPlaybook, createTree } = require("@foundernetes/blueprint")

const mergeKubeconfig = require("~/utils/merge-kubeconfig")

const tree = {
  loaders: require("~/loaders"),
  plays: require("~/plays"),
}

module.exports = async () => {
  const { plays, loaders } = await createTree(tree, {})

  const playbook = async () => {
    // const logger = ctx.getLogger()
    const iterator = ctx.require("iterator")

    const data = await loaders.config()
    const { clusters, projects, environments } = data

    await iterator.eachOfSeries(
      projects,
      async (projectConfig, projectName) => {
        const projectKubeconfigs = {}
        let kubeconfigsLastCreationDate

        await iterator.eachOf(clusters, async (clusterConfig, clusterName) => {
          const {
            environment,
            contextName = clusterName,
            isEnvironmentDefaultKubeconfigContext = false,
          } = clusterConfig
          if (!projectKubeconfigs[environment]) {
            projectKubeconfigs[environment] = {}
          }
          const envKubeconfig = projectKubeconfigs[environment]

          const namespace = projectConfig.ciNamespace || `ci-${projectName}`
          const kubeconfigSecret = await loaders.kubernetes.secret({
            name: "kubeconfig",
            namespace,
            context: contextName,
          })

          const kubeconfigCreationDate = dayjs(
            kubeconfigSecret.metadata.creationTimestamp,
          ).toDate()
          if (
            !kubeconfigsLastCreationDate ||
            kubeconfigsLastCreationDate < kubeconfigCreationDate
          ) {
            kubeconfigsLastCreationDate = kubeconfigCreationDate
          }

          const kubeconfig = await loaders.kubernetes.kubeconfig({
            raw: kubeconfigSecret.data.KUBECONFIG,
            contextName,
          })

          mergeKubeconfig(envKubeconfig, kubeconfig, contextName)

          if (isEnvironmentDefaultKubeconfigContext) {
            envKubeconfig["current-context"] = contextName
          }
        })

        // dbug({ projectKubeconfigs, kubeconfigsLastCreationDate });

        const { team = projectName } = projectConfig
        const { data: reposData } = await loaders.github.teamRepos({
          name: team,
        })

        // private repos doesn't support environments on github free plan
        const repos = reposData.filter((repo) => !repo.private)

        await iterator.eachSeries(
          repos,
          async (repoConfig) => {
            const [owner, repo] = repoConfig.full_name.split("/")
            const { id: repoId } = repoConfig

            await iterator.eachOfSeries(
              environments,
              async (environementConfig, envName) => {
                const { githubName: environmentName = envName } =
                  environementConfig
                await plays.github.ensureEnvironment({
                  owner,
                  repo,
                  environmentName,
                })
                await plays.github.upsertSecret({
                  owner,
                  repo,
                  name: "KUBECONFIG",
                  environmentName,
                  repoId,
                  value: Buffer.from(
                    JSON.stringify(projectKubeconfigs),
                    "utf-8",
                  ).toString("base64"),
                  valueLastModifiedDate: kubeconfigsLastCreationDate,
                })
              },
              "environments",
            )
          },
          "repos",
        )
      },
      "projects",
    )
  }

  return createPlaybook({
    playbook,
    plays,
    loaders,
  })
}
