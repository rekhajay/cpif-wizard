// Cosmos DB configuration
export const cosmosConfig = {
  endpoint: import.meta.env.VITE_COSMOS_ENDPOINT || process.env.REACT_APP_COSMOS_ENDPOINT || '',
  key: import.meta.env.VITE_COSMOS_KEY || process.env.REACT_APP_COSMOS_KEY || ''
};

// Debug logging
console.log('Cosmos Config:', {
  endpoint: cosmosConfig.endpoint ? 'Set' : 'Not set',
  key: cosmosConfig.key ? 'Set' : 'Not set'
});

console.log('Environment variables:', {
  'import.meta.env.VITE_COSMOS_ENDPOINT': import.meta.env.VITE_COSMOS_ENDPOINT,
  'process.env.REACT_APP_COSMOS_ENDPOINT': process.env.REACT_APP_COSMOS_ENDPOINT,
  'import.meta.env.VITE_COSMOS_KEY': import.meta.env.VITE_COSMOS_KEY,
  'process.env.REACT_APP_COSMOS_KEY': process.env.REACT_APP_COSMOS_KEY
});
