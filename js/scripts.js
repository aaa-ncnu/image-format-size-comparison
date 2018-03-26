document.addEventListener("DOMContentLoaded", function() {
  // add event listeners for each image on top
  var navButtons = document.querySelectorAll(".nav-button");
  [].forEach.call(navButtons, function(button) {



    // add an event listener on click
    button.addEventListener("click", function(event){
      console.log(event.srcElement.dataset.imgUrl);
    });
    // load an image into the main area



  });

  // add event listeners for each option on the left

});