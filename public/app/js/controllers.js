'use strict';

/* Controllers */

angular.module('pulse.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller('ContentController', ['$scope', 'ContentService' , '_', '$log' ,function($scope, ContentService, _, $log) {
	$scope.models = {};
	 
	// this should be replaces by an ajax call to a service of the backend
	$scope.models['wantHelp'] = [{user:'Dani',skill:'C++',time:'2 hours a week'}, {user:'Max',skill:'Wordpress',time:'4 hours a week'}];
	//$scope.models['members'] = [{user:'Dani',activity:'+1'},{user:'Max',activity:'+3'},{user:'Peter',activity:'0'}];
	$scope.models['helpNeeded'] = [{text:'Need embed chat into Wordpress',user:'Max'}, {text:'Need simple key/value database solution',user:'Peter'}];
	//$scope.models['projects'] = ['BBFS', 'WebRTC POC', 'MAK Online', 'Academy of Marriage'];	
  
	$scope.getContent = function(model) {
			ContentService.getModelContent(model).then(function (data) {
				 	$scope.models[model] = data;				 
			});
	};	
        
  }]);
