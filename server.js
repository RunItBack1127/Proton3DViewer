const express = require('express');
const path = require('path');

const PROTON_APP = express();
const SERVER_PORT = 8080;

// Middleware for serving Vite static
// build files
PROTON_APP.use(express.static(path.join(__dirname, 'dist')));

PROTON_APP.get('/', (req, res) => {
    res.sendFile("index.html");
});

PROTON_APP.listen( SERVER_PORT || process.env.PORT );
