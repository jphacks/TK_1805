const express = require('express');
const app = express();
var path    = require("path");
var reload = require('reload')

const port = process.env.PORT || 4646;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/floormap', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

reload(app)

app.listen(port, () => console.log(`Example express app listening on port ${port}!`));
