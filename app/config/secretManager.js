const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const loadSecrets = async (options = { version: 'latest', env: 'dev', project: '' }) => {
  const secrets = {};
  const client = new SecretManagerServiceClient();
  const [listSecrets] = await client.listSecrets({
    parent: `projects/${options.project}`,
  });
  listSecrets.forEach(async (secret) => {
    const name = secret.name.toString();
    const [version] = await client.accessSecretVersion({
      name: `${name}/versions/${options.version}`,
    });
    if (name.endsWith(options.env)) {
      const key = name.substring(0, name.length - options.env.length);
      secrets[key] = version.payload;
    }
  });
  return {
    get: (name) => secrets[name],
  };
};

module.exports = {
  loadSecrets,
};
