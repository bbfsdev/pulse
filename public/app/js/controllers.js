'use strict';

/* Controllers */

angular.module('pulse.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller('ContentController', ['$scope', 'ContentService' , '_', '$log' ,function($scope, ContentService, _, $log) {
	$scope.models = {};
   $scope.paginationInfo = {};	
   $scope.itemsPerPage = {};
   $scope.itemsPerPage['projects'] = 3;
   $scope.itemsPerPage['members'] = 12;
	
	$scope.getContent = function(model) {
			return ContentService.getModelContent(model).then(function (data) {
				 	$scope.models[model] = data;
				 	$scope.setResetPaginationObj(model);
				 	return data;
			});
	};	

	$scope.setResetPaginationObj = function(model) {
			if ($scope.models.length == 0 || $scope.models[model] == undefined)
				return;
			
			var items = $scope.models[model];
			$scope.paginationInfo[model] = {'totalItems' : items.length, 
                                         'currentPage' : 1,
                                         'maxSize' : 5,
                                         'numPages' : Math.ceil(items.length / $scope.itemsPerPage[model]),
                                         'itemsPerPage' : $scope.itemsPerPage[model]
													  };		
													 
	}	
		
	$scope.getPaginationObj = function(model) {
			if ($scope.models.length == 0 || $scope.models[model] == undefined) {
				$log.log($scope.paginationInfo[model]);	
				return null;
				
			}
				$log.log($scope.paginationInfo[model]);
			return $scope.paginationInfo[model];
	}
        
  }])
  .controller('UserController', ['$scope', '$routeParams', '$q', '$http', 'ContentService' ,'$log', 
        function($scope, $routeParams, $q, $http, ContentService, $log) {
      	
	 	$scope.userData = {};
	 	
	 	this.getUserData = function (userId) {
			var deferred = $q.defer();
			if ("info" in $scope.userData) {
				deferred.resolve($scope.userData);
			} else {
				// $http({method: 'GET', url:'/'+user+'/:userId'}).then(function(result) {  - uncomment when using live data
				$http({method: 'GET', url:'dat/1.json'}).then(function(result) { // mockup data
					$scope.userData['info'] = result.data.info;
					$scope.userData['projects'] = result.data.projects;
					$scope.userData['events'] = result.data.events;
					$log.log($scope.userData);
					deferred.resolve($scope.userData);
			
				}, function (error) { $log.log("failed getting projects for user " + userId + " - error : " + error.status + " " + error.data);});	
		   } 
		   
			return deferred.promise;
		};
		
		this.getUserData($routeParams.user).then(function (data) {
			 
		});
  }]).controller('ProjectController', ['$scope', '$routeParams', '$http', 'ProjectService' ,'$log', '_' ,
        function($scope, $routeParams, $http, ProjectService, $log, _) {
      	
	 	$scope.projectData = [];
		
		ProjectService.getProjectData($routeParams.project).then(function (data) {
			 
			 $scope.projectData = data;
 			 
		});
		
  }]).controller('ProjectGraphController', ['$scope', '$routeParams', '$q', 'ProjectService' ,'$log', '_' ,
        function($scope, $routeParams, $q,  ProjectService, $log, _) {
      	
		$scope.eventGraphData = [];	 
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var currentDate = new Date();
		
			
	 	$scope.graphOptions = {
 						 	axes: {x: {type: "linear", labelFunction: function(value) {return months[currentDate.getMonth()] + ' ' + (value+1);}}, y: {type: "linear"}},
  							series: [
   	 								{
  	    									y: "value",
  	    									label: "Events",
  	    									color: "black",
  	    									type: "area",
  	    									axis: "y",
  	    									thickness: "1px",
  	    									id: "series_0"
  	  									}
  									  ],
  										tooltip: {
  	  									    mode: "scrubber",
  									},
  									stacks: [],
  									lineMode: "bundle",
  									tension: 0.7,
  									drawLegend: false,
  									drawDots: false
							};
		$scope.getProjectGraph = function (projectId) {
		
			ProjectService.getProjectData(projectId).then(function (data) {
				
				// event dates to number of events per day in month back from today
			 	if (typeof data.events !== 'undefined' && data.events.length > 0) {
			 		var curMonth = {};

			 		var currentDate = new Date()
			 		var daysThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

			 		_.times(daysThisMonth, function(index){ curMonth[index] = 0; });

					_.each(data.events, function(projectEvent){
						$log.log(projectEvent.info.date);
						var exactDate = new Date(projectEvent.info.date*1000);

						curMonth[exactDate.getDate()] = parseInt(curMonth[exactDate.getDate()])+1;
						
					});
					
					_.map(curMonth, function(num, key){ 
						$scope.eventGraphData.push({x: parseInt(key), value: num});
					});
					
 			 	}
 			 
			});
		}
		
  }]);
