import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://ronitattoo.com';
const PUBLIC_DIR = path.join(__dirname, 'public');

// Function to scan routes from App.tsx
function scanRoutes() {
  const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
  const content = fs.readFileSync(appTsxPath, 'utf-8');
  
  // Extract routes using regex
  const routeMatches = content.matchAll(/<Route\s+path="([^"]+)"/g);
  const routes = [];
  
  for (const match of routeMatches) {
    const route = match[1];
    // Skip catch-all routes and dynamic routes
    if (route !== '*' && !route.includes(':')) {
      routes.push(route === '/' ? '/' : route);
    }
  }
  
  return routes;
}

// Function to generate sitemap.xml
function generateSitemap(routes) {
  const urlEntries = routes.map((route, index) => {
    let priority = '0.8';
    if (route === '/') priority = '1.0';
    else if (route === '/about') priority = '0.9';
    
    return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return sitemap;
}

// Function to ensure robots.txt is correct
function ensureRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /
Sitemap: ${DOMAIN}/sitemap.xml`;

  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
}

// Main execution
try {
  console.log('🔍 Scanning project routes...');
  const routes = scanRoutes();
  console.log(`📄 Found ${routes.length} routes:`, routes);

  console.log('📝 Generating sitemap.xml...');
  const sitemap = generateSitemap(routes);
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

  console.log('🤖 Updating robots.txt...');
  ensureRobotsTxt();

  console.log('✅ SEO sitemap updated successfully for ronitattoo.com');
} catch (error) {
  console.error('❌ Error updating SEO files:', error.message);
  process.exit(1);
}
