var inquirer = require('inquirer');
var getHomepage = require('./reddit.js').getHomepage;
var getSortedHomepage = require('./reddit.js').getSortedHomepage;
var getSubreddit = require('./reddit.js').getSubreddit;
var getSortedSubreddit = require('./reddit.js').getSortedSubreddit;
var getSubreddits = require('./reddit.js').getSubreddits;
var prompt = require('prompt');

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
          var subs = getSubreddits(function(res) {
            var subChoices = res.map(function(subName) {
              return {
                name: subName,
                value: subName,
              };
            });

            console.log(subChoices);

          });
        }
      });
}

      //console.log("menu selection works!!");


      // if (answers.menu === "SUBREDDITS") {
      //   console.log("menu selection works!!");
      //   getSubreddits(menuError);
      //}




      /*

      function ask() {
        inquirer.prompt(questions).then(function (answers) {
          output.push(answers.tvShow);
          if (answers.askAgain) {
            ask();
          } else {
            console.log('Your favorite TV Shows:', output.join(', '));
          }
        });
      }
      */
menu();