'use strict';

const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const routes = require('./routes');

app.set('view engine', 'ejs');

app.disable('x-powered-by');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'checkout-E)2Paf!FllQ[B3c',
  keys: ['4_gM58P2:p(0gB=i', '9Ql(Z[Bfh?VY*7B:']
}));
app.use('/', routes);


app.listen(port);
