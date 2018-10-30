const express = require('express');
const app = express();
var path    = require("path");
var auth = require("./helpers/basicAuth")

const port = process.env.PORT || 3000

app.get('/healthy', (req, res) => 
    res.send("I am healthy")
);

app.get('/', [auth, (req, res) => res.send(`
    <ul>
        <li><a href="/payment">Payment API</a></li>
        <li><a href="/store">Store API</a></li>
        <li><a href="/frontend">Frontend API</a></li>
    </ul>
`)]);

app.get('/payment', [auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'payment', 'v1', 'api.html'));
}]);

app.get('/store', [auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'store', 'v1', 'api.html'));
}]);

app.get('/frontend', [auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'v1', 'api.html'));
}]);


app.listen(port, () => console.log(`Express app listening on port ${port}!`));
