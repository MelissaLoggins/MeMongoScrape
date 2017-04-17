// get an instance of router
var express = require("express");
var router = express.Router();
var Article = require("../models/Article.js");
var Note = require("../models/Note.js")



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
	var results = {}
  Article.find({}, function(error, data) {
    var error=error;
    var data=data;
		if(error) {
			console.log(error);

		} else {
      console.log("Grabbed articles");
      console.log(data)
      // {
// "_id": "58efb537b13ed2093712e7a8",
// "title": "OK Google, Burger King Hijacked Your Speakers ... And Failed Pretty Quickly",
// "link": "http://www.npr.org/sections/thetwo-way/2017/04/13/523740193/ok-google-burger-king-hijacked-your-speakers-and-failed-pretty-quickly",
// "__v": 0
// },

      results={
        articles: data
      }

      // res.json(results);
      res.render("index", results)
    }
	});
});

// Grab article by ObjectId
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

// Create a new note or replace an existing note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      })
    }
  });
});


module.exports = router;