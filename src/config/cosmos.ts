// Cosmos DB configuration
export const cosmosConfig = {
  endpoint: 'https://cosmos-cpif-wizard.documents.azure.com:443/',
  key: 'IeF@buuZlg3fpADlKf3IFgGkmlBMAzJfcb5ZbeQv1gr619ED13SDtyYFCzdvFqqNE9FAFOWRCWDgACDb9hTN4g=='
};

// Debug logging
console.log('Cosmos Config:', {
  endpoint: cosmosConfig.endpoint ? 'Set' : 'Not set',
  key: cosmosConfig.key ? 'Set' : 'Not set'
});
