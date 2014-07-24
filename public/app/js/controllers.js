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
   $scope.itemsPerPage['projects'] = 6;
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
                                    	$log.log($scope.models[model] + "  items length : "+items.length+ " |   per page:" + $scope.itemsPerPage[model]);
                                    	$log.log("math ceil : " + Math.ceil(items.length / $scope.itemsPerPage[model]));
	}	
		
	$scope.getPaginationObj = function(model) {
		if ($scope.models.length == 0 || $scope.models[model] == undefined) {
			return null;
		}
		return $scope.paginationInfo[model];
	}
        
  }])
  .controller('UserController', ['$scope', '$routeParams', 'UserService' ,'$log', 
        function($scope, $routeParams, UserService, $log) {
      	
	 	$scope.userData = {};
	 	
		UserService.getUserData($routeParams.user).then(function (data) {
			$scope.userData = data;	 
		});

  }]).controller('ProjectController', ['$scope', '$routeParams', 'ProjectService' ,'$log', '_' ,
        function($scope, $routeParams, ProjectService, $log, _) {
      	
	 	$scope.projectData = [];
		
		ProjectService.getProjectData($routeParams.project).then(function (data) {
			 $scope.projectData = data;
		});
		
  }]).controller('GraphController', ['$scope', '$routeParams', '$q', 'ProjectService' ,'$log', '_' ,
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
			$scope.buildEventGraphData = function (events) {
				$scope.eventGraphData = [];
				// event dates to number of events per day in month back from today
			 	
		 		var curMonth = {};

		 		var currentDate = new Date()
		 		var daysThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
		 		
		 		_.times(daysThisMonth, function(index){ curMonth[index] = 0; });

		 		if (typeof events !== 'undefined' && events.length > 0) {	

		 			
					_.each(events, function(projectEvent){
						var exactDate = new Date(projectEvent.info.date*1000);
						curMonth[exactDate.getDate()] = parseInt(curMonth[exactDate.getDate()])+1;					
					});
				}

				
				_.map(curMonth, function(num, key){ 
					$scope.eventGraphData.push({x: parseInt(key), value: num});
					
				});
				$log.log(JSON.stringify($scope.eventGraphData));
				
			}
		
  }])
.controller('ProjectGraphController', ['$scope', 'ProjectService' ,'$log' ,
        function($scope , ProjectService, $log ) {
      	
		$scope.projectEvents = [];

		$scope.setProject = function (projectId) {
			ProjectService.getProjectData(projectId).then(function (data) {
				// event dates to number of events per day in month back from today
			 	if (typeof data.events !== 'undefined' && data.events.length > 0) {
			 		$scope.projectEvents = data.events;
 			 	}
			});
		}
		
  }]);
