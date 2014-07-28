'use strict';

/* Directives */


angular.module('pulse.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('searchableContent', [ '$log' , '$filter', function($log, $filter) {
    return {
      restrict: 'E',
      scope: {
       title : '@',
       model : '@',
       design : '@',
       paginate : '@'
      },
      controller : "ContentController",
      transclude: true,
      template: function(tElem, tAttrs){
        var modelType = "models['"+tAttrs['model']+"']";
        var temp = '<h3>{{title}}</h3>' + 
                   '<input type="text" placeholder="search.." ng-model="search.query" ng-keyup="updatePagInfo(search.query)"/>';
            if (tAttrs['paginate'] == 'true') {  
               temp += '<pagination total-items="pagInfo.totalItems" page="pagInfo.currentPage" num-pages="pagInfo.numPages" class="left" boundary-links="true" rotate="false" ></pagination>'
                    + '<b class="right">Page: {{pagInfo.currentPage}} / {{pagInfo.numPages}}</b><div class="clearfix"></div>';
            } 
            temp += '<div class="{{design}}" ng-repeat="data in items | sliceArray: ((pagInfo.currentPage-1)*pagInfo.itemsPerPage):(pagInfo.currentPage*pagInfo.itemsPerPage)" ng-transclude>' +
                     + '</div>';
           
            return temp; 
          },

          link : function(scope, element, attrs) {
              scope.getContent(scope.model).then(function (data) {
              scope.pagInfo = scope.getPaginationObj(scope.model);
              scope.originalItems = data;
              scope.items = data;	
          });
	       	  
	       	  scope.updatePagInfo = function(searchQuery) {

	       	 		scope.pagInfo.currentPage = 1;
	       	 		if (searchQuery.length == 0) {
	       		 		scope.items = scope.originalItems;
	      	 	 	} else {
							  scope.items = $filter('filter')(scope.originalItems, searchQuery);	       	 			
		       	 	}
		       	 	  scope.pagInfo.numPages = Math.ceil(scope.items.length / scope.pagInfo.itemsPerPage);
	       	  };
	       	  
          }

    }; 
  }])
   .directive('eventGraph', [ '$log' , '$filter', function($log, $filter) {
    return {
          restrict: 'E',
           scope: {
            design : '@',
            mode : '@',
            eventsData : '=',
            seriesType : '@'
          },
	  controller : "GraphController",
     template: function(tElem, tAttrs){         
		 return '<div class="{{design}}"><linechart data="eventGraphData" options="graphOptions" mode="{{mode}}"></linechart></div>'; 
          },

          link : function(scope, element, attrs) {
              scope.graphOptions['series'][0]['type'] = scope.seriesType;
              scope.$watch('eventsData', function() {
                scope.buildEventGraphData(scope.eventsData);      
              });
          	   	  
          }

    }; 
  }])
   .directive('projectRow', [ '$log' , '$filter', function($log, $filter) {
    return {
          restrict: 'E',
          scope: {
            project : '='
          },
          templateUrl: 'templates/project_row_template.html'

    }; 
  }])
  .directive('icon', [ function() {
    return {
          restrict: 'E',
          scope: {
            of : '@'
          },
	  replace : true,
     template: function(tElem, tAttrs){         
		 return '<img ng-src="{{ temp | toIconUrl }}" class="icon"/>'; 
          },

          link : function(scope, element, attrs) {	       	  
	       	  scope.temp = scope.of;
          }

    };
 }]); 
