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
    let env = options.env.toUpperCase();
    if (!env.startsWith('_')) {
      env = `_${env}`;
    }
    if (name.endsWith(env)) {
      const key = name.substring(0, name.length - env.length).toUpperCase();
      secrets[key] = version.payload;
    }
  });
  return {
    get: (name) => secrets[name.toUpperCase()],
  };
};

module.exports = {
  loadSecrets,
};
