//----------------- Node Include -----------------------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// ---------- FIREBASE setup  ---------
var FireBaseAdmin = require('firebase-admin');
/*
var serviceAccount = require('path/to/serviceAccountKey.json'); // make sure that the file exists and the account is activated.

FireBaseAdmin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com' // TODO: Chnage <<DATABASE_NAME>> to the real dataabse name.
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: '<PROJECT_ID>',
    clientEmail: 'foo@<PROJECT_ID>.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\n<KEY>\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
*/
// ----------------- Application ----------------------------
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
