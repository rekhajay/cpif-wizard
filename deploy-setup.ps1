# PowerShell script to set up Azure resources and GitHub secrets for CPIF Wizard
# Run this script from your project directory

Write-Host "Setting up CPIF Wizard deployment to Azure..." -ForegroundColor Green

# Check if Azure CLI is installed
try {
    $azVersion = az --version
    Write-Host "Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "Azure CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Login to Azure
Write-Host "Logging into Azure..." -ForegroundColor Yellow
az login

# Get subscription ID
$subscriptionId = az account show --query id --output tsv
Write-Host "Subscription ID: $subscriptionId" -ForegroundColor Cyan

# Create resource group
Write-Host "Creating resource group..." -ForegroundColor Yellow
az group create --name rg-cpif-wizard --location eastus

# Deploy infrastructure
Write-Host "Deploying Azure resources..." -ForegroundColor Yellow
az deployment group create `
  --resource-group rg-cpif-wizard `
  --template-file azure-resources.bicep `
  --parameters staticWebAppName=swa-cpif-wizard `
  --parameters cosmosAccountName=cosmos-cpif-wizard

# Get deployment outputs
Write-Host "Getting deployment outputs..." -ForegroundColor Yellow
$staticWebAppToken = az staticwebapp secrets list --name swa-cpif-wizard --query "properties.apiKey" --output tsv
$cosmosEndpoint = az cosmosdb show --name cosmos-cpif-wizard --resource-group rg-cpif-wizard --query "documentEndpoint" --output tsv
$cosmosKey = az cosmosdb keys list --name cosmos-cpif-wizard --resource-group rg-cpif-wizard --query "primaryMasterKey" --output tsv

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository settings" -ForegroundColor White
Write-Host "2. Navigate to Secrets and Variables > Actions" -ForegroundColor White
Write-Host "3. Add these secrets:" -ForegroundColor White
Write-Host "   - AZURE_STATIC_WEB_APPS_API_TOKEN: $staticWebAppToken" -ForegroundColor Yellow
Write-Host "   - AZURE_CREDENTIALS: (see below)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Azure Credentials JSON:" -ForegroundColor Cyan
$credentials = @{
    clientId = "your-client-id"
    clientSecret = "your-client-secret"
    subscriptionId = $subscriptionId
    tenantId = "your-tenant-id"
} | ConvertTo-Json
Write-Host $credentials -ForegroundColor Yellow
Write-Host ""
Write-Host "Your app will be available at: https://swa-cpif-wizard.azurestaticapps.net" -ForegroundColor Green
