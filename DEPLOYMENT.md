# CPIF Wizard - Azure Deployment Guide

## 🚀 Complete Cloud-Native Architecture

This guide will help you deploy the CPIF Wizard to Azure using a modern, serverless architecture.

## 📋 Prerequisites

- Azure subscription
- GitHub repository
- Node.js 18+ installed locally
- Azure CLI installed

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Azure Functions │    │   Cosmos DB     │
│ (Static Web App)│◄──►│   (Backend API)  │◄──►│  (Form Data)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   Azure AD      │    │ Microsoft Graph  │
│ (Authentication)│    │  (Employee Data) │
└─────────────────┘    └──────────────────┘
```

## 🛠️ Step 1: Deploy Infrastructure

### Option A: Using Azure CLI (Recommended)

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-cpif-wizard --location eastus

# Deploy infrastructure using Bicep
az deployment group create \
  --resource-group rg-cpif-wizard \
  --template-file azure-resources.bicep \
  --parameters staticWebAppName=swa-cpif-wizard \
  --parameters cosmosAccountName=cosmos-cpif-wizard
```

### Option B: Using Azure Portal

1. Go to Azure Portal
2. Create a new Resource Group: `rg-cpif-wizard`
3. Deploy the Bicep template from `azure-resources.bicep`

## 🔧 Step 2: Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Update the values with your Azure resources:

```bash
# Get values from Azure Portal
REACT_APP_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
REACT_APP_COSMOS_KEY=your-cosmos-primary-key
REACT_APP_AZURE_CLIENT_ID=your-azure-ad-client-id
REACT_APP_AZURE_TENANT_ID=your-azure-ad-tenant-id
```

## 🚀 Step 3: Deploy Application

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. The GitHub Action will automatically deploy to Azure Static Web Apps
3. Your app will be available at: `https://your-app-name.azurestaticapps.net`

### Manual Deployment

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy using Azure CLI
az staticwebapp create \
  --name swa-cpif-wizard \
  --resource-group rg-cpif-wizard \
  --source . \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

## 🔐 Step 4: Configure Azure AD Authentication

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Find your app registration
3. Configure authentication:
   - Add redirect URI: `https://your-app-name.azurestaticapps.net/.auth/login/aad/callback`
   - Enable ID tokens and access tokens
4. Add API permissions:
   - Microsoft Graph → User.Read
   - Microsoft Graph → User.ReadBasic.All
   - Microsoft Graph → Directory.Read.All

## 📊 Step 5: Configure Cosmos DB

1. Go to Azure Portal → Cosmos DB
2. Create database: `cpif-database`
3. Create container: `cpif-forms`
4. Set partition key: `/createdBy`
5. Enable serverless pricing tier

## 🔍 Step 6: Query Your Data

### Using Azure Portal Query Explorer

```sql
-- Get all CPIF forms
SELECT * FROM c

-- Get forms by user
SELECT * FROM c WHERE c.createdBy = "user-id"

-- Search by company name
SELECT * FROM c WHERE c.accountInfo.legalName = "Acme Corporation"
```

### Using Azure Data Explorer

```kql
// Get forms created this month
CPIFForms
| where timestamp >= ago(30d)
| project id, accountInfo.legalName, workdayInfo.totalContractAmount
| order by timestamp desc

// Count by wizard type
CPIFForms
| summarize count() by wizardType
| render piechart
```

## 💰 Cost Estimation

| Component | Development | Production |
|-----------|-------------|------------|
| Static Web Apps | $0 | $20 |
| Cosmos DB (Serverless) | $0-5 | $20-40 |
| Azure AD | $0 | $6/user/month |
| **Total** | **$0-5** | **$46-66** |

## 🎯 Next Steps

1. **Test the application** - Fill out a CPIF form
2. **Verify data persistence** - Check Cosmos DB for saved data
3. **Test employee dropdowns** - Ensure Azure AD integration works
4. **Set up monitoring** - Add Application Insights for production
5. **Configure backup** - Set up Cosmos DB backup policies

## 🔧 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check redirect URIs in Azure AD
   - Verify client ID and tenant ID

2. **Cosmos DB connection failed**
   - Check endpoint and key
   - Verify database and container names

3. **Employee data not loading**
   - Check Microsoft Graph permissions
   - Verify access token is valid

### Support

- Check Azure Static Web Apps logs
- Monitor Cosmos DB metrics
- Review Azure AD sign-in logs

## 🚀 Production Checklist

- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Configure backup policies
- [ ] Set up monitoring and alerts
- [ ] Configure security policies
- [ ] Test disaster recovery procedures

Your CPIF Wizard is now ready for production! 🎉

