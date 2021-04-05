const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

/**
 * Load Secret and return object to values access
 * @param {*} options params to search data in GCP
 * @param {'online'|'offline'} mode online: used secret manager GCP, offline: enviroment vaiables
 */
const loadSecrets = async (
  options = {
    version: 'latest', env: 'qa', project: '', keys: [],
  },
  mode = 'offline',
) => {
  let secrets = {};
  if (mode === 'online') {
    const client = new SecretManagerServiceClient();
    const [listSecrets] = await client.listSecrets({
      parent: `projects/${options.project}`,
    });
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < listSecrets.length; index++) {
      const secret = listSecrets[index];
      const name = secret.name.toString();
      let env = options.env.toUpperCase();
      if (!env.startsWith('_')) {
        env = `_${env}`;
      }
      if (name.endsWith(env)) {
        const key = name.substring(0, name.length - env.length).toUpperCase();
        const keyParts = key.split('/');
        const keyName = keyParts[keyParts.length - 1];
        if (options.keys.length > 0 && options.keys.indexOf(keyName) < 0) {
          // eslint-disable-next-line no-continue
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        const [version] = await client.accessSecretVersion({
          name: `${name}/versions/${options.version}`,
        });
        const value = version.payload.data.toString();
        secrets[keyName] = value;
      }
    }
  } else {
    secrets = process.env;
  }
  return {
    get: (name) => {
      const secret = secrets[name.toUpperCase()];
      if (!secret) {
        throw new Error(`${name} in secret variables not found`);
      }
      return secret;
    },
  };
};

module.exports = {
  loadSecrets,
};
