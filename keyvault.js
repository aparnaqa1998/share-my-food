const az_identity = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
require('dotenv').config();

const credential = new az_identity.DefaultAzureCredential();
const keyVaultName = process.env.KEY_VAULT_NAME;  // Replace with your Key Vault name
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

const client = new SecretClient(keyVaultUrl, credential);

async function getSecret(secretName) {
    try {
        const secret = await client.getSecret(secretName);
        return secret.value;
    } catch (err) {
        console.error(`Error retrieving secret: ${err.message}`);
        throw err;
    }
}

module.exports = { getSecret };
