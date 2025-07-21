#!/usr/bin/env node

/**
 * Bundle Analyzer Script for Nametag
 * Analyzes the webpack bundle and generates a report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  log('cyan', '🔍 Starting Bundle Analysis for Nametag...\n');
  
  try {
    // Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found. Please run this script from the project root.');
    }
    
    // Clean previous build
    log('yellow', '🧹 Cleaning previous build...');
    if (fs.existsSync('.next')) {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    
    // Set environment variable for analysis
    process.env.ANALYZE = 'true';
    
    // Build the application with analysis
    log('blue', '🔨 Building application with bundle analysis...');
    execSync('npm run build', { 
      stdio: 'inherit',
      env: { ...process.env, ANALYZE: 'true' }
    });
    
    // Check if report was generated
    const reportPath = path.join(process.cwd(), 'bundle-analyzer-report.html');
    if (fs.existsSync(reportPath)) {
      log('green', '✅ Bundle analysis complete!');
      log('cyan', `📊 Report generated: ${reportPath}`);
      log('magenta', '🌐 Open the HTML file in your browser to view the analysis');
      
      // Try to open automatically on macOS
      if (process.platform === 'darwin') {
        try {
          execSync(`open "${reportPath}"`, { stdio: 'ignore' });
          log('green', '🚀 Opening report in your default browser...');
        } catch (error) {
          log('yellow', '⚠️  Could not open browser automatically');
        }
      }
      
      // Show some basic stats
      showBuildStats();
      
    } else {
      log('red', '❌ Bundle analysis report not found');
      log('yellow', 'Make sure the build completed successfully');
    }
    
  } catch (error) {
    log('red', `❌ Error during bundle analysis: ${error.message}`);
    process.exit(1);
  }
}

function showBuildStats() {
  try {
    const buildManifest = path.join(process.cwd(), '.next/build-manifest.json');
    const staticDir = path.join(process.cwd(), '.next/static');
    
    if (fs.existsSync(buildManifest) && fs.existsSync(staticDir)) {
      log('cyan', '\n📈 Build Statistics:');
      
      // Calculate total build size
      const getDirectorySize = (dirPath) => {
        let totalSize = 0;
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            totalSize += getDirectorySize(itemPath);
          } else {
            totalSize += stats.size;
          }
        }
        
        return totalSize;
      };
      
      const staticSize = getDirectorySize(staticDir);
      const staticSizeMB = (staticSize / 1024 / 1024).toFixed(2);
      
      log('blue', `   Static files size: ${staticSizeMB} MB`);
      
      // Read build manifest for page info
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      const pageCount = Object.keys(manifest.pages || {}).length;
      
      log('blue', `   Total pages: ${pageCount}`);
      
      // Check for common large dependencies
      const nodeModulesCheck = [
        'react',
        'react-dom',
        'next',
        '@supabase/supabase-js',
        'lucide-react',
      ];
      
      log('cyan', '\n📦 Key Dependencies:');
      nodeModulesCheck.forEach(dep => {
        const depPath = path.join(process.cwd(), 'node_modules', dep);
        if (fs.existsSync(depPath)) {
          log('green', `   ✅ ${dep}`);
        } else {
          log('red', `   ❌ ${dep} (missing)`);
        }
      });
      
    }
  } catch (error) {
    log('yellow', '⚠️  Could not read build statistics');
  }
  
  log('cyan', '\n💡 Optimization Tips:');
  log('white', '   • Look for large chunks in the report');
  log('white', '   • Check for duplicate dependencies');
  log('white', '   • Consider code splitting for large components');
  log('white', '   • Use dynamic imports for heavy features');
  log('white', '   • Optimize images and fonts');
}

if (require.main === module) {
  main();
}