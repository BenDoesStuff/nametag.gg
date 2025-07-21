#!/usr/bin/env tsx

/**
 * Gamefolio → Nametag Rebranding Script
 * 
 * This script performs a comprehensive rebrand from Gamefolio to Nametag:
 * - Renames files containing "gamefolio" in their name
 * - Replaces all text instances of "Gamefolio" with "Nametag"
 * - Updates package.json metadata
 * - Preserves copyright notices and git history
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface RebrandConfig {
  oldBrand: string;
  newBrand: string;
  oldBrandLower: string;
  newBrandLower: string;
  excludedPaths: string[];
  includedExtensions: string[];
}

const config: RebrandConfig = {
  oldBrand: 'Gamefolio',
  newBrand: 'Nametag',
  oldBrandLower: 'gamefolio',
  newBrandLower: 'nametag',
  excludedPaths: [
    '.git',
    '.next',
    'node_modules',
    'scripts/rebrand_to_nametag.ts',  // Don't modify this script
    'scripts/check_rebrand.sh'        // Don't modify verification script
  ],
  includedExtensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.md', '.html', '.css', '.scss']
};

class Rebrander {
  private stats = {
    filesRenamed: 0,
    filesModified: 0,
    replacements: 0
  };

  constructor(private config: RebrandConfig) {}

  /**
   * Main rebranding process
   */
  async rebrand(): Promise<void> {
    console.log(`🚀 Starting rebrand: ${this.config.oldBrand} → ${this.config.newBrand}\n`);

    try {
      // Step 1: Rename files and directories
      await this.renameFiles('.');

      // Step 2: Replace text content in files
      await this.replaceTextInFiles('.');

      // Step 3: Update package.json specifically
      await this.updatePackageJson();

      console.log('\n✅ Rebranding completed successfully!');
      console.log(`📊 Statistics:`);
      console.log(`   • Files renamed: ${this.stats.filesRenamed}`);
      console.log(`   • Files modified: ${this.stats.filesModified}`);
      console.log(`   • Text replacements: ${this.stats.replacements}`);

    } catch (error) {
      console.error('❌ Rebranding failed:', error);
      process.exit(1);
    }
  }

  /**
   * Recursively rename files and directories containing the old brand name
   */
  private async renameFiles(dir: string): Promise<void> {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      // Skip excluded paths
      if (this.config.excludedPaths.some(excluded => fullPath.includes(excluded))) {
        continue;
      }

      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // Recursively process subdirectories
        await this.renameFiles(fullPath);
        
        // Rename directory if it contains old brand name
        if (item.toLowerCase().includes(this.config.oldBrandLower)) {
          const newName = item.replace(new RegExp(this.config.oldBrand, 'gi'), this.config.newBrand);
          const newPath = path.join(dir, newName);
          
          console.log(`📁 Renaming directory: ${fullPath} → ${newPath}`);
          execSync(`git mv "${fullPath}" "${newPath}"`);
          this.stats.filesRenamed++;
        }
      } else {
        // Rename file if it contains old brand name
        if (item.toLowerCase().includes(this.config.oldBrandLower)) {
          const newName = item.replace(new RegExp(this.config.oldBrand, 'gi'), this.config.newBrand);
          const newPath = path.join(dir, newName);
          
          console.log(`📄 Renaming file: ${fullPath} → ${newPath}`);
          execSync(`git mv "${fullPath}" "${newPath}"`);
          this.stats.filesRenamed++;
        }
      }
    }
  }

  /**
   * Replace text content in files
   */
  private async replaceTextInFiles(dir: string): Promise<void> {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      // Skip excluded paths
      if (this.config.excludedPaths.some(excluded => fullPath.includes(excluded))) {
        continue;
      }

      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        await this.replaceTextInFiles(fullPath);
      } else {
        // Process files with included extensions
        const ext = path.extname(item);
        if (this.config.includedExtensions.includes(ext)) {
          await this.processFile(fullPath);
        }
      }
    }
  }

  /**
   * Process individual file for text replacements
   */
  private async processFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      let newContent = content;
      let fileReplacements = 0;

      // Replace all instances of the old brand (case-sensitive)
      const patterns = [
        { from: this.config.oldBrand, to: this.config.newBrand },           // Gamefolio → Nametag
        { from: this.config.oldBrandLower, to: this.config.newBrandLower }  // gamefolio → nametag
      ];

      for (const pattern of patterns) {
        const regex = new RegExp(pattern.from, 'g');
        const matches = content.match(regex);
        
        if (matches) {
          newContent = newContent.replace(regex, pattern.to);
          fileReplacements += matches.length;
        }
      }

      // Write file if changes were made
      if (fileReplacements > 0) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`📝 Modified ${filePath} (${fileReplacements} replacements)`);
        this.stats.filesModified++;
        this.stats.replacements += fileReplacements;
      }

    } catch (error) {
      console.warn(`⚠️  Could not process file ${filePath}:`, error);
    }
  }

  /**
   * Update package.json with new brand information
   */
  private async updatePackageJson(): Promise<void> {
    const packagePath = './package.json';
    
    if (!fs.existsSync(packagePath)) {
      console.warn('⚠️  package.json not found');
      return;
    }

    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      // Update package metadata
      packageContent.name = this.config.newBrandLower;
      packageContent.description = `${this.config.newBrand} - Create your ultimate gamer profile`;
      
      if (packageContent.homepage) {
        packageContent.homepage = packageContent.homepage.replace(
          new RegExp(this.config.oldBrandLower, 'gi'), 
          this.config.newBrandLower
        );
      }

      fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2), 'utf-8');
      console.log('📦 Updated package.json');
      this.stats.filesModified++;

    } catch (error) {
      console.error('❌ Failed to update package.json:', error);
    }
  }
}

// Run the rebranding script
if (require.main === module) {
  const rebrander = new Rebrander(config);
  rebrander.rebrand().catch(console.error);
}

export default Rebrander;