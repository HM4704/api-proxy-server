const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

// install
// npm install express http-proxy-middleware cors
//
// start:
// node server.js
//
// or:
// npm install -g nodemon
// nodemon server.js
//
// or:
// pm2 start server.js --name proxy-server
// pm2 save
// pm2 startup

const DEFAULT_TARGET = "http://5.180.181.103:8001"; // Set your default backend
//const DEFAULT_TARGET = "http://192.168.178.35:8000"; // Set your default backend

// Create a single proxy instance that we can reuse
const proxyMiddleware = createProxyMiddleware({
    target: DEFAULT_TARGET,
    changeOrigin: true,
    secure: false,
    ws: true, // WebSocket support
    pathRewrite: { "^/api/proxy": "" },
    logLevel: "debug",  // Enable debug logging
    logger: console,
    onProxyReqWs: (proxyReq, req, socket, options) => {
        console.log(`WebSocket connection request to: ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
    },
    router: (req) => req.headers["x-target-url"] || DEFAULT_TARGET
});

// Attach the proxy middleware
app.use("/api/proxy", proxyMiddleware);

// Explicitly handle WebSocket upgrades
app.on("upgrade", (req, socket, head) => {
    console.log(`WebSocket upgrade request received for: ${req.url}`);
    proxyMiddleware.upgrade(req, socket, head);
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
