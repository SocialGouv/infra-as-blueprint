const { omit } = require("lodash");

const { yaml } = require("@foundernetes/std");
const { createLoader } = require("@foundernetes/blueprint");
const kubeconfigSchema = require("~/schemas/kubeconfig");
module.exports = () =>
  createLoader({
    load: async ({ raw, contextName }) => {
      const kubeconfig = yaml.loadObject(raw);
      if (contextName) {
        const [context] = kubeconfig.contexts;
        context.name = contextName;
      }
      return omit(kubeconfig, ["current-context"]);
    },
    validateData: kubeconfigSchema,
  });
