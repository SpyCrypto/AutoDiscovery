#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const { createReadStream } = require('fs');

// Simple HTTP server to serve the frontend
function serveStatic(port, distDir, label) {
  const server = createServer((req, res) => {
    // Default to index.html for SPA routing
    let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
    
    // Normalize path
    filePath = path.normalize(filePath);
    
    // Prevent directory traversal
    if (!filePath.startsWith(path.normalize(distDir))) {
      filePath = path.join(distDir, 'index.html');
    }
    
    // Check if file exists
    fs.stat(filePath, (err, stat) => {
      if (err || stat.isDirectory()) {
        // Serve index.html for 404 (SPA routing)
        filePath = path.join(distDir, 'index.html');
      }
      
      // Determine content type
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      if (ext === '.js') contentType = 'application/javascript';
      if (ext === '.css') contentType = 'text/css';
      if (ext === '.wasm') contentType = 'application/wasm';
      if (ext === '.json') contentType = 'application/json';
      if (ext === '.svg') contentType = 'image/svg+xml';
      if (ext === '.png') contentType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      
      res.writeHead(200, { 'Content-Type': contentType });
      createReadStream(filePath).pipe(res);
    });
  });
  
  server.listen(port, () => {
    console.log(`✓ ${label} running on http://localhost:${port}`);
  });
  
  return server;
}

// Start both frontends
const realdealDist = path.join(__dirname, 'frontend-realdeal', 'dist');
const demolandDist = path.join(__dirname, 'frontend-demoland-vite-react', 'dist');

serveStatic(5174, realdealDist, 'RealDeal Frontend');
serveStatic(5173, demolandDist, 'Demoland Frontend');

console.log('\n✅ AutoDiscovery Local Frontend Server Started!\n');
console.log('Services running:');
console.log('  RealDeal (Main UI):  http://localhost:5174');
console.log('  Demoland (Demo UI):  http://localhost:5173');
console.log('  Redis Cache:         localhost:6379');
console.log('  PostgreSQL:          localhost:5432\n');
console.log('Ready to test! Open http://localhost:5174 in your browser.\n');
