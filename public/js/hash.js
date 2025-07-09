/**
 * parseHash() – Converts location.hash (e.g. "#a=1&b=2")
 * into an object { a: "1", b: "2" }.
 * Adds it to window so any script can call window.parseHash().
 */
window.parseHash = function () {
  if (!location.hash || location.hash === '#') return {};
  return Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
};
