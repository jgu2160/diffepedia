$(document).ready(function() {
  console.log("hi");
  $('.masonry-container').masonry({
    itemSelector: '.item',
    isFitWidth: true,
  }).imagesLoaded(function() {
    $(this).masonry('reload');
  });
});
