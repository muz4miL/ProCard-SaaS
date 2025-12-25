# ProCard SaaS - Phase 1 Cleanup Script
# This script removes ERP-specific files while preserving Auth/User system

Write-Host "🚀 ProCard SaaS - Phase 1: The Cleanup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = "c:\Users\Lenovo\.gemini\antigravity\scratch\ProCard-SaaS"

# Track deletions
$deletedFiles = @()
$deletedDirs = @()
$errors = @()

# Helper function
function Remove-ItemSafely {
    param($Path, $Type)
    try {
        if (Test-Path $Path) {
            Remove-Item -Path $Path -Recurse -Force
            if ($Type -eq "File") {
                $deletedFiles += $Path
            } else {
                $deletedDirs += $Path
            }
            Write-Host "✅ Deleted: $Path" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Not found: $Path" -ForegroundColor Yellow
        }
    } catch {
        $errors += "Failed to delete $Path : $_"
        Write-Host "❌ Error: $Path - $_" -ForegroundColor Red
    }
}

Write-Host "BACKEND CLEANUP" -ForegroundColor Yellow
Write-Host "---------------" -ForegroundColor Yellow

# Backend Models
Write-Host "`n📦 Removing ERP Models..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\backend\src\models\appModels\Invoice.js" "File"
Remove-ItemSafely "$rootPath\backend\src\models\appModels\Payment.js" "File"
Remove-ItemSafely "$rootPath\backend\src\models\appModels\PaymentMode.js" "File"
Remove-ItemSafely "$rootPath\backend\src\models\appModels\Quote.js" "File"
Remove-ItemSafely "$rootPath\backend\src\models\appModels\Taxes.js" "File"
# Keep Client.js for now, will refactor to Cards

# Backend Controllers
Write-Host "`n🎮 Removing ERP Controllers..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\backend\src\controllers\appControllers\invoiceController" "Dir"
Remove-ItemSafely "$rootPath\backend\src\controllers\appControllers\paymentController" "Dir"
Remove-ItemSafely "$rootPath\backend\src\controllers\appControllers\paymentModeController" "Dir"
Remove-ItemSafely "$rootPath\backend\src\controllers\appControllers\quoteController" "Dir"
Remove-ItemSafely "$rootPath\backend\src\controllers\appControllers\taxesController" "Dir"

# PDF Templates (we'll recreate for vCard)
Write-Host "`n📄 Removing Invoice/Quote PDF Templates..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\backend\src\pdf\invoice" "Dir"
Remove-ItemSafely "$rootPath\backend\src\pdf\quote" "Dir"

Write-Host "`n`nFRONTEND CLEANUP" -ForegroundColor Yellow
Write-Host "----------------" -ForegroundColor Yellow

# Frontend Pages
Write-Host "`n📱 Removing ERP Pages..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\frontend\src\pages\Invoice" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\pages\Payment" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\pages\PaymentMode" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\pages\Quote" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\pages\Taxes" "Dir"

# Frontend Forms
Write-Host "`n📝 Removing ERP Forms..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\frontend\src\forms\InvoiceForm.jsx" "File"
Remove-ItemSafely "$rootPath\frontend\src\forms\QuoteForm.jsx" "File"
Remove-ItemSafely "$rootPath\frontend\src\forms\PaymentForm.jsx" "File"
Remove-ItemSafely "$rootPath\frontend\src\forms\PaymentModeForm.jsx" "File"
Remove-ItemSafely "$rootPath\frontend\src\forms\TaxesForm.jsx" "File"

# Frontend Modules
Write-Host "`n🧩 Removing ERP Modules..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\frontend\src\modules\InvoiceModule" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\modules\QuoteModule" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\modules\PaymentModule" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\modules\PaymentModeModule" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\modules\TaxesModule" "Dir"

# Redux Slices
Write-Host "`n🔄 Removing ERP Redux Slices..." -ForegroundColor Magenta
Remove-ItemSafely "$rootPath\frontend\src\redux\invoice" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\redux\quote" "Dir"
Remove-ItemSafely "$rootPath\frontend\src\redux\payment" "Dir"

# Summary Report
Write-Host "`n`n================================================" -ForegroundColor Cyan
Write-Host "CLEANUP SUMMARY" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Files Deleted: $($deletedFiles.Count)" -ForegroundColor Green
Write-Host "✅ Directories Deleted: $($deletedDirs.Count)" -ForegroundColor Green

if ($errors.Count -gt 0) {
    Write-Host "❌ Errors: $($errors.Count)" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
} else {
    Write-Host "🎉 No Errors!" -ForegroundColor Green
}

Write-Host "`n`n📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Review the deleted files list above" -ForegroundColor White
Write-Host "2. Run 'npm install qrcode.react vcard-creator vite-plugin-pwa' in frontend/" -ForegroundColor White
Write-Host "3. Run 'npm install qrcode vcard-creator' in backend/" -ForegroundColor White
Write-Host "4. Create Card controller in backend/src/controllers/appControllers/cardController/" -ForegroundColor White
Write-Host "5. Update navigation and routing files" -ForegroundColor White
Write-Host "`n🚀 ProCard SaaS Cleanup Complete! Ready for Phase 2." -ForegroundColor Green
