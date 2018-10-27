const express = require('express');
const app = express();

app.use(express.static('build'));

app.listen(3300, () => console.log('Frontend app is listening on port 3300!'));
