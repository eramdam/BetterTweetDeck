// webcrack, a script that allows you to break webpack.js's sandbox and randomization easily
// made by @NO_BOOT_DEVICE
// licensed under the trust that you will credit me for my work visibly and other than that you can go have fun with this

// window.wc is the webcrack object
// wc.get gives you the module attached to the id you give it.
//  literally just what webpack functions use. not much to it
//  this is the basic part of all this, everything else is just to allow you to updateproof your code

// both find functions return modules in this format:
//  {exports: [can be any type, whatever exports is set to in module],
//  id: [number, id of module like those passed to wc.get],
//  loaded: [boolean, if false, either try to load or just ignore this module]}
// wc.findFunc allows you to search modules by their constructor source (what you see in the script using webpackJsonp)
//  pass a string to search for that string
//  (for example, if you know the module you want has "api.example.com/echo" in it, you can pass that string to it to find it)
//  pass a function and it will return modules where function(modulefunction) is truthy
// wc.findCache allows you to search modules as loaded in memory.
//  pass a function, it will return modules where function(module) is truthy
//  pass a string and it will return modules if their exports is an object and has the string as a key

// wc.modArr is the list of module constructors
// wc.modCache is the list of modules as loaded as an object
// wc.modCArr is modCache but as an array

const wc = {};

window.webpackJsonp(
  [0],
  [
    function webcrack(n, b, d) {
      // d is the all holy require function.

      // appears to be an array of all module constructor functions
      wc.mArr = d.m;
      // appears to be a object with a cache of modules as singletons
      wc.mCac = d.c;
      // no idea why modCache is a object since it only has sequential number keys (correct me if i'm wrong)
      wc.mCar = [];

      Object.keys(wc.mCac).forEach(x => {
        wc.mCar[x] = wc.mCac[x];
      });
      wc.findFunc = function findFunc(s) {
        const results = [];
        if (typeof s === "string") {
          wc.mArr.forEach((r, t) => {
            if (r.toString().indexOf(s) !== -1) {
              results.push(wc.mCac[t]);
            }
          });
        } else if (typeof s === "function") {
          wc.mArr.forEach((r, e) => {
            if (s(r)) {
              results.push(wc.mCac[e]);
            }
          });
        } else {
          throw new TypeError(
            `findFunc can only find via string and function, ${typeof s} was passed`
          );
        }
        return results;
      };
      wc.findCache = function findCache(s) {
        const results = [];
        if (typeof s === "function") {
          wc.mCar.forEach(r => {
            if (s(r)) {
              results.push(r);
            }
          });
        } else if (typeof s === "string") {
          wc.mCar.forEach(r => {
            if (typeof r.exports === "object") {
              // eslint-disable-next-line
              for (let p in r.exports) {
                if (p === s) {
                  results.push(r);
                }
                if (p === "default" && typeof r.exports.default === "object") {
                  // eslint-disable-next-line
                  for (let q in r.exports.default) {
                    if (q === s) {
                      results.push(r);
                    }
                  }
                }
              }
            }
          });
        } else {
          throw new TypeError(
            `findCache can only find via function or string, ${typeof s} was passed`
          );
        }
        return results;
      };
    }
  ]
);

export default wc;
