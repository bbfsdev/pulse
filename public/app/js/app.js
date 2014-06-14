'use strict';





// Declare app level module which depends on filters, and services
angular.module('pulse', [
  'ngRoute',
  'mm.foundation',
  'pulse.filters',
  'pulse.services',
  'pulse.directives',
  'pulse.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {templateUrl: 'partials/view2.html', controller: 'ContentController'});
  $routeProvider.when('/ask', {templateUrl: 'partials/ask.html', controller: 'ContentController'});
  $routeProvider.otherwise({redirectTo: '/view2'});

}]) // use underscore in the application
.factory('_', function() {
	return window._; // assumes underscore has already been loaded on the page
});

