const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('build'));

app.get('/tables*', (req, res, next) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../build') });
});

app.get('/thankyou', (req, res, next) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../build') });
});

app.listen(3000, () => console.log('Frontend app is listening on port 3000!'));
