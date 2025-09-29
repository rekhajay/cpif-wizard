// Simplified Azure Bicep template for CPIF Wizard infrastructure
@description('The location for all resources')
param location string = resourceGroup().location

@description('The name of the Static Web App')
param staticWebAppName string = 'swa-cpif-wizard'

@description('The name of the Cosmos DB account')
param cosmosAccountName string = 'cosmos-cpif-wizard'

// Static Web App
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: staticWebAppName
  location: location
  properties: {
    repositoryUrl: 'https://github.com/your-org/oc-renewal-wizard'
    branch: 'main'
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'dist'
    }
  }
}

// Cosmos DB Account (simplified)
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    isVirtualNetworkFilterEnabled: false
    virtualNetworkRules: []
    enableCassandraConnector: false
    disableKeyBasedMetadataWriteAccess: false
    networkAclBypass: 'None'
    networkAclBypassResourceIds: []
    enableFreeTier: true
    apiProperties: {}
    enableAnalyticalStorage: false
    analyticalStorageConfiguration: {}
    createMode: 'Default'
    cors: []
    capacity: {}
  }
}

// Output values
output staticWebAppUrl string = staticWebApp.properties.defaultHostname
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
