'use strict';

const path = require('path');
const express = require('express');
const app = express();

app.disable('x-powered-by');
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.listen(8080);