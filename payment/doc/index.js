const express = require('express');
const app = express();
var path    = require("path");

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment', 'v1', 'api.html'));
});

app.get('/store', (req, res) => {
    res.sendFile(path.join(__dirname, 'store', 'v1', 'api.html'));
});

app.get('/frontend', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'api.html'));
});

app.listen(3000, () => console.log('Example express app listening on port 3000!'));
