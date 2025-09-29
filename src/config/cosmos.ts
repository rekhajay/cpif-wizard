// Cosmos DB configuration
export const cosmosConfig = {
  endpoint: process.env.REACT_APP_COSMOS_ENDPOINT || '',
  key: process.env.REACT_APP_COSMOS_KEY || ''
};

// Debug logging
console.log('Cosmos Config:', {
  endpoint: cosmosConfig.endpoint ? 'Set' : 'Not set',
  key: cosmosConfig.key ? 'Set' : 'Not set'
});
