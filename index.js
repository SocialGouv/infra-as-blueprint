require("events").EventEmitter.defaultMaxListeners = 0

const { cli, dbug } = require("@foundernetes/blueprint")

dbug.registerGlobal()

const playbooks = require("~/playbooks")

const pk = require("./package.json")

const main = async () => {
  await cli(process.argv, {
    customProgram: {
      name: "infra-as-blueprint",
      version: pk.version,
      description: pk.description,
    },
    playbookSet: {
      playbooks,
    },
  })
}

main()
