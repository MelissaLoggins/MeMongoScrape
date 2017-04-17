// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var router = require("./controllers/mainControl.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Require Models
var Note = require("./models/Note.js")
var Article = require("./models/Article.js")

// Initialize Express
var app = express();
var port = process.env.PORT || 3000;


// Set up a static folder (public) for our web app
app.use(express.static("public"));
// app.use(express.static(process.cwd() + "public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', router);



app.listen(port, function() {
	console.log("App running on port " + port);
});