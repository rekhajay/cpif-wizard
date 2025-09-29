# 🚀 CPIF Wizard - Azure Deployment Guide

This guide will help you deploy your CPIF Wizard to Azure using GitHub Actions CI/CD.

## 📋 Prerequisites

- ✅ Azure CLI installed and configured
- ✅ GitHub repository with your code
- ✅ Azure subscription with appropriate permissions

## 🚀 Quick Start

### **Step 1: Run the Setup Script**

From your project directory, run:
```powershell
.\deploy-setup.ps1
```

This script will:
- Create Azure resource group
- Deploy Static Web App and Cosmos DB
- Get the necessary tokens and keys
- Display instructions for GitHub secrets

### **Step 2: Configure GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and Variables → Actions

Add these secrets:

#### **Required Secrets:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - From the setup script output
- `AZURE_CREDENTIALS` - JSON with your Azure service principal

#### **Optional Secrets (for local development):**
- `REACT_APP_COSMOS_ENDPOINT` - Your Cosmos DB endpoint
- `REACT_APP_COSMOS_KEY` - Your Cosmos DB key

### **Step 3: Push to GitHub**

```bash
git add .
git commit -m "Add CI/CD pipeline for Azure deployment"
git push origin main
```

### **Step 4: Monitor Deployment**

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Watch the "Build and Deploy to Azure Static Web Apps" workflow
4. Once complete, your app will be available at: `https://swa-cpif-wizard.azurestaticapps.net`

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### **1. Create Azure Resources**

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-cpif-wizard --location eastus

# Deploy infrastructure
az deployment group create \
  --resource-group rg-cpif-wizard \
  --template-file azure-resources.bicep \
  --parameters staticWebAppName=swa-cpif-wizard \
  --parameters cosmosAccountName=cosmos-cpif-wizard
```

### **2. Get Static Web App Token**

```bash
az staticwebapp secrets list --name swa-cpif-wizard --query "properties.apiKey" --output tsv
```

### **3. Get Cosmos DB Credentials**

```bash
# Get endpoint
az cosmosdb show --name cosmos-cpif-wizard --resource-group rg-cpif-wizard --query "documentEndpoint" --output tsv

# Get key
az cosmosdb keys list --name cosmos-cpif-wizard --resource-group rg-cpif-wizard --query "primaryMasterKey" --output tsv
```

## 🎯 What Gets Deployed

### **Azure Static Web Apps**
- ✅ Frontend React application
- ✅ Global CDN distribution
- ✅ Custom domain support
- ✅ SSL certificates

### **Azure Cosmos DB**
- ✅ NoSQL database for CPIF forms
- ✅ Global distribution
- ✅ Automatic scaling
- ✅ Built-in security

### **GitHub Actions CI/CD**
- ✅ Automatic builds on push
- ✅ Environment-specific deployments
- ✅ Rollback capabilities
- ✅ Security scanning

## 🔒 Security Features

- ✅ HTTPS by default
- ✅ Azure AD integration ready
- ✅ Environment variables for secrets
- ✅ Network security groups
- ✅ Private endpoints (optional)

## 📊 Monitoring & Analytics

- ✅ Application Insights integration
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ Usage analytics

## 🚀 Next Steps After Deployment

1. **Configure Custom Domain** (optional)
2. **Set up Azure AD authentication**
3. **Configure monitoring alerts**
4. **Set up backup policies**
5. **Configure staging environments**

## 🆘 Troubleshooting

### **Common Issues:**

1. **"Azure CLI not found"**
   - Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

2. **"Permission denied"**
   - Ensure you have Contributor access to the Azure subscription

3. **"Resource group not found"**
   - Run the setup script again or create manually

4. **"GitHub secrets not working"**
   - Double-check secret names and values
   - Ensure secrets are added to the correct repository

### **Getting Help:**

- 📚 [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- 📚 [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- 📚 [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🎉 Success!

Once deployed, your CPIF Wizard will be available at:
**https://swa-cpif-wizard.azurestaticapps.net**

The application will automatically:
- ✅ Build and deploy on every push
- ✅ Store form data in Cosmos DB
- ✅ Scale automatically
- ✅ Provide global performance
