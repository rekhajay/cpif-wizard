# PowerShell script to commit and push CPIF Wizard to GitHub
# Run this script from your project directory

Write-Host "🚀 Preparing CPIF Wizard for GitHub deployment..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository. Initializing..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    Write-Host "⚠️  Please update the remote URL above with your actual GitHub repository" -ForegroundColor Yellow
}

# Add all files
Write-Host "📁 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Add CPIF Wizard with Azure CI/CD pipeline

- React-based CPIF creation wizard
- Azure Static Web Apps deployment
- Cosmos DB integration
- GitHub Actions CI/CD
- Azure AD integration ready
- Horizontal scrollable form layout
- Employee dropdown integration"

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository" -ForegroundColor White
Write-Host "2. Check the Actions tab for deployment status" -ForegroundColor White
Write-Host "3. Once deployed, your app will be at: https://swa-cpif-wizard.azurestaticapps.net" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Don't forget to:" -ForegroundColor Yellow
Write-Host "- Set up GitHub secrets (see DEPLOYMENT-GUIDE.md)" -ForegroundColor White
Write-Host "- Run .\deploy-setup.ps1 to create Azure resources" -ForegroundColor White
