document.addEventListener("DOMContentLoaded", function() {
  const imgContainer = document.querySelector('.image-viewer__viewer');

  const navButtons = Array.from(document.querySelectorAll('.nav-button'));

  const filterState = {
    density: 'standard',
    currentImage: 0,
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

  const availableQualities = [90, 80, 70, 60, 50, 40];

  function getImageDensityFilterElements() {
    return Array.from(document.querySelectorAll(`input[name="density"]`));
  }

  function redrawImageDensityFilters() {
    const els = getImageDensityFilterElements();
    els.forEach(el => {
      if (el.value === filterState.density) {
        el.checked = true;
      }
    });
  }

  function getImageQualityFilterElements() {
    return availableQualities.map(availableQuality => {
      return document.querySelector(`input[name="quality-${availableQuality}"]`);
    });
  }

  function redrawImageQualityFilters() {
    const els = getImageQualityFilterElements();
    availableQualities.forEach((availableQuality, index) => {
      if (filterState.quality.indexOf(availableQuality) !== -1) {
        els[index].setAttribute('checked', '');
      }
      else {
        els[index].removeAttribute('checked');
      }
    });
  }

  function createImageSourceWithSize(imgSrc, width) {
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
    filterState.currentImage = selectedImage;
    clearElementChildren(imgContainer);

    availableQualities.forEach(quality => {
      if (filterState.quality.indexOf(quality) === -1) {
        return;
      }
      const description = document.createElement('div');
      description.className = 'image-viewer__description';
      // TODO: Perform Ajax request to get content-length header and display as KBs.
      description.textContent = `Quality: ${quality}%`;

      const img = document.createElement('img');
      let src = createImageSourceWithSize(
        navButtons[selectedImage].dataset.imgUrl,
        filterState.density === 'standard' ? filterState.imgSize : 2 * filterState.imgSize
      );
      img.style.maxWidth = `${filterState.imgSize}px`;
      img.src = createImageSourceWithQuality(
        src,
        quality
      );

      imgContainer.appendChild(img);
      imgContainer.appendChild(description);
    });
  }

  navButtons.forEach((el, index) => {
    el.addEventListener('click', () => {
      showImage(index)
    });
  });

  getImageQualityFilterElements().forEach((el, index) => {
    el.addEventListener('change', () => {
      const value = availableQualities[index];
      if (el.checked) {
        if (filterState.quality.indexOf(value) === -1) {
          filterState.quality.push(value);
        }
      }
      else {
        const position = filterState.quality.indexOf(value);
        if (position !== -1) {
          filterState.quality.splice(position, 1);
        }
      }
      showImage(filterState.currentImage);
    });
  });

  getImageDensityFilterElements().forEach(el => {
    el.addEventListener('change', () => {
      filterState.density = el.value;
      showImage(filterState.currentImage);
    });
  });

  // getImageDensityFilterElements().forEach((el, index) => {
  //   el.addEventListener('change', () => {
  //     const value = availableDensities[index];
  //     if (el.checked) {
  //       if (filterState.density.indexOf(value) === -1) {
  //         filterState.density.push(value);
  //       }
  //     }
  //     else {
  //       const position = filterState.density.indexOf(value);
  //       if (position !== -1) {
  //         filterState.density.splice(position, 1);
  //       }
  //     }
  //     showImage(filterState.currentImage);
  //   });
  // });

  redrawImageQualityFilters();
  redrawImageDensityFilters();
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
