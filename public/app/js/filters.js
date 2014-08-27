'use strict';

/* Filters */

angular.module('pulse.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('sliceArray', ['$log',function($log) {
    return function(input,start, end) {
    if (input == undefined)
        return input;     
          
      return input.slice(start,end);
    };
  }])
  .filter('coolDate', ['$log',function($log) {
    return function(input) {
    if (input == undefined)
        return input;     
      
      var today = new Date();
    var date = new Date(input*1000); // input is unix timestamp
    var diffDays = Math.ceil(Math.abs(today.getTime() - date.getTime()) / (1000 * 3600 * 24)); 
    
    var dateHours = (date.getHours() == 0) ? '00' : date.getHours();
    var dateMinutes = (date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes();
  
    var output = "";    
    if (diffDays == 0) {
      output = "Today at " + dateHours + ":" + dateMinutes;
    } else if (diffDays == 1) {
      output = "Yesterday at " + dateHours + ":" + dateMinutes;
    } else {
      output = diffDays + " days ago";    
    }
        
      return output;
    };
  }])
  .filter('toIconUrl', ['IconService',function(IconService) {
    return function(input) {
    if (input == undefined)
        return input;     
      
      return IconService.getIcon(input);
       };
  }])
  .filter('capitalize' , [ function() {
      return function(input) {
        if (input == undefined)
          return input;     
        
        return input.charAt(0).toUpperCase() + input.substring(1);
      }

  }])
  .filter('ifUndefinedUse' , [ function() {
      return function(input, useMe) {
        if (input == undefined)
          return useMe;     
        else 
          return input
      }

  }])
  .filter('ifUndefinedUseDefaults', [ 'DEFAULTS',function (DEFAULTS) {
      return function(input, key) {
        if (input == undefined)
          return DEFAULTS[key];     
        else 
          return input
      }
  }]);
