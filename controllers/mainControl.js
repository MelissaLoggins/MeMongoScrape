// get an instance of router
var express = require("express");
var router = express.Router();
var Article = require("../models/Article.js");


// Scraping tools
var request = require("request");
var cheerio = require("cheerio");


// home page route (http://localhost:3000)
// router.get('/', function(req, res) {
//   console.log("hitting home route or something");
//     res.send('im the home page!');  
// });

// Routes
// router.get('/', function(err, req, res) {
router.get('/', function(req, res) {
	var query = Article.find({});
	// if(err){
	// 	throw err;
	// }

	// res.render('index', {article: docs});
	res.render('index');
});

// A GET request to scrape the npr website
router.get("/scrape", function(req, res) {
  console.log("Scrapping");

  request("http://www.npr.org/sections/technology", function(error, response, html) {
    
    var $ = cheerio.load(html);
   
    $("article h2").each(function(i, element) {

      
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      console.log(result);
      var entry = new Article(result);

      entry.save(function(err, doc) {
        
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      }); 
      // closes entry

    });
    // closes article h2
  });
  	// closes request

  res.send("Scrape Complete");
});
// closes router.get

// Get articles from the database
router.get("/articles", function(req, res) {
	Article.find({}, function(error, data) {
		if(error) {
			console.log(error);

		}
    else{res.json(data)}
	});
});

// Grab article bu ObjectId
router.get("/articles/:id", function(req, res) {
  //Using the id passed in the id param, prepare a query that finds the matching one in the database
  Article.findOne({ "_id": req.params.id })
 // populate the notes associated with it
 .populate("note")
 //execute the query
 .exec(function(error, doc) {
 	if(error) {
 		console.log(error);
 	}
 	else {
 		res.json(doc);
 	}
 }); 
});

router.get("/saved", function(req,res){
  Article.where({ _id: req.body.id }).update({ saved: true })
      .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.render("saved",{article: doc});
    }
  });
});

module.exports = router;