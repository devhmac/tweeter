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



//prepends array of tweets to the tweets-container section
const renderTweet = function(data) {

  //empties container as to not duplicate tweets
  $('#tweets-container').empty();
  for (let tweet of data) {
    $('#tweets-container').prepend(createTweetElement(tweet));
  }
};

//Ajax get request to get data json, then async pass it though renderTweet
const loadTweets = function() {
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      console.log("your page is grabbing the tweets from database")
      renderTweet(tweets)
    })
    .catch((err) => {
      console.log("There was an ERROR ", err)
    })
};

//on submit callback function - handles ajax post requests on submit and form validation
const submitTweetPost = function(event) {
  event.preventDefault();

  //form validation
  $('.errorText').slideUp(400).text('');


  if (!$(this).children().find('textarea').val()) {
    return $('.errorText').text('Please enter a valid tweet').slideDown();

  }
  if ($(this).children().find('textarea').val().length > 140) {
    return $('.errorText').text('Your Tweet exceeds the maximum characters').slideDown();
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
      // could also use location.reload() apparently
    })
    .catch((err) => {
      console.log('There was an error', err)
    })

  //clear text area
  $(this).children().find('textarea').val('');
  //reset counter
  $('.counter').text(140)
};






//loads initial tweets on page load
loadTweets()


$(document).ready(function() {
  console.log('doc is ready')

  $('form.tweetSubmit').on('submit', submitTweetPost);

});
