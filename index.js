'use strict'

const express = require('express');
const Twitter = require('twitter');
const port = process.env.PORT || 3000;
const app = express();

// Configure environment
const dotenv = require('dotenv');
dotenv.config();

// Twitter API initialization
const auth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};
const client = new Twitter(auth);

// get friends using Twitter API
const getFriends = async (user) => {
  // declare friends list as an object with username as key
  const friends = {};
  // Twitter API params
  let params = { count: 200, cursor: -1, screen_name: user, kip_status: true, include_user_entities: false};
  do {
    let response = await client.get('friends/list', params);
    // store required data in friends object
    response.users.forEach(u => friends[u.screen_name] = {name: u.name, image: u.profile_image_url_https});
    // cursoring
    params.cursor = response.next_cursor;
  } 
  while (params.cursor != 0);
  return friends;
};

// find mutual friends
const getMutual = (friends1, friends2) => {
  let small, large;
  const len1 = Object.keys(friends1).length;
  const len2 = Object.keys(friends2).length;
  // identify small and large lists
  if (len1 < len2) {
    small = friends1, large = friends2;
  }
  else {
    small = friends2, large = friends1;
  }
  // delete friends from small list which are not in large list
  for(const user in small) {
    if (!large.hasOwnProperty(user)) {
      delete small[user];
    }
  }
  // log all counts to console
  const len3 = Object.keys(small).length;
  console.log({len1, len2, len3});
  return small;
};

// serve static content from public directory
app.use(express.static('public'));

// api endpoint
app.get('/api', async function (req, res) {
  // extract query parameters
  const {user1, user2} = req.query;
  // log usernames to console
  console.log({user1, user2});
  // server side validation
  if (!user1 || !user2) {
    res.send({result: false, error: "Please enter both usernames!"});
  } 
  else if (user1 == user2) {
    res.send({result: false, error: "Both usernames can't be the same!"});
  }
  else {
    try {
      // get friends list of both users concurrently
      const promises = [getFriends(user1), getFriends(user2)];
      // wait till both promises are resolved
      const [friends1, friends2] = await Promise.all(promises);
      // find mutual friends
      const users = getMutual(friends1, friends2);
      if (Object.keys(users).length == 0) {
        res.send({result: false, error: 'No mutual friends!'});
      }
      else {
        res.send({result: true, users});
      }
    }
    catch (error) {
      console.log({error});
      let errorText = 'Something went wrong!';
      // codes from Twitter API documentation
      if (error.length == 1 && error[0].code == 88) {
        errorText = 'Twitter API rate limit exceeded!\nTry again after 15 minutes.';
      }
      else if (error.length == 1 && (error[0].code == 34 || error[0].code == 50)) {
        errorText = 'User not found!';
      }
      res.send({result: false, error: errorText});
    }
  }
});

// redirect non existing URL to home
app.get('*', function (req, res) {
  res.redirect(301, '/');
});

// start the sever
app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});