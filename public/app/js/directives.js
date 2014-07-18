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
	  replace : true,
	  controller : "ContentController",
     template: function(tElem, tAttrs){
     	 var repeatTemplate = 'ng-repeat="data in items | sliceArray: ((pagInfo.currentPage-1)*pagInfo.itemsPerPage):(pagInfo.currentPage*pagInfo.itemsPerPage)"';
		 var modelType = "models['"+tAttrs['model']+"']";
	    var temp = '<h3>{{title}}</h3>{{x}}' + 
                           '<input type="text" placeholder="search.." ng-model="search.query" ng-keyup="updatePagInfo(search.query)"/>';
            if (tAttrs['paginate'] == 'true') {  
			       temp += '<pagination total-items="pagInfo.totalItems" page="pagInfo.currentPage" max-size="pagInfo.maxSize" class="left" boundary-links="true" rotate="false" num-pages="pagInfo.numPages"></pagination>'
    			            + '<b class="right">Page: {{pagInfo.currentPage}} / {{pagInfo.numPages}}</b><div class="clearfix"></div>';
    		   }
	         if (tAttrs['type']=='ul') {
                     temp += '<ul>' +
				'<li '+ repeatTemplate +'>'+ tElem.html() + '</li>' +
		             '</ul>';
		      } else if (tAttrs['type']=='ul-2-column') {
		      	  temp += '<ul id="double" class="two-column">' +
				'<li ' + repeatTemplate + '>'+ tElem.html() + '</li>' +
		             '</ul>';
            } else if (tAttrs['type']=='div') {
                     temp += '<div class="{{design}}" ' + repeatTemplate + '>' +
				   tElem.html() +
			      '</div>';
			   
		 }
                 
		 return '<div> '+temp+' </div>'; 
          },

          link : function(scope, element, attrs) {
	       	  scope.getContent(scope.model).then(function (data) {
	       	  		scope.pagInfo = scope.getPaginationObj(scope.model);
						scope.originalItems = data;
	       	  		scope.items = data
	       	  		
	       	  });
	       	  
	       	  scope.updatePagInfo = function(searchQuery) {

	       	 		scope.pagInfo.currentPage = 1;
	       	 		if (searchQuery.length == 0) {
	       		 		scope.items = scope.originalItems;
	      	 	 	} else {
							scope.items = $filter('filter')(scope.originalItems, searchQuery);	       	 			
		       	 	}
		       	 	scope.pagInfo.numPages = Math.ceil(scope.items.length / scope.pagInfo.itemsPerPage);
						$log.log(scope.pagInfo.numPages);
	       	  };
	       	  
          }

    }; 
  }])
   .directive('projectGraph', [ '$log' , '$filter', function($log, $filter) {
    return {
          restrict: 'E',
           scope: {
            projectId : '@',
            design : '@',
				mode : '@'
          },
	  controller : "ProjectGraphController",
     template: function(tElem, tAttrs){         
		 return '<div class="{{design}}"><linechart data="eventGraphData" options="graphOptions" mode="{{mode}}"></linechart></div>'; 
          },

          link : function(scope, element, attrs) {
          	
          	 scope.getProjectGraph(scope.projectId);	       	  
	       	  
          }

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
