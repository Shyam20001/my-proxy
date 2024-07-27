// const express = require('express');
// const httpProxy = require('http-proxy');
// const morgan = require('morgan');

// // List of target sites
// const targetSites = [
//     { name: 'site1', url: 'https://chatgpt.com/' },
//     { name: 'site2', url: 'https://motherless.com/' },
//     // Add more sites as needed
// ];

// // Create a proxy server
// const proxy = httpProxy.createProxyServer({
//     changeOrigin: true,
//     secure: false, // Consider setting this to true if using HTTPS
// });

// // Create an Express application
// const app = express();

// // Use morgan for logging HTTP requests
// app.use(morgan('combined'));

// // Middleware for handling CORS
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
//     // Handle CORS preflight requests
//     if (req.method === 'OPTIONS') {
//         res.writeHead(204);
//         res.end();
//         return;
//     }
    
//     next();
// });

// // Middleware for handling proxy requests
// app.use((req, res) => {
//     // Extract the site name from the request path or query parameters
//     let target = targetSites[0].url; // Default target

//     // Example: Choose target based on request path or query
//     const siteNameMatch = req.url.match(/^\/(\w+)/);
//     if (siteNameMatch) {
//         const siteName = siteNameMatch[1];
//         const site = targetSites.find(s => s.name === siteName);
//         if (site) {
//             target = site.url;
//         }
//     }

//     // Proxy the request to the selected target site
//     proxy.web(req, res, { target }, (err) => {
//         // Handle errors during proxying
//         console.error('Proxy error:', err);
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Something went wrong while proxying the request.');
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 10000; // Render uses environment variables for port configuration
// app.listen(PORT, () => {
//     console.log(`Proxy server listening on port ${PORT}`);
// });////////////////////////////////////////////////////////////////////////////////////////////////////////


// const httpProxy = require('http-proxy');
// const http = require('http');

// const proxy = httpProxy.createProxyServer({
//   secure: false // Optional, if using HTTP
// });

// proxy.on('error', (err, req, res) => {
//   console.error('Proxy error:', err);
//   res.writeHead(500, { 'Content-Type': 'text/plain' });
//   res.end('Something went wrong.');
// });

// const server = http.createServer((req, res) => {
//   req.headers.host = 'playvids.com';

//   proxy.web(req, res, { target: 'https://playvids.com' });
// }); 

// server.listen(process.env.PORT || 4200, () => {
//   console.log(`server active @${process.env.PORT}`);
// });


/////////////////////////////////////////////////////////////////////////////////////////////////

const httpProxy = require('http-proxy');
const http = require('http');
const url = require('url');

// Mapping of paths to target sites
const pathMappings = {
  '/site1': 'https://playvids.com',
  '/site2': 'https://motherless.com', // Add more mappings as needed
  '/site3': 'https://chatgpt.com',
};

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  secure: false // Optional, if using HTTP
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Something went wrong.');
});

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const target = pathMappings[parsedUrl.pathname];
  
  if (target) {
    req.headers.host = new URL(target).host; // Set the host header to the target domain
    proxy.web(req, res, { target });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Site not found.');
  }
});

server.listen(process.env.PORT || 4200, () => {
  console.log(`Server active @${process.env.PORT || 4200}`);
});
