"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BackgroundUtils = _interopRequireDefault(require("./BackgroundUtils"));

var _HelperUtils = require("./HelperUtils");

var _ImageUtils = require("./ImageUtils");

var _StyleUtils = require("./StyleUtils");

var _IntersectionObserverUtils = require("./IntersectionObserverUtils");

var _jsxFileName = "/Users/hikouki/.ghq/github.com/hikouki/gatsby-background-image/packages/gatsby-background-image/src/index.js";

var BackgroundImage =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(BackgroundImage, _React$Component);

  // IntersectionObserver listeners (if available).
  function BackgroundImage(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // Default settings for browser without Intersection Observer available.

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "cleanUpListeners", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "intersectionListener", function () {
      var imageInCache = (0, _ImageUtils.inImageCache)(_this.props);

      if (!_this.state.isVisible && typeof _this.props.onStartLoad === "function") {
        _this.props.onStartLoad({
          wasCached: imageInCache
        });
      } // imgCached and imgLoaded must update after the image is activated and
      // isVisible is true. Once it is, imageRef becomes "accessible" for imgCached.
      // imgLoaded and imgCached are in a 2nd setState call to be changed together,
      // avoiding initiating unnecessary animation frames from style changes when
      // setting next imageState.


      _this.imageRef = (0, _ImageUtils.activatePictureRef)(_this.imageRef, _this.props, _this.selfRef);

      _this.setState({
        isVisible: true,
        imageState: _this.state.imageState + 1
      }, function () {
        _this.setState({
          imgLoaded: imageInCache,
          imgCached: !!_this.imageRef.currentSrc,
          imageState: _this.state.imageState + 1
        });
      });
    });
    var isVisible = true;
    var imgLoaded = false;
    var IOSupported = false;
    var fadeIn = props.fadeIn; // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.

    var seenBefore = (0, _ImageUtils.inImageCache)(props); // Browser with Intersection Observer available

    if (!seenBefore && typeof window !== "undefined" && window.IntersectionObserver) {
      isVisible = false;
      IOSupported = true;
    } // Never render image during SSR


    if (typeof window === "undefined") {
      isVisible = false;
    } // Force render for critical images.


    if (props.critical) {
      isVisible = true;
      IOSupported = false;
    } // Check if a noscript element should be included.


    var hasNoScript = !(props.critical && !fadeIn); // Set initial image state for transitioning.

    var imageState = 0; // Fixed class Name & added one (needed for multiple instances).

    var _fixClassName = (0, _StyleUtils.fixClassName)(props),
        currentClassNames = _fixClassName[0],
        addedClassName = _fixClassName[1];

    _this.state = {
      isVisible: isVisible,
      imgLoaded: imgLoaded,
      IOSupported: IOSupported,
      fadeIn: fadeIn,
      hasNoScript: hasNoScript,
      seenBefore: seenBefore,
      imageState: imageState,
      currentClassNames: currentClassNames,
      addedClassName: addedClassName
    }; // Preset backgroundStyles (e.g. during SSR or gatsby build).

    _this.backgroundStyles = (0, _StyleUtils.presetBackgroundStyles)((0, _BackgroundUtils.default)(props.className)); // Bind handlers to class.

    _this.handleImageLoaded = _this.handleImageLoaded.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleRef = _this.handleRef.bind((0, _assertThisInitialized2.default)(_this)); // Create reference(s) to an Image loaded via picture element in background.

    _this.imageRef = (0, _ImageUtils.createPictureRef)((0, _extends2.default)({}, props, {
      isVisible: isVisible
    }), _this.handleImageLoaded); // Start with base64, tracedSVG or empty background image(s).

    _this.bgImage = (0, _ImageUtils.initialBgImage)(props);
    _this.selfRef = null; // console.log(`-------------------------------------------------------------`)

    return _this;
  }

  var _proto = BackgroundImage.prototype;

  _proto.componentDidMount = function componentDidMount() {
    // Update background(-*) styles from CSS (e.g. Styled Components).
    this.backgroundStyles = (0, _StyleUtils.presetBackgroundStyles)((0, _BackgroundUtils.default)(this.props.className));

    if (this.state.isVisible && typeof this.props.onStartLoad === "function") {
      this.props.onStartLoad({
        wasCached: (0, _ImageUtils.inImageCache)(this.props)
      });
    }

    if (this.props.critical) {
      if ((0, _ImageUtils.imageReferenceCompleted)(this.imageRef)) {
        this.handleImageLoaded();
      }
    }

    var _fixClassName2 = (0, _StyleUtils.fixClassName)(this.props),
        currentClassNames = _fixClassName2[0],
        addedClassName = _fixClassName2[1];

    this.setState({
      currentClassNames: currentClassNames,
      addedClassName: addedClassName
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this2 = this;

    // Check if we received a changed fluid / fixed image.
    if ((0, _ImageUtils.imagePropsChanged)(this.props, prevProps)) {
      var imageInCache = (0, _ImageUtils.inImageCache)(this.props);

      var _fixClassName3 = (0, _StyleUtils.fixClassName)(this.props),
          currentClassNames = _fixClassName3[0],
          addedClassName = _fixClassName3[1];

      this.setState({
        isVisible: imageInCache || this.props.critical,
        imgLoaded: imageInCache,
        currentClassNames: currentClassNames,
        addedClassName: addedClassName //   this.state.currentClassNames ||
        //   fixClassName(this.props.className, this.randomClass),
        // imageState: (this.state.imageState + 1) % 2,

      }, function () {
        // Update bgImage & create new imageRef(s).
        _this2.bgImage = (0, _ImageUtils.getCurrentFromData)({
          data: _this2.imageRef,
          propName: "currentSrc",
          returnArray: true
        }) || (0, _ImageUtils.getCurrentFromData)({
          data: _this2.imageRef,
          propName: "src",
          returnArray: true
        });
        _this2.imageRef = (0, _ImageUtils.createPictureRef)((0, _extends2.default)({}, _this2.props, {
          isVisible: _this2.state.isVisible
        }), _this2.handleImageLoaded);
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    // Prevent calling handleImageLoaded from the imageRef(s) after unmount.
    if (this.imageRef) {
      if (Array.isArray(this.imageRef)) {
        this.imageRef.forEach(function (currentImageRef) {
          return currentImageRef.onload = null;
        });
      } else {
        this.imageRef.onload = null;
      }
    } // Clean up all IntersectionObserver listeners.


    if (this.cleanUpListeners) {
      this.cleanUpListeners();
    }
  };

  _proto.handleRef = function handleRef(ref) {
    this.selfRef = ref;

    if (this.state.IOSupported && ref) {
      this.cleanUpListeners = (0, _IntersectionObserverUtils.listenToIntersections)(ref, this.intersectionListener);
    }
  };

  _proto.handleImageLoaded = function handleImageLoaded() {
    (0, _ImageUtils.activateCacheForImage)(this.props);
    this.setState({
      imgLoaded: true,
      imageState: this.state.imageState + 1
    });

    if (this.state.seenBefore) {
      this.setState({
        fadeIn: false
      });
    }

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };

  _proto.render = function render() {
    var _fixOpacity = (0, _StyleUtils.fixOpacity)((0, _HelperUtils.convertProps)(this.props), this.props.preserveStackingContext),
        className = _fixOpacity.className,
        _fixOpacity$style = _fixOpacity.style,
        style = _fixOpacity$style === void 0 ? {} : _fixOpacity$style,
        fluid = _fixOpacity.fluid,
        fixed = _fixOpacity.fixed,
        backgroundColor = _fixOpacity.backgroundColor,
        durationFadeIn = _fixOpacity.durationFadeIn,
        Tag = _fixOpacity.Tag,
        children = _fixOpacity.children,
        _fixOpacity$classId = _fixOpacity.classId,
        classId = _fixOpacity$classId === void 0 ? !className ? Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7) + "_depr" : "" : _fixOpacity$classId,
        props = (0, _objectWithoutPropertiesLoose2.default)(_fixOpacity, ["className", "style", "fluid", "fixed", "backgroundColor", "durationFadeIn", "Tag", "children", "classId"]);

    var remainingProps = (0, _HelperUtils.stripRemainingProps)(props);
    var bgColor = typeof backgroundColor === "boolean" ? "lightgray" : typeof backgroundColor !== "undefined" ? backgroundColor : "";
    var shouldFadeIn = this.state.fadeIn === true && !this.state.imgCached || this.props.fadeIn === "soft";
    var transitionDelay = this.state.imgLoaded ? durationFadeIn + "ms" : "0.25s"; // Create base container style and only add opacity hack when
    // preserveStackingContext is falsy.

    var divStyle = (0, _extends2.default)({
      position: "relative"
    }, style);
    !this.props.preserveStackingContext && (divStyle.opacity = 0.99); // Choose image object of fluid or fixed, return null if not present.

    var image, noScriptImageData;

    if (fluid) {
      image = fluid;
      noScriptImageData = Array.isArray(fluid) ? fluid[0] : fluid;
    } else if (fixed) {
      image = fixed;
      divStyle.width = image.width;
      divStyle.height = image.height;
      divStyle.display = "inline-block";

      if (style.display === "inherit") {
        delete divStyle.display;
      }

      noScriptImageData = Array.isArray(fixed) ? fixed[0] : fixed;
    } else {
      return null;
    } // Set background-images and visibility according to images available.


    var newImageSettings = (0, _ImageUtils.switchImageSettings)({
      image: image,
      bgImage: this.bgImage,
      imageRef: this.imageRef,
      state: this.state
    }); // Set bgImage to available newImageSettings or fallback.

    this.bgImage = newImageSettings.nextImageArray || newImageSettings.nextImage || this.bgImage; // Create styles for the next background image(s).

    var pseudoStyles = (0, _StyleUtils.createPseudoStyles)((0, _extends2.default)({
      classId: classId,
      className: this.state.currentClassNames,
      transitionDelay: transitionDelay,
      bgColor: bgColor,
      backgroundStyles: this.backgroundStyles,
      style: style,
      fadeIn: shouldFadeIn
    }, newImageSettings));
    var noScriptPseudoStyles = (0, _StyleUtils.createNoScriptStyles)({
      image: image,
      bgColor: bgColor,
      classId: classId,
      className: this.state.currentClassNames,
      backgroundStyles: this.backgroundStyles,
      style: style
    }); // console.table(newImageSettings)
    // console.log(pseudoStyles)
    // console.log(image, noScriptPseudoStyles)
    // Switch key between fluid & fixed.

    var componentKey = "" + (fluid && "fluid") + (fixed && "fixed") + "-" + JSON.stringify(noScriptImageData.srcSet);
    return _react.default.createElement(Tag, (0, _extends2.default)({
      className: "" + (this.state.currentClassNames || "") + (classId && " gatsby-background-image-" + classId) + " gatsby-image-wrapper",
      style: (0, _extends2.default)({}, divStyle, {}, this.backgroundStyles),
      ref: this.handleRef,
      key: componentKey
    }, remainingProps, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 344
      },
      __self: this
    }), _react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: pseudoStyles
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 356
      },
      __self: this
    }), this.state.hasNoScript && _react.default.createElement("noscript", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 363
      },
      __self: this
    }, _react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: noScriptPseudoStyles
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 364
      },
      __self: this
    })), children);
  };

  return BackgroundImage;
}(_react.default.Component);

BackgroundImage.defaultProps = {
  critical: false,
  fadeIn: true,
  durationFadeIn: 500,
  Tag: "div",
  preserveStackingContext: false
};

var fixedObject = _propTypes.default.shape({
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired,
  src: _propTypes.default.string.isRequired,
  srcSet: _propTypes.default.string.isRequired,
  base64: _propTypes.default.string,
  tracedSVG: _propTypes.default.string,
  srcWebp: _propTypes.default.string,
  srcSetWebp: _propTypes.default.string,
  media: _propTypes.default.string
});

var fluidObject = _propTypes.default.shape({
  aspectRatio: _propTypes.default.number.isRequired,
  src: _propTypes.default.string.isRequired,
  srcSet: _propTypes.default.string.isRequired,
  sizes: _propTypes.default.string.isRequired,
  base64: _propTypes.default.string,
  tracedSVG: _propTypes.default.string,
  srcWebp: _propTypes.default.string,
  srcSetWebp: _propTypes.default.string,
  media: _propTypes.default.string
});

BackgroundImage.propTypes = {
  resolutions: _propTypes.default.oneOfType([fixedObject, _propTypes.default.arrayOf(_propTypes.default.oneOfType([fixedObject, _propTypes.default.string]))]),
  sizes: _propTypes.default.oneOfType([fluidObject, _propTypes.default.arrayOf(_propTypes.default.oneOfType([fluidObject, _propTypes.default.string]))]),
  fixed: _propTypes.default.oneOfType([fixedObject, _propTypes.default.arrayOf(_propTypes.default.oneOfType([fixedObject, _propTypes.default.string]))]),
  fluid: _propTypes.default.oneOfType([fluidObject, _propTypes.default.arrayOf(_propTypes.default.oneOfType([fluidObject, _propTypes.default.string]))]),
  fadeIn: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
  durationFadeIn: _propTypes.default.number,
  className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),
  // Support Glamor's css prop.
  critical: _propTypes.default.bool,
  crossOrigin: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
  style: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.array]),
  // Using PropTypes from RN.
  backgroundColor: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
  onLoad: _propTypes.default.func,
  onError: _propTypes.default.func,
  onStartLoad: _propTypes.default.func,
  Tag: _propTypes.default.string,
  classId: _propTypes.default.string,
  preserveStackingContext: _propTypes.default.bool
};
var _default = BackgroundImage;
exports.default = _default;