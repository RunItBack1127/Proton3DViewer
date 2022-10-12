const express = require('express');
const path = require('path');

const PROTON_APP = express();
const APP_PORT = 8080 || process.env.PORT;

PROTON_APP.use(express.static(path.join(__dirname, "dist")));

PROTON_APP.get("/", (req, res) => {
    res.sendFile("index.html");
});

PROTON_APP.listen(APP_PORT);