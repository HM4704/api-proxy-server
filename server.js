const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

// Proxy API requests
app.use(
    "/api/proxy",
    createProxyMiddleware({
        target: "http://113.30.191.219:8001", // Change this to your HTTP API
        changeOrigin: true,
        secure: false,
        ws: true,  // Enables WebSocket proxying
        pathRewrite: { "^/api/proxy": "" },
    })
);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
