"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.combineArray = exports.filteredJoin = exports.hashString = exports.stringToArray = exports.toKebabCase = exports.toCamelCase = exports.hasImageArray = exports.convertProps = exports.stripRemainingProps = exports.isString = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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
  var remainingProps = (0, _extends2.default)({}, props);
  gbiPropTypes.forEach(function (propTypesKey) {
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
  var convertedProps = (0, _extends2.default)({}, props);

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
  return props.fluid && Array.isArray(props.fluid) || props.fixed && Array.isArray(props.fixed);
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
    if (str.includes(delimiter)) {
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
  return isString(str) && [].reduce.call(str, function (hash, item) {
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
  return arrayToJoin.filter(function (item) {
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
  return fromArray.map(function (item, index) {
    return item || toArray[index];
  });
};

exports.combineArray = combineArray;