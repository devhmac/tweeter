/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//moment for unix to time since conversion
const timeSinceTweet = (unix) => {
  return moment(unix).fromNow();
};

//escape function for safe user input
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//turns tweet objects into HTML formatted tweet articles
const createTweetElement = function(data) {
  let $tweet = $(`
  <article class="tweet">
  <header>
    <div class="user">
      <img
        src="${escape(data.user.avatars)}"
        alt="">
      <p>${escape(data.user.name)}</p>
    </div>
    <h4>${escape(data.user.handle)}</h4>
  </header>

  <p>${escape(data.content.text)}</p>

  <footer>
    <span>${escape(timeSinceTweet(data.created_at))}</span>
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

    //form verification
    if (!$(this).children().find('textarea').val()) {
      return $('.errors').text('Please enter a valid tweet').show();
    }
    if ($(this).children().find('textarea').val().length > 140) {
      return $('.errors').text('Your Tweet exceeds the maximum characters').show();

    }

    //tweet submission to database
    console.log('tweet submitted, sending to database');
    $.ajax('/tweets', {
      method: 'POST',
      data: $(this).serialize()
    })
      .then(function(tweet) {

        //dynamically render new tweets after post, instead of refreshing
        loadTweets();
      })
      .catch((err) => {
        console.log('There was an error', err)
      })

    //clear text area
    $(this).children().find('textarea').val('');
  });

});