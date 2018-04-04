document.addEventListener("DOMContentLoaded", function() {
  const imgContainer = document.querySelector('.image-viewer__viewer');

  const imgSamples = Array.from(document.querySelectorAll('.img-sample'));

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

  function getImageSizeFilterElements() {
    return Array.from(document.querySelectorAll(`input[name="size"]`));
  }

  function redrawImageQualityFilters() {
    const els = getImageQualityFilterElements();
    availableQualities.forEach((availableQuality, index) => {
      if (filterState.quality.indexOf(availableQuality) !== -1) {
        els[index].checked = true;
      }
      else {
        els[index].checked = false;
      }
    });
  }

  function redrawImageSizeFilter() {
    getImageSizeFilterElements().forEach(el => {
      if (Number(el.value) === filterState.imgSize) {
        el.checked = true;
      }
    });
  }

  function redrawAllFilters () {
    redrawImageQualityFilters();
    redrawImageSizeFilter();
    redrawImageDensityFilters();
    redrawImageWebPFilter();
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

  function redrawCurrentImage() {
    showImage(filterState.currentImage);
  }

  function getImageFileSize(imgSrc, cb) {
    function getHeaderTime () {
      cb(this.getResponseHeader("Content-Length"));
    }

    const oReq = new XMLHttpRequest();
    oReq.open("HEAD", imgSrc);
    oReq.onload = getHeaderTime;
    oReq.send();
  }

  function showImageJpeg(selectedImage) {
    availableQualities.forEach(quality => {
      if (filterState.quality.indexOf(quality) === -1) {
        return;
      }
      const img = document.createElement('img');
      img.className = `image-viewer__${filterState.imgSize}`;
      let src = createImageSourceWithSize(
        imgSamples[selectedImage].dataset.imgUrl,
        filterState.density === 'standard' ? filterState.imgSize : 2 * filterState.imgSize
      );
      src = createImageSourceWithQuality(
        src,
        quality
      );
      img.src = createImageSourceWithCorrectExtentsion(src);

      const description = document.createElement('div');
      description.className = 'image-viewer__description';
      getImageFileSize(img.src, contentLength => {
        const lengthInKb = (contentLength/1024).toFixed(1);
        description.textContent = `Quality: ${quality}% Size: ${lengthInKb} KB`;
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(description);
    });
  }

  function showImagePng(selectedImage) {

    const img = document.createElement('img');
    img.className = `image-viewer__${filterState.imgSize}`;
    let src = createImageSourceWithSize(
      imgSamples[selectedImage].dataset.imgUrl,
      filterState.density === 'standard' ? filterState.imgSize : 2 * filterState.imgSize
    );
    img.src = createImageSourceWithCorrectExtentsion(src);

    const description = document.createElement('div');
    description.className = 'image-viewer__description';
    getImageFileSize(img.src, contentLength => {
      const lengthInKb = (contentLength/1024).toFixed(1);
      description.textContent = `Size: ${lengthInKb} KB`;
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(description);
  }

  function showImage(selectedImage) {
    filterState.currentImage = selectedImage;
    clearElementChildren(imgContainer);

    if (/\.jpe?g$/.test(imgSamples[selectedImage].dataset.imgUrl)) {
      showImageJpeg(selectedImage);
    } else {
      showImagePng(selectedImage);
    }
  }

  imgSamples.forEach((el, index) => {
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
      redrawCurrentImage();
    });
  });

  getImageDensityFilterElements().forEach(el => {
    el.addEventListener('change', () => {
      filterState.density = el.value;
      redrawCurrentImage();
    });
  });

  getImageWebPFilterElement().addEventListener('change', () => {
    const el = getImageWebPFilterElement();
    filterState.showWebP = el.checked;
    redrawCurrentImage();
  });

  getImageSizeFilterElements().forEach((el) => {
    el.addEventListener('change', () => {
      filterState.imgSize = Number(el.value);
      redrawCurrentImage();
    });
  });

  redrawAllFilters();
  redrawCurrentImage();
});
