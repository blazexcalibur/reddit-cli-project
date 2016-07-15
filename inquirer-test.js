var inquirer = require('inquirer');
var getHomepage = require('./reddit.js').getHomepage;
var getSortedHomepage = require('./reddit.js').getSortedHomepage;
var getSubreddit = require('./reddit.js').getSubreddit;
var getSortedSubreddit = require('./reddit.js').getSortedSubreddit;
var getSubreddits = require('./reddit.js').getSubreddits;
var prompt = require('prompt');
var clear = require('clear');
var requestAsJson = require('request');
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

      // if (answers.menu === "SUBREDDITS") {
      //   console.log("menu selection works!!");
      //   getSubreddits(menuError);
      // }

      if (answers.menu === "SUBREDDITS") {
        getSubreddits(function(err, subreddits) {
          menuSubreddits(subreddits, function(sub) {
           // console.log(sub, 'SECOND CALLBACK')
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

function getSubredditposts(subreddit, callback) {
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
            username: posts.data.author,
            value: posts.data.url,
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
        callback(answer.subpostsmenu);
      });

    }
  })
}

// This function doesn't seem to work....
function getSubredditpostsImage(link) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  console.log(link)
  if (link.indexOf('.jpg') > -1 || link.indexOf('.gif') > -1 || link.indexOf('.png') > -1) {
     
     imageToAscii(link, (err, converted) => {
      console.log(err || converted);
      menu();
    });
    
  }
}