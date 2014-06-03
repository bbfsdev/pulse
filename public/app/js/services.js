'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('pulse.services', [])
  .value('version', '0.1')
  .service('ContentService', ["$http", "$q", "$log", function ($http, $q, $log) {
	   this.mockBackendUrl = "dat";
		this.availableModels = [];
		this.ready = $q.defer();
		
		this.getAvailableModels = function () {
			var deferred = $q.defer();
			$log.log("loading models from: dat/availableModels.json");
			$http({method: 'GET', url:'dat/availableModels.json'}).then(function(result) {
				deferred.resolve(result.data);
			
			}, function (error) { $log.log("failed getting available models - error : " + error.status + " " + error.data);});	
		
			return deferred.promise;
		};  
		
		this.getModelContent = function (model) {
			var service = this;
			var deferred = $q.defer();
			service.ready.promise.then(function () {
				$log.log("loading data from : /" + model);
				$http({method: 'GET', url: '/' + model} )
					.then(function (result){
						$log.log(model + " data recieved from server : " + result.data);
						deferred.resolve(result.data);									
					}, function error(error) { 
						$log.log(model + " failed loading data.  " + JSON.stringify(error));
					});
			 });
			 
			 return deferred.promise;
		};
		this.hi = function () { $log.log("hi"); }
		
		this.init = function () {
			var service = this;
			service.getAvailableModels().then(function (data) {
				service.availableModels = data;
				service.ready.resolve();
				$log.log("service is ready");
				$log.log("available models : " + JSON.stringify(service.availableModels));
			});
		}
		
		this.init();	
}]);
