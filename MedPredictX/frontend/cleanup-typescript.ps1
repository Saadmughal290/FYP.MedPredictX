$ErrorActionPreference = "Continue"

Write-Host "Cleaning up remaining TypeScript syntax..." -ForegroundColor Yellow

Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse | ForEach-Object {
    try {
        $content = Get-Content $_.FullName -Raw
        $modified = $false
        
        # Remove VariantProps from imports
        if ($content -match ', VariantProps') {
            $content = $content -replace ', VariantProps', ''
            $modified = $true
        }
        if ($content -match 'VariantProps, ') {
            $content = $content -replace 'VariantProps, ', ''
            $modified = $true
        }
        
        # Remove type intersection with VariantProps
        if ($content -match '\} & VariantProps<typeof \w+>') {
            $content = $content -replace '\} & VariantProps<typeof \w+>', '}'
            $modified = $true
        }
        
        # Remove standalone VariantProps lines
        if ($content -match '  VariantProps<typeof \w+>') {
            $content = $content -replace '\s*VariantProps<typeof \w+>\s*\n', ''
            $modified = $true
        }
        
        if ($modified) {
            Set-Content $_.FullName -Value $content -NoNewline
            Write-Host "✓ Fixed: $($_.Name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "✗ Skipped (file in use): $($_.Name)" -ForegroundColor Red
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
