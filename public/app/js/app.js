'use strict';





// Declare app level module which depends on filters, and services
angular.module('pulse', [
  'ngRoute',
  'mm.foundation',
  'n3-line-chart',
  'pulse.filters',
  'pulse.services',
  'pulse.directives',
  'pulse.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {templateUrl: 'partials/main.html', controller: 'ContentController'});
  $routeProvider.when('/ask', {templateUrl: 'partials/ask.html', controller: 'ContentController'});
  $routeProvider.when('/user/:user', {templateUrl: 'partials/user.html', controller: 'UserController'});
  $routeProvider.when('/project/:project', {templateUrl: 'partials/project.html', controller: 'ProjectController'});
  $routeProvider.otherwise({redirectTo: '/main'});

}]) // use underscore in the application
.factory('_', function() {
	return window._; // assumes underscore has already been loaded on the page
});

