
$(document).ready(function() {
  console.log('The document is ready!')

  $('#tweet-text').on('input', function(e) {
    let charCount = $(this).val().length;
    let remainingChars = 140 - charCount;

    //dom traversal targeting of .counter value
    let counter = $(this).parent().next('div').children('.counter')

    counter.text(remainingChars)

    //selector method of targerting .counter value
    //$('.counter').val(remainingChars);
    if (remainingChars < 0) {
      counter.addClass('redText')
    } else {
      counter.removeClass('redText')
    }
  });
});