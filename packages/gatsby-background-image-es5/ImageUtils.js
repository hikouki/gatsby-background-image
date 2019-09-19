"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.imageLoaded = exports.imageReferenceCompleted = exports.createDummyImageArray = exports.initialBgImage = exports.imageArrayPropsChanged = exports.imagePropsChanged = exports.getUrlString = exports.getCurrentFromData = exports.switchImageSettings = exports.activateMultiplePictureRefs = exports.activatePictureRef = exports.createMultiplePictureRefs = exports.createPictureRef = exports.hasPictureElement = exports.resetImageCache = exports.activateCacheForMultipleImages = exports.activateCacheForImage = exports.allInImageCache = exports.inImageCache = void 0;

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _HelperUtils = require("./HelperUtils");

var imageCache = (0, _create.default)({});
/**
 * Cache if we've seen an image before so we don't both with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @return {*|boolean}
 */

var inImageCache = function inImageCache(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.hasImageArray)(convertedProps)) {
    return allInImageCache(props);
  } else {
    // Find src
    var src = convertedProps.fluid ? convertedProps.fluid.src : convertedProps.fixed ? convertedProps.fixed.src : null;
    return imageCache[src] || false;
  }
};
/**
 * Processes an array of cached images for inImageCache.
 *
 * @param props  object    Component Props (with fluid or fixed as array).
 * @return {*|boolean}
 */


exports.inImageCache = inImageCache;

var allInImageCache = function allInImageCache(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed; // Only return true if every image is in cache.

  return (0, _every.default)(imageStack).call(imageStack, function (imageData) {
    if (convertedProps.fluid) {
      return inImageCache({
        fluid: imageData
      });
    } else {
      return inImageCache({
        fixed: imageData
      });
    }
  });
};
/**
 * Adds an Image to imageCache.
 *
 * @param props
 * @param selfRef
 */


exports.allInImageCache = allInImageCache;

var activateCacheForImage = function activateCacheForImage(props, selfRef) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.hasImageArray)(convertedProps)) {
    return activateCacheForMultipleImages(props);
  } else {
    // Find src
    var src = convertedProps.fluid ? convertedProps.fluid.src : convertedProps.fixed ? convertedProps.fixed.src : null;

    if (src) {
      imageCache[src] = true;
    }
  }
};
/**
 * Activates the Cache for multiple Images.
 *
 * @param props
 */


exports.activateCacheForImage = activateCacheForImage;

var activateCacheForMultipleImages = function activateCacheForMultipleImages(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed;
  (0, _forEach.default)(imageStack).call(imageStack, function (imageData) {
    if (convertedProps.fluid) {
      activateCacheForImage({
        fluid: imageData
      });
    } else {
      activateCacheForImage({
        fixed: imageData
      });
    }
  });
};
/**
 * Resets the image cache (especially important for reliable tests).
 */


exports.activateCacheForMultipleImages = activateCacheForMultipleImages;

var resetImageCache = function resetImageCache() {
  for (var prop in imageCache) {
    delete imageCache[prop];
  }
};
/**
 * Returns the availability of the HTMLPictureElement unless in SSR mode.
 *
 * @return {boolean}
 */


exports.resetImageCache = resetImageCache;

var hasPictureElement = function hasPictureElement() {
  return typeof HTMLPictureElement !== "undefined" || typeof window === "undefined";
};
/**
 * Creates an image reference to be activated on critical or visibility.
 * @param props
 * @param onLoad
 * @return {HTMLImageElement|null|Array}
 */


exports.hasPictureElement = hasPictureElement;

var createPictureRef = function createPictureRef(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if (typeof window !== "undefined" && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _HelperUtils.hasImageArray)(convertedProps)) {
      return createMultiplePictureRefs(props, onLoad);
    } else {
      var img = new Image();

      img.onload = function () {
        return onLoad();
      };

      if (!img.complete && typeof convertedProps.onLoad === "function") {
        img.addEventListener('load', convertedProps.onLoad);
      }

      if (typeof convertedProps.onError === "function") {
        img.addEventListener('error', convertedProps.onError);
      }

      if (convertedProps.crossOrigin) {
        img.crossOrigin = convertedProps.crossOrigin;
      } // Only directly activate the image if critical (preload).


      if (convertedProps.critical || convertedProps.isVisible) {
        return activatePictureRef(img, convertedProps);
      }

      return img;
    }
  }

  return null;
};
/**
 * Creates multiple image references. Internal function.
 *
 * @param props   object    Component Props (with fluid or fixed as array).
 * @param onLoad  function  Callback for load handling.
 */


exports.createPictureRef = createPictureRef;

var createMultiplePictureRefs = function createMultiplePictureRefs(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed;
  return (0, _map.default)(imageStack).call(imageStack, function (imageData) {
    if (convertedProps.fluid) {
      return createPictureRef((0, _assign.default)({}, convertedProps, {
        fluid: imageData
      }), onLoad);
    } else {
      return createPictureRef((0, _assign.default)({}, convertedProps, {
        fixed: imageData
      }), onLoad);
    }
  });
};
/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param imageRef
 * @param props
 * @param selfRef
 * @return {null|Array|*}
 */


exports.createMultiplePictureRefs = createMultiplePictureRefs;

var activatePictureRef = function activatePictureRef(imageRef, props, selfRef) {
  if (selfRef === void 0) {
    selfRef = null;
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if (typeof window !== "undefined" && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _HelperUtils.hasImageArray)(convertedProps)) {
      return activateMultiplePictureRefs(imageRef, props, selfRef);
    } else {
      var imageData = convertedProps.fluid ? convertedProps.fluid : convertedProps.fixed; // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
      // but don't prevent it during SSR.

      var removableElement = null;

      if (hasPictureElement()) {
        var pic = document.createElement('picture');

        if (selfRef) {
          pic.width = imageRef.width = selfRef.offsetWidth;
          pic.height = imageRef.height = selfRef.offsetHeight;
        }

        if (imageData.srcSetWebp) {
          var sourcesWebP = document.createElement('source'); // Set original component's style.

          sourcesWebP.type = "image/webp";
          sourcesWebP.srcset = imageData.srcSetWebp;
          sourcesWebP.sizes = imageData.sizes;
          pic.appendChild(sourcesWebP);
        }

        pic.appendChild(imageRef);
        removableElement = pic; // document.body.appendChild(removableElement)
      } else {
        if (selfRef) {
          imageRef.width = selfRef.offsetWidth;
          imageRef.height = selfRef.offsetHeight;
        }

        removableElement = imageRef; // document.body.appendChild(removableElement)
      }

      imageRef.srcset = imageData.srcSet ? imageData.srcSet : "";
      imageRef.src = imageData.src ? imageData.src : ""; // document.body.removeChild(removableElement)

      return imageRef;
    }
  }

  return null;
};
/**
 * Creates multiple picture elements.
 *
 * @param imageRefs
 * @param props
 * @param selfRef
 * @return {Array||null}
 */


exports.activatePictureRef = activatePictureRef;

var activateMultiplePictureRefs = function activateMultiplePictureRefs(imageRefs, props, selfRef) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  return (0, _map.default)(imageRefs).call(imageRefs, function (imageRef, index) {
    if (convertedProps.fluid) {
      return activatePictureRef(imageRef, (0, _assign.default)({}, convertedProps, {
        fluid: convertedProps.fluid[index]
      }), selfRef);
    } else {
      return activatePictureRef(imageRef, (0, _assign.default)({}, convertedProps, {
        fixed: convertedProps.fixed[index]
      }), selfRef);
    }
  });
};
/**
 * Compares the old states to the new and changes image settings accordingly.
 *
 * @param image     string||array   Base data for one or multiple Images.
 * @param bgImage   string||array   Last background image(s).
 * @param imageRef  string||array   References to one or multiple Images.
 * @param state     object          Component state.
 * @return {{afterOpacity: number, bgColor: *, bgImage: *, nextImage: string}}
 */


exports.activateMultiplePictureRefs = activateMultiplePictureRefs;

var switchImageSettings = function switchImageSettings(_ref) {
  var image = _ref.image,
      bgImage = _ref.bgImage,
      imageRef = _ref.imageRef,
      state = _ref.state;
  // Read currentSrc from imageRef (if exists).
  var currentSources = getCurrentFromData({
    data: imageRef,
    propName: "currentSrc"
  }); // Backup bgImage to lastImage.

  var returnArray = (0, _isArray.default)(image);
  var lastImage = (0, _isArray.default)(bgImage) ? (0, _HelperUtils.filteredJoin)(bgImage) : bgImage; // Set the backgroundImage according to images available.

  var nextImage;
  var nextImageArray; // Signal to `createPseudoStyles()` when we have reached the final image,
  // which is important for transparent background-image(s).

  var finalImage = false;

  if (returnArray) {
    // Check for tracedSVG first.
    nextImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG",
      returnArray: returnArray
    }); // Now combine with base64 images.

    nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "base64",
      returnArray: returnArray
    }), nextImage); // Now add possible `rgba()` or similar CSS string props.

    nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), nextImage); // Do we have at least one img loaded?

    if (state.imgLoaded && state.isVisible) {
      if (currentSources) {
        nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
          data: imageRef,
          propName: "currentSrc",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      } else {
        // No support for HTMLPictureElement or WebP present, get src.
        nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
          data: imageRef,
          propName: "src",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      }
    } // First fill last images from bgImage...


    nextImage = (0, _HelperUtils.combineArray)(nextImage, bgImage); // ... then fill the rest of the background-images with a transparent dummy
    // pixel, lest the background-* properties can't target the correct image.

    var dummyArray = createDummyImageArray(image.length); // Now combine the two arrays and join them.

    nextImage = (0, _HelperUtils.combineArray)(nextImage, dummyArray);
    nextImageArray = nextImage;
    nextImage = (0, _HelperUtils.filteredJoin)(nextImage);
  } else {
    nextImage = "";
    if (image.tracedSVG) nextImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG"
    });
    if (image.base64 && !image.tracedSVG) nextImage = getCurrentFromData({
      data: image,
      propName: "base64"
    });

    if (state.imgLoaded && state.isVisible) {
      nextImage = currentSources;
      finalImage = true;
    }
  } // Change opacity according to imageState.


  var afterOpacity = state.imageState % 2;

  if (!returnArray && nextImage === "" && state.imgLoaded && state.isVisible && imageRef && !imageRef.currentSrc) {
    // Should we still have no nextImage it might be because currentSrc is missing.
    nextImage = getCurrentFromData({
      data: imageRef,
      propName: "src",
      checkLoaded: false
    });
    finalImage = true;
  } // Fall back on lastImage (important for prop changes) if all else fails.


  if (!nextImage) nextImage = lastImage;
  var newImageSettings = {
    lastImage: lastImage,
    nextImage: nextImage,
    afterOpacity: afterOpacity,
    finalImage: finalImage
  }; // Add nextImageArray for bgImage to newImageSettings if exists.

  if (nextImageArray) newImageSettings.nextImageArray = nextImageArray;
  return newImageSettings;
};
/**
 * Extracts a value from an imageRef, image object or an array of them.
 *
 * @param data        HTMLImageElement||object||Array   Data to extract from.
 * @param propName    string    Property to extract.
 * @param addUrl      boolean   Should returned strings be encased in `url()`?
 * @param returnArray boolean   Switches between returning an array and a string.
 * @param checkLoaded boolean   Turns checking for imageLoaded() on and off.
 * @return {string||array}
 */


exports.switchImageSettings = switchImageSettings;

var getCurrentFromData = function getCurrentFromData(_ref2) {
  var data = _ref2.data,
      propName = _ref2.propName,
      _ref2$addUrl = _ref2.addUrl,
      addUrl = _ref2$addUrl === void 0 ? true : _ref2$addUrl,
      _ref2$returnArray = _ref2.returnArray,
      returnArray = _ref2$returnArray === void 0 ? false : _ref2$returnArray,
      _ref2$checkLoaded = _ref2.checkLoaded,
      checkLoaded = _ref2$checkLoaded === void 0 ? true : _ref2$checkLoaded;
  if (!data || !propName) return ""; // Handle tracedSVG with "special care".

  var tracedSVG = propName === "tracedSVG";

  if ((0, _isArray.default)(data)) {
    // Filter out all elements not having the propName and return remaining.
    var imageString = (0, _map.default)(data // .filter(dataElement => {
    //   return propName in dataElement && dataElement[propName]
    // })
    ).call(data, function (dataElement) {
      // If `currentSrc` or `src` is needed, check image load completion first.
      if (propName === "currentSrc" || propName === 'src') {
        return checkLoaded ? imageLoaded(dataElement) && dataElement[propName] || "" : dataElement[propName];
      } // Check if CSS strings should be parsed.


      if (propName === "CSS_STRING" && (0, _HelperUtils.isString)(dataElement)) {
        return dataElement;
      }

      return dataElement[propName] || "";
    }); // Encapsulate in URL string and return.

    return getUrlString({
      imageString: imageString,
      tracedSVG: tracedSVG,
      addUrl: addUrl,
      returnArray: returnArray
    });
  } else {
    // If `currentSrc` or `src` is needed, check image load completion first.
    if ((propName === "currentSrc" || propName === 'src') && propName in data) {
      return getUrlString({
        imageString: checkLoaded ? imageLoaded(data) && data[propName] || "" : data[propName],
        addUrl: addUrl
      });
    }

    return propName in data ? getUrlString({
      imageString: data[propName],
      tracedSVG: tracedSVG,
      addUrl: addUrl
    }) : "";
  }
};
/**
 * Encapsulates an imageString with a url if needed.
 *
 * @param imageString   string    String to encapsulate.
 * @param tracedSVG     boolean   Special care for SVGs.
 * @param addUrl        boolean   If the string should be encapsulated or not.
 * @param returnArray   boolean   Return concatenated string or Array.
 * @param hasImageUrls  boolean   Force return of quoted string(s) for url().
 * @return {string||array}
 */


exports.getCurrentFromData = getCurrentFromData;

var getUrlString = function getUrlString(_ref3) {
  var imageString = _ref3.imageString,
      _ref3$tracedSVG = _ref3.tracedSVG,
      tracedSVG = _ref3$tracedSVG === void 0 ? false : _ref3$tracedSVG,
      _ref3$addUrl = _ref3.addUrl,
      addUrl = _ref3$addUrl === void 0 ? true : _ref3$addUrl,
      _ref3$returnArray = _ref3.returnArray,
      returnArray = _ref3$returnArray === void 0 ? false : _ref3$returnArray,
      _ref3$hasImageUrls = _ref3.hasImageUrls,
      hasImageUrls = _ref3$hasImageUrls === void 0 ? false : _ref3$hasImageUrls;

  if ((0, _isArray.default)(imageString)) {
    var stringArray = (0, _map.default)(imageString).call(imageString, function (currentString) {
      if (currentString) {
        var base64 = (0, _indexOf.default)(currentString).call(currentString, "base64") !== -1;
        var imageUrl = hasImageUrls || currentString.substr(0, 4) === "http";
        var currentReturnString = currentString && tracedSVG ? "\"" + currentString + "\"" : currentString && !base64 && !tracedSVG && imageUrl ? "'" + currentString + "'" : currentString;
        return addUrl && currentString ? "url(" + currentReturnString + ")" : currentReturnString;
      }

      return currentString;
    });
    return returnArray ? stringArray : (0, _HelperUtils.filteredJoin)(stringArray);
  } else {
    var base64 = (0, _indexOf.default)(imageString).call(imageString, "base64") !== -1;
    var imageUrl = hasImageUrls || imageString.substr(0, 4) === "http";
    var returnString = imageString && tracedSVG ? "\"" + imageString + "\"" : imageString && !base64 && !tracedSVG && imageUrl ? "'" + imageString + "'" : imageString;
    return imageString ? addUrl ? "url(" + returnString + ")" : returnString : "";
  }
};
/**
 * Checks if any image props have changed.
 *
 * @param props
 * @param prevProps
 * @return {*}
 */


exports.getUrlString = getUrlString;

var imagePropsChanged = function imagePropsChanged(props, prevProps) {
  return (// Do we have different image types?
    props.fluid && !prevProps.fluid || props.fixed && !prevProps.fixed || imageArrayPropsChanged(props, prevProps) || // Are single image sources different?
    props.fluid && prevProps.fluid && props.fluid.src !== prevProps.fluid.src || props.fixed && prevProps.fixed && props.fixed.src !== prevProps.fixed.src
  );
};
/**
 * Decides if two given props with array images differ.
 *
 * @param props
 * @param prevProps
 * @return {boolean}
 */


exports.imagePropsChanged = imagePropsChanged;

var imageArrayPropsChanged = function imageArrayPropsChanged(props, prevProps) {
  var isPropsFluidArray = (0, _isArray.default)(props.fluid);
  var isPrevPropsFluidArray = (0, _isArray.default)(prevProps.fluid);
  var isPropsFixedArray = (0, _isArray.default)(props.fixed);
  var isPrevPropsFixedArray = (0, _isArray.default)(prevProps.fixed);

  if ( // Did the props change to a single image?
  isPropsFluidArray && !isPrevPropsFluidArray || isPropsFixedArray && !isPrevPropsFixedArray || // Did the props change to an Array?
  !isPropsFluidArray && isPrevPropsFluidArray || !isPropsFixedArray && isPrevPropsFixedArray) {
    return true;
  } else {
    // Are the lengths or sources in the Arrays different?
    if (isPropsFluidArray && isPrevPropsFluidArray) {
      if (props.fluid.length === prevProps.fluid.length) {
        var _context;

        // Check for individual image or CSS string changes.
        return (0, _every.default)(_context = props.fluid).call(_context, function (image, index) {
          return image.src !== prevProps.fluid[index].src;
        });
      }

      return true;
    } else if (isPropsFixedArray && isPrevPropsFixedArray) {
      if (props.fixed.length === prevProps.fixed.length) {
        var _context2;

        // Check for individual image or CSS string changes.
        return (0, _every.default)(_context2 = props.fixed).call(_context2, function (image, index) {
          return image.src !== prevProps.fixed[index].src;
        });
      }

      return true;
    }
  }
};
/**
 * Prepares initial background image(s).
 *
 * @param props         object    Component properties.
 * @param withDummies   boolean   If array preserving bg layering should be add.
 * @return {string|(string|Array)}
 */


exports.imageArrayPropsChanged = imageArrayPropsChanged;

var initialBgImage = function initialBgImage(props, withDummies) {
  if (withDummies === void 0) {
    withDummies = true;
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var image = convertedProps.fluid || convertedProps.fixed; // Prevent failing if neither fluid nor fixed are present.

  if (!image) return "";
  var returnArray = (0, _HelperUtils.hasImageArray)(convertedProps);
  var initialImage;

  if (returnArray) {
    // Check for tracedSVG first.
    initialImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG",
      returnArray: returnArray
    }); // Now combine with base64 images.

    initialImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "base64",
      returnArray: returnArray
    }), initialImage); // Now add possible `rgba()` or similar CSS string props.

    initialImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), initialImage);

    if (withDummies) {
      var dummyArray = createDummyImageArray(image.length); // Now combine the two arrays and join them.

      initialImage = (0, _HelperUtils.combineArray)(initialImage, dummyArray);
    }
  } else {
    initialImage = "";
    if (image.tracedSVG) initialImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG"
    });
    if (image.base64 && !image.tracedSVG) initialImage = getCurrentFromData({
      data: image,
      propName: "base64"
    });
  }

  return initialImage;
};
/**
 * Creates an array with a transparent dummy pixel for background-* properties.
 *
 * @param length
 * @return {any[]}
 */


exports.initialBgImage = initialBgImage;

var createDummyImageArray = function createDummyImageArray(length) {
  var _context3;

  var DUMMY_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  var dummyImageURI = getUrlString({
    imageString: DUMMY_IMG
  });
  return (0, _fill.default)(_context3 = Array(length)).call(_context3, dummyImageURI);
};
/**
 * Checks if an image (array) reference is existing and tests for complete.
 *
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 * @return {boolean}
 */


exports.createDummyImageArray = createDummyImageArray;

var imageReferenceCompleted = function imageReferenceCompleted(imageRef) {
  return imageRef ? (0, _isArray.default)(imageRef) ? (0, _every.default)(imageRef).call(imageRef, function (singleImageRef) {
    return imageLoaded(singleImageRef);
  }) : imageLoaded(imageRef) : false;
};
/**
 * Checks if an image really was fully loaded.
 *
 * @param imageRef  HTMLImageElement  Reference to an image.
 * @return {boolean}
 */


exports.imageReferenceCompleted = imageReferenceCompleted;

var imageLoaded = function imageLoaded(imageRef) {
  return imageRef ? imageRef.complete && imageRef.naturalWidth !== 0 && imageRef.naturalHeight !== 0 : false;
};

exports.imageLoaded = imageLoaded;