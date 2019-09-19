"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.combineArray = exports.filteredJoin = exports.hashString = exports.stringToArray = exports.toKebabCase = exports.toCamelCase = exports.hasImageArray = exports.convertProps = exports.stripRemainingProps = exports.isString = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

/**
 * Mirror of BackgroundImage.propTypes. Keep in SYNC!
 *
 * @type {Object}
 */
var gbiPropTypes = ["resolutions", "sizes", "fixed", "fluid", "fadeIn", "durationFadeIn", "className", "critical", "crossOrigin", "style", "backgroundColor", "onLoad", "onError", "onStartLoad", "Tag", "classId", "preserveStackingContext"];
/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */

var isString = function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
};
/**
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */


exports.isString = isString;

var stripRemainingProps = function stripRemainingProps(props) {
  var remainingProps = (0, _assign.default)({}, props);
  (0, _forEach.default)(gbiPropTypes).call(gbiPropTypes, function (propTypesKey) {
    if (Object.prototype.hasOwnProperty.call(remainingProps, propTypesKey)) {
      delete remainingProps[propTypesKey];
    }
  });
  return remainingProps;
};
/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */


exports.stripRemainingProps = stripRemainingProps;

var convertProps = function convertProps(props) {
  var convertedProps = (0, _assign.default)({}, props);

  if (convertedProps.resolutions) {
    convertedProps.fixed = convertedProps.resolutions;
    delete convertedProps.resolutions;
  }

  if (convertedProps.sizes) {
    convertedProps.fluid = convertedProps.sizes;
    delete convertedProps.sizes;
  }

  return convertedProps;
};
/**
 * Checks if fluid or fixed are image arrays.
 *
 * @param props
 * @return {boolean}
 */


exports.convertProps = convertProps;

var hasImageArray = function hasImageArray(props) {
  return props.fluid && (0, _isArray.default)(props.fluid) || props.fixed && (0, _isArray.default)(props.fixed);
};
/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */


exports.hasImageArray = hasImageArray;

var toCamelCase = function toCamelCase(str) {
  return isString(str) && str.toLowerCase().replace(/(?:^\w|-|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s|\W+/g, '');
};
/**
 * Converts camel-cased js style rules to CSS kebab-case strings.
 *
 * @param str string    Rule to transform
 * @return {boolean|string}
 */


exports.toCamelCase = toCamelCase;

var toKebabCase = function toKebabCase(str) {
  return isString(str) && str.replace(/\s|\W+/g, '').replace(/[A-Z]/g, function (match) {
    return "-" + match.toLowerCase();
  });
};
/**
 * Splits a given string (e.g. from classname) to an array.
 *
 * @param str string|array  String to split or return as array
 * @param delimiter string  Delimiter on which to split str
 * @return {array|boolean}  Returns (split) string as array, false on failure
 */


exports.toKebabCase = toKebabCase;

var stringToArray = function stringToArray(str, delimiter) {
  if (delimiter === void 0) {
    delimiter = " ";
  }

  if (str instanceof Array) {
    return str;
  }

  if (isString(str)) {
    if ((0, _includes.default)(str).call(str, delimiter)) {
      return str.split(delimiter);
    }

    return [str];
  }

  return false;
};
/**
 * Hashes a String to a 32bit integer with the simple Java 8 hashCode() func.
 *
 * @param str   string    String to hash.
 * @return {number}
 */


exports.stringToArray = stringToArray;

var hashString = function hashString(str) {
  return isString(str) && (0, _reduce.default)([]).call(str, function (hash, item) {
    hash = (hash << 5) - hash + item.charCodeAt(0);
    return hash | 0;
  }, 0);
};
/**
 * As the name says, it filters out empty strings from an array and joins it.
 *
 * @param arrayToJoin   array   Array to join after filtering.
 * @return {string}
 */


exports.hashString = hashString;

var filteredJoin = function filteredJoin(arrayToJoin) {
  return (0, _filter.default)(arrayToJoin).call(arrayToJoin, function (item) {
    return item !== "";
  }).join();
};
/**
 * Combines two arrays while keeping fromArrays indexes & values.
 *
 * @param fromArray   array   Array the values shall be taken from.
 * @param toArray     array   Array to copy values into.
 * @return {array}
 */


exports.filteredJoin = filteredJoin;

var combineArray = function combineArray(fromArray, toArray) {
  return (0, _map.default)(fromArray).call(fromArray, function (item, index) {
    return item || toArray[index];
  });
};

exports.combineArray = combineArray;