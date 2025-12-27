const fs = require('fs');
const path = require('path');

// Convert @/ alias to relative path
function convertAliasToRelative(fromFile, aliasPath) {
    // Remove @/ prefix - it maps to src/
    const targetPath = aliasPath.replace('@/', '');

    // Get directory of the source file
    const fromDir = path.dirname(fromFile);

    // Construct absolute paths
    const fromAbs = path.resolve('backend/src', fromDir.replace('backend/src/', ''));
    const toAbs = path.resolve('backend/src', targetPath);

    // Calculate relative path
    let relativePath = path.relative(fromAbs, toAbs);

    // Convert Windows backslashes to forward slashes
    relativePath = relativePath.split(path.sep).join('/');

    // Ensure it starts with ./  or ../
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }

    // Add .js extension if not present and not a directory index
    if (!relativePath.endsWith('.js') && !relativePath.endsWith('/')) {
        // Check if it's likely an index file
        if (relativePath.endsWith('/index')) {
            relativePath += '.js';
        } else {
            // Check if the path exists as a directory
            const fullPath = path.resolve(fromAbs, relativePath);
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                relativePath += '/index.js';
            } else {
                relativePath += '.js';
            }
        }
    }

    return relativePath;
}

// Process a single file
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let count = 0;

    // Match require('@/...') patterns
    const requirePattern = /require\(['"]@\/([^'"]+)['"]\)/g;

    content = content.replace(requirePattern, (match, aliasPath) => {
        const relativePath = convertAliasToRelative(filePath, '@/' + aliasPath);
        modified = true;
        count++;
        return `require('${relativePath}')`;
    });

    // Match import from '@/...' patterns
    const importPattern = /from\s+['"]@\/([^'"]+)['"]/g;

    content = content.replace(importPattern, (match, aliasPath) => {
        const relativePath = convertAliasToRelative(filePath, '@/' + aliasPath);
        modified = true;
        count++;
        return `from '${relativePath}'`;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${filePath}: ${count} imports converted`);
        return count;
    }

    return 0;
}

// Find all JS files recursively
function findJSFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules
            if (file !== 'node_modules') {
                findJSFiles(filePath, fileList);
            }
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Main execution
console.log('🚀 Starting automated @/ alias conversion...\n');

const srcDir = 'backend/src';
const jsFiles = findJSFiles(srcDir);

console.log(`📁 Found ${jsFiles.length} JavaScript files\n`);

let totalFilesModified = 0;
let totalImportsConverted = 0;

jsFiles.forEach(file => {
    const count = processFile(file);
    if (count > 0) {
        totalFilesModified++;
        totalImportsConverted += count;
    }
});

console.log('\n📊 CONVERSION SUMMARY:');
console.log('═'.repeat(50));
console.log(`✅ Files modified: ${totalFilesModified}`);
console.log(`✅ Imports converted: ${totalImportsConverted}`);
console.log(`✅ Files scanned: ${jsFiles.length}`);
console.log('═'.repeat(50));

if (totalFilesModified > 0) {
    console.log('\n✨ Conversion complete! All @/ aliases have been converted to relative paths with .js extensions.');
} else {
    console.log('\n✨ No @/ aliases found. All files are already using relative paths!');
}
