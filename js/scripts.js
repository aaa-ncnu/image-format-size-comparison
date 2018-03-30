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
      90,
      100
    ]
  };

  const availableQualities = [100, 90, 80, 70, 60, 50, 40];

  function getImageWebPFilterElement() {
    return document.getElementById('webP');
  }

  function redrawImageWebPFilter() {
    const el = getImageWebPFilterElement();
    if (el.checked === true) {
      filterState.showWebP = true;
    }
  };

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

  function createImageSourceWithCorrectExtentsion(imgSrc) {
    if (!filterState.showWebP) {
      return imgSrc;
    }
    const re = /(.*)\.[^.]+$/;
    const [, path] = re.exec(imgSrc);
    return `${path}.webp`;
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

  function showImageJpeg(selectedImage) {
    availableQualities.forEach(quality => {
      if (filterState.quality.indexOf(quality) === -1) {
        return;
      }
      const description = document.createElement('div');
      description.className = 'image-viewer__description';
      // TODO: Perform Ajax request to get content-length header and display as KBs.
      description.textContent = `Quality: ${quality}%`;

      const img = document.createElement('img');
      img.style.maxWidth = `${filterState.imgSize}px`;
      let src = createImageSourceWithSize(
        navButtons[selectedImage].dataset.imgUrl,
        filterState.density === 'standard' ? filterState.imgSize : 2 * filterState.imgSize
      );
      src = createImageSourceWithQuality(
        src,
        quality
      );

      img.src = createImageSourceWithCorrectExtentsion(src);
      imgContainer.appendChild(img);
      imgContainer.appendChild(description);
    });
  }

  function showImagePng(selectedImage) {
    const description = document.createElement('div');
    description.className = 'image-viewer__description';
    // TODO: Perform Ajax request to get content-length header and display as KBs.
    description.textContent = `To Do: Add size`;

    const img = document.createElement('img');
    img.style.maxWidth = `${filterState.imgSize}px`;
    let src = createImageSourceWithSize(
      navButtons[selectedImage].dataset.imgUrl,
      filterState.density === 'standard' ? filterState.imgSize : 2 * filterState.imgSize
    );

    img.src = createImageSourceWithCorrectExtentsion(src);
    imgContainer.appendChild(img);
    imgContainer.appendChild(description);
  }


  function showImage(selectedImage) {
    filterState.currentImage = selectedImage;
    clearElementChildren(imgContainer);

    if (/\.jpe?g$/.test(navButtons[selectedImage].dataset.imgUrl)) {
      showImageJpeg(selectedImage);
    } else {
      showImagePng(selectedImage);
    }

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

  getImageWebPFilterElement().addEventListener('change', () => {
    const el = getImageWebPFilterElement();
    filterState.showWebP = el.checked;
    showImage(filterState.currentImage);
  });

  redrawImageQualityFilters();
  redrawImageDensityFilters();
  redrawImageWebPFilter();
  showImage(0);
});
