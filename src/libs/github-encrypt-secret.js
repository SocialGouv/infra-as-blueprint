// from https://docs.github.com/en/rest/actions/secrets#example-encrypting-a-secret-using-nodejs
const sodium = require("tweetsodium")
module.exports = (secret, key) => {
  const keyBytes = Buffer.from(key, "base64")
  const secretBytes = Buffer.from(secret, "utf-8")
  const encryptedBytes = sodium.seal(secretBytes, keyBytes)
  const encrypted = Buffer.from(encryptedBytes).toString("base64")
  return encrypted
}
