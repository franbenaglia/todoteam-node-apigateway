const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 8085;
const HOST = "localhost";

const API_SECURITY_URL = "http://localhost:8081";
const API_RESOURCES_URL = "http://localhost:8080";


app.get("/status", (req, res, next) => {
    res.send('This is a proxy service');
});

const proxySecurityOptions = {
    target: API_SECURITY_URL,
    changeOrigin: true,
    pathRewrite: {
        //    ['^authenticate']: '/auth/authenticate',  
    },
};

const proxyResourcesOptions = {
    target: API_RESOURCES_URL,
    changeOrigin: true,
    pathRewrite: {
        // [`^api/task/`]: '/api/task/**',   
        // [`^auth/github/`]: '/auth/github/**',
        // [`^auth/`]: '/auth/**',
    },
};

const proxySecurity = createProxyMiddleware(proxySecurityOptions);
const proxyResources = createProxyMiddleware(proxyResourcesOptions);

app.use('/auth/authenticate', proxySecurity);
app.use('/', proxyResources);

app.listen(PORT, HOST, () => {
    console.log(`Proxy Started at ${HOST}:${PORT}`)
});