@echo off
echo Setting up CPIF Wizard deployment to Azure...

echo Creating resource group...
az group create --name rg-cpif-wizard --location eastus

echo Deploying Azure resources...
az deployment group create ^
  --resource-group rg-cpif-wizard ^
  --template-file azure-resources.bicep ^
  --parameters staticWebAppName=swa-cpif-wizard ^
  --parameters cosmosAccountName=cosmos-cpif-wizard

echo Getting deployment outputs...
az staticwebapp secrets list --name swa-cpif-wizard --query "properties.apiKey" --output tsv
az cosmosdb show --name cosmos-cpif-wizard --resource-group rg-cpif-wizard --query "documentEndpoint" --output tsv
az cosmosdb keys list --name cosmos-cpif-wizard --resource-group rg-cpif-wizard --query "primaryMasterKey" --output tsv

echo Deployment complete!
echo Your app will be available at: https://swa-cpif-wizard.azurestaticapps.net
pause
