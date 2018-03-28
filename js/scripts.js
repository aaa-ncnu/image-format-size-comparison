document.addEventListener("DOMContentLoaded", function() {
  const imgContainer = document.querySelector('.image-viewer__viewer');

  const navButtons = Array.from(document.querySelectorAll('.nav-button'));

  let currentImage = 0;

  const filterState = {
    density: 'standard',
    showWebP: false,
    imgSize: 768,
    quality: [
      40,
      50,
      60,
      70,
      80,
      90
    ]
  };

  function redrawImageQualityFilters() {
    [40, 50, 60, 70, 80, 90].forEach(availableQuality => {
      const el = document.querySelector(`input[name="quality-${availableQuality}"]`);
      
    });
  }

  function createImageSourceWithSize(imgSrc, width) {
    // TODO: Remove `return imgSrc;` line when we have images.
    return imgSrc;
    const re = /(.*)\.([^.]+)$/;
    const [, path, extension] = re.exec(imgSrc);
    return `${path}-${width}w.${extension}`;
  }

  function createImageSourceWithQuality(imgSrc, quality) {
    const re = /(.*)\.([^.]+)$/;
    const [, path, extension] = re.exec(imgSrc);
    return `${path}-${quality}q.${extension}`;
  }

  function clearElementChildren(element) {
    Array.from(element.children).forEach(child => {
      element.removeChild(child);
    });
  }

  function showImage(selectedImage) {
    currentImage = selectedImage;
    clearElementChildren(imgContainer);

    filterState.quality.forEach(quality => {
      const img = document.createElement('img');
      let src = createImageSourceWithSize(
        navButtons[selectedImage].dataset.imgUrl,
        filterState.imgSize
      );
      img.src = createImageSourceWithQuality(
        src,
        quality
      );
      imgContainer.appendChild(img);
    });
  }

  navButtons.forEach((el, index) => {
    el.addEventListener('click', () => {
      showImage(index)
    });
  });

  showImage(0);


  // // add event listeners for each image on top


  //   // add an event listener on click
  //   button.addEventListener("click", function(event){
  //     // console.log(event.srcElement.dataset.imgUrl);
  //     imgContainer.innerHTML = '';
  //     img = document.createElement('img');
  //     img.src = event.srcElement.dataset.imgUrl;
  //     forWebPImage = event.srcElement.dataset.webpUrl;
  //     imgContainer.appendChild(img);
  //     appState.imgSource = forWebPImage;
  //   });
  // });

  // // add event listeners for each option on the left
  // var webPcheckbox = document.getElementById('webP');
  // var webPimageContainer = document.getElementById('webPimage');
  // webPcheckbox.onchange = function(){
  //   if (webPcheckbox.checked) {
  //     webPimageContainer.innerHTML = '';
  //     img = document.createElement('img');
  //     img.src = appState.imgSource;
  //     webPimageContainer.appendChild(img);

  //   } else {
  //     webPimageContainer.innerHTML = '';
  //   }
  // };
});
