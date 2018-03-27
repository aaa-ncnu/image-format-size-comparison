document.addEventListener("DOMContentLoaded", function() {
  var imgContainer = document.getElementById('image');
  // add event listeners for each image on top
  var navButtons = document.querySelectorAll(".nav-button");
  [].forEach.call(navButtons, function(button) {

    
    // add an event listener on click
    button.addEventListener("click", function(event){
      console.log(event.srcElement.dataset.imgUrl);
      imgContainer.innerHTML = '';
      img = document.createElement('img');
      img.src = event.srcElement.dataset.imgUrl;
      imgContainer.appendChild(img);

    });



  });

  // add event listeners for each option on the left

});