const {
  createLoader,
  $
} = require("@foundernetes/blueprint")

module.exports = () =>
  createLoader({
    load: async (vars) => {
      const {
        context,
        namespace,
        name
      } = vars
      const {
        stdout
      } = await $(
        `kubectl ${context ? `--context ${context}`: ""} ${
          namespace ? `-n ${namespace} get secret ${name} -o json` : ""
        }`, {
          logStd: false,
        }
      );
      const o = JSON.parse(stdout);
      const data = Object.entries(o.data).reduce((acc, [key, value]) => {
        acc[key] = Buffer.from(value, "base64").toString("utf-8")
        return acc
      }, {})
      const {
        metadata
      } = o
      return {
        data,
        metadata
      }
    },
  })