var inquirer = require('inquirer');
var getHomepage = require('./reddit.js').getHomepage;
var getSortedHomepage = require('./reddit.js').getSortedHomepage;
var getSubreddit = require('./reddit.js').getSubreddit;
var getSortedSubreddit = require('./reddit.js').getSortedSubreddit;
var getSubreddits = require('./reddit.js').getSubreddits;
var prompt = require('prompt');
var clear = require('clear');
var requestAsJson = require('request');
var wrap = require('word-wrap');
const imageToAscii = require("image-to-ascii");

var menuChoices = [{
  name: 'Show homepage',
  value: 'HOMEPAGE'
}, {
  name: 'Show subreddit',
  value: 'SUBREDDIT'
}, {
  name: 'List subreddits',
  value: 'SUBREDDITS'
}];

function menu() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: menuChoices
  }).then(
    function(answers) {
      function menuError(err, res) {
        if (err) {
          console.log("You've broke the internet!");
          menu();
        }
        else {
          console.log("this feels right for a callback funct");
          return res;
        }
        console.log("hahahahahha");
      }

      //console.log(answers);
      if (answers.menu === "HOMEPAGE") {
        console.log("menu selection works!!");
        getHomepage(menu);
      }

      if (answers.menu === "SUBREDDIT") {
        console.log("Pick the subreddit!");

        prompt.get('subreddit', function(err, answers) {
          if (err) {
            console.log('there was an error getting your subreddit');
          }
          else {
            getSubreddit(answers.subreddit, menu);
          }
        });
      }

      if (answers.menu === "SUBREDDITS") {
        getSubreddits(function(err, subreddits) {
          menuSubreddits(subreddits, function(sub) {
            //console.log(sub, 'SECOND CALLBACK');
            getSubredditposts(sub, function(link) {
              //console.log(link, "THIS SHOULD BE THE MOFO LNK")
              getSubredditpostsImage(link);
            });
          });
        });
      }
    });
}

menu();








function menuSubreddits(subreddit, callback) {
  var subChoices = subreddit.map(function(subName) {
    return {
      value: subName.value,
      name: subName.name,
    };
  });

  inquirer.prompt({
    type: 'list',
    name: 'submenu',
    message: 'Which sub?',
    choices: subChoices
  }).then(function(answers) {
    callback(answers.submenu)
  });
}




function getSubredditposts(subreddit, callback, callback2) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  requestAsJson('https://reddit.com/r/' + subreddit + '.json', function(err, res) {
    if (err) {
      console.log("error here getSubreddit" + err);
    }
    else {
      try {
        var subredditPosts = JSON.parse(res.body);
        //console.log(subredditPosts);
        var arrrayToPrint = subredditPosts.data.children.map(function(posts) {
          return {
            name: posts.data.title,
            //username: posts.data.author,
            value: { url:posts.data.url, permalink : posts.data.permalink},
            //comments: posts.data.permalink,
          };
        });
      }
      catch (err) {
        console.log("huge error here in getsubredditposts")
      }
      inquirer.prompt({
        type: 'list',
        name: 'subpostsmenu',
        message: 'Which post?',
        choices: arrrayToPrint
      }).then(function(answer) {
        console.log(answer.subpostsmenu + "   this is my final answer")
        
        callback(answer.subpostsmenu);
        //callback2();
      });

    }
  })
}






function getSubredditpostsImage(link) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  displayComments(link.permalink);
  if (link.url.indexOf('.jpg') > -1 || link.url.indexOf('.gif') > -1 || link.url.indexOf('.png') > -1) {

    imageToAscii(link.url, (err, converted) => {
      console.log(err || converted);
      
    });
menu();
  }
}




function displayComments(testPermalink) {

  var arrayOfCommentObjs = requestAsJson('https://reddit.com' + testPermalink + ".json", function(err, res) {
    if (err) {
      console.log("something wrong with printing comments");
    }
    else {
      try {
        var parsedComments = JSON.parse(res.body);
        //console.log(parsedComments[1].data.children)
        // parsedComments[1].data.children.map(function(comment){
        //     console.log(comment.data.body);
        // })
        function printComments(comments, level) {
          comments.forEach(function(comment) {
            if (comment.data.body) {
              console.log(wrap(comment.data.body, {
                indent: level,
              }, {
                width: 100
              }));
              if (comment.data.replies && comment.data.replies.data) {
                printComments(comment.data.replies.data.children, level + "   ");
              }
            }

          });
        }
        printComments(parsedComments[1].data.children, "");
        
      }
      catch (e) {
        console.log("errors abundant");
      }
    }

  });
}
