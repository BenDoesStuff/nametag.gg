#!/usr/bin/env tsx

/**
 * Link Checker Script for Nametag
 * Crawls the site and checks for 404s and broken links
 */

import { execSync } from 'child_process';
import https from 'https';
import http from 'http';

interface LinkCheckResult {
  url: string;
  status: number;
  error?: string;
  redirectTo?: string;
}

class LinkChecker {
  private baseUrl: string;
  private checkedUrls = new Set<string>();
  private results: LinkCheckResult[] = [];
  private maxDepth: number;
  private userAgent = 'Nametag-LinkChecker/1.0';

  constructor(baseUrl: string, maxDepth = 2) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.maxDepth = maxDepth;
  }

  /**
   * Check a single URL
   */
  private async checkUrl(url: string): Promise<LinkCheckResult> {
    return new Promise((resolve) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000,
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        const status = res.statusCode || 0;
        const location = res.headers.location;
        
        resolve({
          url,
          status,
          redirectTo: location ? new URL(location, url).href : undefined,
        });
      });

      req.on('error', (error) => {
        resolve({
          url,
          status: 0,
          error: error.message,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 0,
          error: 'Request timeout',
        });
      });

      req.end();
    });
  }

  /**
   * Extract links from HTML content
   */
  private extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    
    // Simple regex to find href attributes
    const hrefRegex = /href\s*=\s*["']([^"']+)["']/gi;
    let match;
    
    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      
      // Skip non-HTTP links
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        continue;
      }
      
      try {
        // Convert relative URLs to absolute
        const absoluteUrl = new URL(href, baseUrl).href;
        
        // Only check internal links for crawling
        if (absoluteUrl.startsWith(this.baseUrl)) {
          links.push(absoluteUrl);
        }
      } catch (error) {
        // Invalid URL, skip
      }
    }
    
    return [...new Set(links)]; // Remove duplicates
  }

  /**
   * Fetch page content
   */
  private async fetchPage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 15000,
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Crawl the site recursively
   */
  private async crawl(url: string, depth = 0): Promise<void> {
    if (depth > this.maxDepth || this.checkedUrls.has(url)) {
      return;
    }

    console.log(`🔍 Checking: ${url}`);
    this.checkedUrls.add(url);

    const result = await this.checkUrl(url);
    this.results.push(result);

    // If it's a successful HTML page, crawl its links
    if (result.status === 200 && depth < this.maxDepth) {
      try {
        const html = await this.fetchPage(url);
        const links = this.extractLinks(html, url);
        
        // Crawl found links
        for (const link of links) {
          await this.crawl(link, depth + 1);
        }
      } catch (error) {
        console.log(`⚠️  Could not crawl ${url}: ${error}`);
      }
    }
  }

  /**
   * Run the link check
   */
  async run(): Promise<void> {
    console.log(`🚀 Starting link check for ${this.baseUrl}`);
    console.log(`📊 Max depth: ${this.maxDepth}\n`);
    
    await this.crawl(this.baseUrl);
    
    console.log('\n📈 Results Summary:');
    console.log('==================');
    
    const statusCounts = new Map<number, number>();
    const errors: LinkCheckResult[] = [];
    
    for (const result of this.results) {
      const status = result.error ? 0 : result.status;
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      
      if (status >= 400 || result.error) {
        errors.push(result);
      }
    }
    
    // Print status summary
    for (const [status, count] of statusCounts.entries()) {
      const emoji = this.getStatusEmoji(status);
      const label = status === 0 ? 'Errors' : `${status}`;
      console.log(`${emoji} ${label}: ${count}`);
    }
    
    console.log(`\n🔗 Total URLs checked: ${this.results.length}`);
    
    // Print errors
    if (errors.length > 0) {
      console.log('\n❌ Issues Found:');
      console.log('================');
      
      for (const error of errors) {
        const status = error.error ? 'ERROR' : error.status;
        const message = error.error || 'HTTP error';
        console.log(`${status}: ${error.url}`);
        if (error.error) {
          console.log(`   └─ ${message}`);
        }
      }
      
      process.exit(1);
    } else {
      console.log('\n✅ All links are working correctly!');
    }
  }

  private getStatusEmoji(status: number): string {
    if (status === 0) return '❌';
    if (status >= 200 && status < 300) return '✅';
    if (status >= 300 && status < 400) return '🔄';
    if (status >= 400 && status < 500) return '⚠️';
    if (status >= 500) return '💥';
    return '❓';
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || 'http://localhost:3000';
  const maxDepth = parseInt(args[1]) || 2;
  
  console.log('🔗 Nametag Link Checker');
  console.log('========================\n');
  
  // Check if the site is running
  try {
    const checker = new LinkChecker(baseUrl, maxDepth);
    await checker.run();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}