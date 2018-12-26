"use strict";
var countries = require('./data/airports.json')
var page, country;
var webpage = require('webpage');

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
                condition = true;
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

function process() {
  if (countries.length == 0) {
    phantom.exit();
  } else {
    country = countries.shift();
    page = webpage.create();
    page.viewportSize = { width: 1200, height: 630 };
    page.open('https://frequenci.es/' + country.country.toLowerCase(), function(status) {
      if (status !== "success") {
        console.log(country.country + ' - Failed');
      } else {
        waitFor(function() {
            return page.evaluate(function() {
              return window.frequencies;
            });
        }, function() {
          console.log(country.country + ' - Success');
          page.render('src/images/og-image-' + country.country.toLowerCase() + '.png');
          page.release();
          process();
        });
      }
    });
  }
}

process();
