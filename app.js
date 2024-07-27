const http = require('http');
const httpProxy = require('http-proxy');
const morgan = require('morgan');
const { createServer } = require('http');
const express = require('express');

// List of target sites
const targetSites = [
    { name: 'site1', url: 'https://chatgpt.com/' },
    { name: 'site2', url: 'https://motherless.com/' },
    // Add more sites as needed
];

// Create a proxy server
const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: false,
});

// Create an Express application
const app = express();

// Use morgan for logging HTTP requests
app.use(morgan('combined'));

// Middleware for handling requests
app.use((req, res) => {
    // Extract the site name from the request path or query parameters
    let target = targetSites[0].url; // Default target

    // Example: Choose target based on request path or query
    const siteNameMatch = req.url.match(/\/(\w+)/);
    if (siteNameMatch) {
        const siteName = siteNameMatch[1];
        const site = targetSites.find(s => s.name === siteName);
        if (site) {
            target = site.url;
        }
    }

    // Proxy the request to the selected target site
    proxy.web(req, res, { target }, (err) => {
        // Handle errors during proxying
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Something went wrong while proxying the request.');
    });
});

// Start the server
const PORT = process.env.PORT || 60; // Render uses environment variables for port configuration
//const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
