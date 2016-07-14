var requestAsJson = require('request');

/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage(callback) {
  // Load reddit.com/.json and call back with the array of posts
  // TODO: REPLACE request with requestAsJson!
  requestAsJson('https://reddit.com/.json', function(err, res) {
    if (err) {
      callback(err);
    }
    else {
      try {
        var response = JSON.parse(res.body);
        var arrrayToPrint;

        // var homeTitles = response.data.children.map(function(posts) {

        //   return posts.data.title;
        // });
        arrrayToPrint = response.data.children.map(function(posts) {
          return {
            title: posts.data.title,
            ups: posts.data.ups,
            username: posts.data.author,
            url: posts.data.url,
          };
          
        });
        console.log(arrrayToPrint);
        // var homePageUPS = response.data.children.map(function(posts) {
        //   return posts.data.ups;
        // });
        // var homePageUsername = response.data.children.map(function(posts) {
        //   return posts.data.author;
        // });
        //console.log(arrrayToPrint);
        callback(null, arrrayToPrint); // look at the result and explain why we're returning .data.children

      }
      catch (e) {
        console.log("a big problem here?");
        callback(e);
      }
    }
  });
}

/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod, callback) {
  // Load reddit.com/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  requestAsJson('https://reddit.com/' + sortingMethod + '.json', function(err, res) {
    if (err) {
      console.log("error here getSortedHomepage" + err);
    }
    else {
      try {
        var parsedSortedHomepage = JSON.parse(res.body);
        console.log(parsedSortedHomepage.data.children);
        callback(null, parsedSortedHomepage.data.children);
      }
      catch (err) {
        console.log("huge error here");
      }
    }
  });
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  requestAsJson('https://reddit.com/r/' + subreddit + '.json', function(err, res) {
    if (err) {
      console.log("error here getSubreddit" + err);
    }
    else {
      try {
        var subreddit = JSON.parse(res.body);
        //console.log(subreddit.data.children);
        var arrrayToPrint = subreddit.data.children.map(function(posts) {
          return {
            title: posts.data.title,
            ups: posts.data.ups,
            username: posts.data.author,
            url: posts.data.url,
          };
          
        });
        console.log(arrrayToPrint);
        callback(null, arrrayToPrint)
      }
      catch (err) {
        console.log("huge error here")
      }
      
    }
  })
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  requestAsJson('https://reddit.com/r/' + subreddit + "/" + sortingMethod + '/.json', function(err, res) {
    if (err) {
      console.log("error here getSortedSubreddit");
    }
    else {
      try {
        var parsedSortedSubreddit = JSON.parse(res.body);
        console.log(parsedSortedSubreddit);
        callback(null, parsedSortedSubreddit.data.children);
      }
      catch (err) {
        console.log("huge error hereherere");
      }
    }
  });
}

/*
This function should "return" all the popular subreddits
*/
function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
  requestAsJson('http://www.reddit.com/subreddits.json', function(err, res) {
    if (err) {
      //console.log("error here getSubreddit" + err);
    }
    else {
      try {
        var subreddit = JSON.parse(res.body);
        //console.log(subreddit);

        var subredditArry = subreddit.data.children.map(function(subreddit) {
          //console.log(subreddit.data.subreddit);
          return subreddit.data.display_name;
        });

        //console.log(subredditArry)

        callback(subredditArry);
      }
      catch (err) {
        console.log("huge error here");
      }
    }
  })
}



// Export the API
module.exports = {
  getHomepage: getHomepage,
  getSortedHomepage: getSortedHomepage,
  getSubreddit: getSubreddit,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddits: getSubreddits,

};


//testing area below!

// getSubreddit("awww", function(){
//   console.log("it works");
// })

