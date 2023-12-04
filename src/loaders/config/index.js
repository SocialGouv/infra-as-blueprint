const path = require("path")
const fs = require("fs-extra")
const { yaml, deepmerge } = require("@foundernetes/std")

const { createLoader } = require("@foundernetes/blueprint")

module.exports = () =>
  createLoader({
    load: async ({ file = "config.yaml" }) => {
      const configPath = path.join(process.cwd(), file)
      const rawConfig = await fs.readFile(configPath, { encoding: "utf-8" })
      const data = await yaml.loadObject(rawConfig)

      const localConfigPath = path.join(process.cwd(), "config.local.yaml")
      if (await fs.pathExists(localConfigPath)) {
        const rawLocalConfig = await fs.readFile(configPath, {
          encoding: "utf-8",
        })
        const localData = await yaml.loadObject(rawLocalConfig)
        deepmerge(data, localData)
      }
      return data
    },
  })
