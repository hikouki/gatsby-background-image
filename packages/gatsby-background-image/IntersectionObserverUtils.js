"use strict";

exports.__esModule = true;
exports.listenToIntersections = exports.getIO = exports.callbackIO = void 0;
var io;
var listeners = new WeakMap();
/**
 * Executes each IntersectionObserver entries' callback.
 *
 * @param entries
 */

var callbackIO = function callbackIO(entries) {
  entries.forEach(function (entry) {
    if (listeners.has(entry.target)) {
      var callback = listeners.get(entry.target); // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        io.unobserve(entry.target);
        listeners.delete(entry.target);
        callback();
      }
    }
  });
};
/**
 * Returns an IntersectionObserver instance if exists.
 *
 * @return {IntersectionObserver|undefined}
 */


exports.callbackIO = callbackIO;

var getIO = function getIO() {
  if (typeof io === "undefined" && typeof window !== "undefined" && window.IntersectionObserver) {
    io = new window.IntersectionObserver(callbackIO, {
      rootMargin: "200px"
    });
  }

  return io;
};
/**
 * Registers IntersectionObserver callback on element.
 *
 * @param element
 * @param callback
 * @return {Function}
 */


exports.getIO = getIO;

var listenToIntersections = function listenToIntersections(element, callback) {
  var observer = getIO();

  if (observer) {
    observer.observe(element);
    listeners.set(element, callback);
    return function () {
      observer.unobserve(element);
      listeners.delete(element);
    };
  }

  return function () {};
};

exports.listenToIntersections = listenToIntersections;