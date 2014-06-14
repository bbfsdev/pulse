'use strict';

/* Directives */


angular.module('pulse.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('searchableContent', ['$log', function($log) {
    return {
          restrict: 'E',
           scope: {
            title : '@',
	    model : '@',
	    design : '@'
          },
	  replace : true,
	  controller : "ContentController",
     template: function(tElem, tAttrs){
		 var modelType = "models['"+tAttrs['model']+"']";
	         var temp = '<h4>{{title}}</h4>{{x}}' + 
                           '<input type="text" placeholder="search.." ng-model="'+ modelType +'.query" />';
	         if (tAttrs['type']=='ul') {
                     temp += '<ul>' +
				'<li ng-repeat="data in ' + modelType +' | filter:'+modelType+'.query">'+ tElem.html() + '</li>' +
		             '</ul>';
		      } else if (tAttrs['type']=='ul-2-column') {
		      	  temp += '<ul id="double" class="two-column">' +
				'<li class="{{design}}" ng-repeat="data in ' + modelType +' | filter:'+modelType+'.query">'+ tElem.html() + '</li>' +
		             '</ul>';
            } else if (tAttrs['type']=='div') {
                     temp += '<div class="{{design}}" ng-repeat="data in '+modelType+' | filter:'+modelType+'.query">' +
				   '<p>' + tElem.html() +'</p>' +
			      '</div>';
		 }
                 
		 return '<div> '+temp+' </div>'; 
          },

          link : function(scope, element, attrs) {
	       	  scope.getContent(scope.model);
          }


    }; 
  }]);
