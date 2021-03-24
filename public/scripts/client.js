/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//moment for unix to time since conversion
const timeSinceTweet = (unix) => {
  return moment(unix).fromNow();
};

//turns tweet objects into HTML formatted tweet articles
const createTweetElement = function(data) {
  let $tweet = $(`
  <article class="tweet">
  <header>
    <div class="user">
      <img
        src="${data.user.avatars}"
        alt="">
      <p>${data.user.name}</p>
    </div>
    <h4>${data.user.handle}</h4>
  </header>

  <p>${data.content.text}</p>

  <footer>
    <span>${timeSinceTweet(data.created_at)}</span>
    <div>
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
    </div>
  </footer>
</article>
  `);
  return $tweet;
};



//appends array of tweets to the tweets-container section
const renderTweet = function(data) {
  for (let tweet of data) {
    $('#tweets-container').prepend(createTweetElement(tweet));
  }
};

const loadTweets = function() {
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      console.log("your page is grabbing the tweets from database")

      //when we have the data from GET request, pass it through renderTweet
      renderTweet(tweets)
    })
    .catch((err) => {
      console.log("There was an ERROR ", err)
    })
};

//loads all tweets on page load
loadTweets()


$(document).ready(function() {
  console.log('doc is ready')

  $('form.tweetSubmit').on('submit', function(event) {
    event.preventDefault();

    //should load any new tweets on press
    if (!$('.tweet-text').val()) {
      return alert('You cannot post an empty tweet')
    }
    if ($('.tweet-text').val().length > 140) {
      return alert("Your tweet exceeds the maximum characters")
    }

    console.log('tweet submitted, sending to database');
    $.ajax('/tweets', {
      method: 'POST',
      data: $(this).serialize()
    })
      .then(function(tweet) {
        $('.tweet-text').val('');
      })
      .then(() => {
        loadTweets();
      })
      .catch((err) => {
        console.log('There was an error', err)
      })

  });

});