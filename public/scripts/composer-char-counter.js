
$(document).ready(function() {
  console.log('The document is ready!')

  $('#tweet-text').on('keypress', function(e) {
    let charCount = this.value.length;
    console.log(140 - charCount)
  })
})