const fs = require('fs');
const path = require('path');

// Get environment variables
const endpoint = process.env.REACT_APP_COSMOS_ENDPOINT;
const key = process.env.REACT_APP_COSMOS_KEY;

console.log('Build script environment variables:', {
  endpoint: endpoint ? 'Set' : 'Not set',
  key: key ? 'Set' : 'Not set'
});

// Create the config file
const configContent = `// Cosmos DB configuration - Generated at build time
export const cosmosConfig = {
  endpoint: '${endpoint || ''}',
  key: '${key || ''}'
};

// Debug logging
console.log('Cosmos Config:', {
  endpoint: cosmosConfig.endpoint ? 'Set' : 'Not set',
  key: cosmosConfig.key ? 'Set' : 'Not set'
});
`;

// Write the config file
fs.writeFileSync(path.join(__dirname, '../src/config/cosmos.ts'), configContent);
console.log('Config file written successfully');
