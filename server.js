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

//const DEFAULT_TARGET = "http://5.180.181.103:8001"; // Set your default backend
const DEFAULT_TARGET = "http://192.168.178.35:8000"; // Set your default backend

// Create a single proxy instance that we can reuse
const proxyMiddleware = createProxyMiddleware({
    target: DEFAULT_TARGET,
    changeOrigin: true,
    secure: false,
    ws: true, // WebSocket support
    pathRewrite: { "^/api/proxy": "" },
    onProxyReq: (proxyReq, req) => {
        const target = req.headers["x-target-url"] || DEFAULT_TARGET;
        proxyReq.setHeader("X-Forwarded-Target", target); // Inform backend about the target
    },
    router: (req) => req.headers["x-target-url"] || DEFAULT_TARGET // Dynamic target
});

// Attach the proxy middleware
app.use("/api/proxy", proxyMiddleware);

// Handle WebSocket upgrades explicitly
app.on("upgrade", proxyMiddleware.upgrade);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
