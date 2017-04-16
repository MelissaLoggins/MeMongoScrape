// Scrape articles from DB
$("#scrapeArticles").on("click", function(){
$.get("/articles")
.then(function(data) {
      console.log(data)
    }
  )

});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


//Save article

//When article is saved, the article selected is updated in the DB from "saved: false" to "saved: true"
$(document).on("click", ".saveArticle", function() {

      var status = $(this).attr("data-status");

      $(this).attr("data-status", true);
        console.log(status);

      var thisId = $(this).attr("data-id");
        console.log(thisId);

// Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

// Run a POST request to change the note, using what's entered in the inputs
$.ajax({
   method: "POST",
   url: "/articles/" + thisId,
   data: {
    // Value taken from title input
    saved: true
   }
  })
// With that done
.done(function(data) {
  // Log the response
  console.log(data);
 // Empty the notes section
});


});