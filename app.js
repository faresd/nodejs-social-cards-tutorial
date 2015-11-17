
/**
 * Module dependencies.
 */
var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    prismic = require('express-prismic').Prismic,
    configuration = require('./prismic-configuration').Configuration,
    social = require('./social');


var app = express();

// Prismic.io configuration

prismic.init(configuration);


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon("public/images/punch.png"));
app.use(logger('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('1234'));
app.use(session({secret: '1234', saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler());

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

// Routes

function socialPluginEnabled(doc) {
  var socialEnabled = doc.getText(doc.type + '.social_cards_enabled');
  return (socialEnabled == 'Enabled');
}

app.route('/').get(function(req, res){
  var p = prismic.withContext(req, res);
  p.getByUID('social', 'social-cards-starter', function (err, doc) {
    if(err) return handleError(err, req, res)
    var pageUrl = social.pageUrlFromRequest(req)
    res.render('social', {
      doc: doc,
      pageUrl: pageUrl(doc),
      helpers: {
        socialPluginEnabled:socialPluginEnabled(doc),
        social: social
      }
    });
  });
});

app.route('/preview').get(prismic.preview);

var PORT = app.get('port');

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});
