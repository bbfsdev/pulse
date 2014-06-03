'use strict';





// Declare app level module which depends on filters, and services
angular.module('pulse', [
  'ngRoute',
  'pulse.filters',
  'pulse.services',
  'pulse.directives',
  'pulse.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tables', {templateUrl: 'partials/tables.html', controller: 'MyCtrl1'});
  $routeProvider.when('/ask', {templateUrl: 'partials/ask.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/tables'});

}]) // use underscore in the application
.factory('_', function() {
	return window._; // assumes underscore has already been loaded on the page
});

