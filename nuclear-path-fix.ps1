# Nuclear Path Fix Script - Replace all ../../../ with paths.js

$replacements = @{
    # Maps that need to be replaced
    "../../../controllers/middlewaresControllers/createCRUDController/index.js" = "paths.createCRUDController"
    "../../../controllers/pdfController/index.js" = "paths.pdfController"
    "../../../middlewares/settings/index.js" = "paths.settings"
    "../../../helpers.js" = "paths.helpers"
    "../../../models/appModels/Card.js" = "paths.CardModel"
    "../../../models/utils/index.js" = "paths.modelsUtils"
}

$files = Get-ChildItem -Path "backend\src\controllers" -Recurse -Filter "*.js"
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    $modified = $false
    
    # Check if file already has paths
    $hasPaths = $content -match "const paths = require\("
    
    foreach ($key in $replacements.Keys) {
        $value = $replacements[$key]
        
        if ($content -match [regex]::Escape($key)) {
            # Add paths import at top if not present
            if (-not $hasPaths) {
                # Find the first require statement
                if ($content -match "(?m)^(const .+ = require\(.+\);?)") {
                    $firstRequire = $matches[0]
                    $pathsImport = "const paths = require('../../../config/paths.js');`r`n"
                    $content = $content.Replace($firstRequire, $pathsImport + $firstRequire)
                    $hasPaths = $true
                }
            }
            
            # Replace the path with paths.variable
            $pattern = "require\(['""]" + [regex]::Escape($key) + "['""]\)"
            $replacement = "require($value)"
            $content = $content -replace $pattern, $replacement
            $modified = $true
        }
    }
    
    if ($modified -and $content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Fixed: $($file.Name)"
        $fixedCount++
    }
}

Write-Host "`n✅ Total files fixed: $fixedCount"
