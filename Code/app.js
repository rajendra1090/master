var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import * as bodyParser from 'body-parser';
import webSocket from 'ws';
const webSocketServer = webSocket.Server;
const wss = new webSocketServer({port: 40510})
var indexRouter = require('./routes/index');
import _ from 'lodash';
const connections = [];
var app = express();
// web socket to provide tracking
// works on server port: 40510
wss.on('connection', function (ws) {
  ws.on('message', function (data) {
    try {
    data = JSON.parse(data);
    } catch (err) {
      ws.send('Invalid JSON supplied');
    }
    let receiverObject;
    if (data && data.orderId && !data.location) {
      connections.push({
        orderId: data.orderId,
        connDetails: ws
      });
      ws.send('registered to track order');
    } else if (data && data.location && data.orderId) {
      receiverObject = _.find(connections, (connection) => {
        return connection.orderId === data.orderId
    });
    if (receiverObject) {
      receiverObject.connDetails.send(data.location);
    }
  }
  })
})

// var app1 = express();
// var server1 = require('http').Server(app);
// var io = require('socket.io')(server);

// server1.listen(80);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
