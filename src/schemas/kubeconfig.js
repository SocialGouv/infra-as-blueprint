module.exports = {
  type: "object",
  properties: {
    apiVersion: { type: "string" },
    kind: { type: "string" },
    clusters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          cluster: {
            type: "object",
            properties: {
              server: { type: "string" },
            },
            required: ["server"],
          },
        },
        required: ["name", "cluster"],
      },
    },
    contexts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          context: {
            type: "object",
            properties: {
              cluster: { type: "string" },
              user: { type: "string" },
            },
            required: ["cluster", "user"],
          },
        },
        required: ["name", "context"],
      },
    },
    "current-context": { type: "string" },
    users: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          user: {
            type: "object",
            properties: {
              "client-certificate": { type: "string" },
              "client-certificate-data": { type: "string" },
              "client-key": { type: "string" },
              "client-key-data": { type: "string" },
              token: { type: "string" },
              tokenFile: { type: "string" },
              username: { type: "string" },
              password: { type: "string" },
            },
            required: [],
          },
        },
        required: ["name", "user"],
      },
    },
  },
  required: [
    "apiVersion",
    "kind",
    "clusters",
    "contexts",
    "users",
  ],
};