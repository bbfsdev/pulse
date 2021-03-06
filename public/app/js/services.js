'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('pulse.services', [])
  .value('version', '0.1')
  .value('useMock', true)
  .service('ContentService', ["UrlService","$http", "$q", "$log", function (UrlService, $http, $q, $log) {
	   this.mockBackendUrl = "dat";
		this.availableModels = [];
		this.modelCache = {};
		this.ready = $q.defer();
		
		this.getAvailableModels = function () {
			var deferred = $q.defer();
			$http({method: 'GET', url:'dat/availableModels.json'}).then(function(result) {
				deferred.resolve(result.data);
			
			}, function (error) { $log.log("failed getting available models - error : " + error.status + " " + error.data);});	
		
			return deferred.promise;
		};
		
		this.getModelContent = function (model) {
			var service = this;
			var deferred = $q.defer();
			service.ready.promise.then(function () {
				
				if (model in service.modelCache) {
					$log.log("loading " + model + " data from cache");
					deferred.resolve(service.modelCache[model]);
				} else {
					$log.log("loading data from : /" + model);
					$http({method: 'GET', url: UrlService.url('/' + model + '.json', 'dat/' + model + '.json')} )
						.then(function (result){
							$log.log(model + " data recieved from server : " + result.data);
							service.modelCache[model] = result.data;
							deferred.resolve(result.data);									
						}, function error(error) { 
							$log.log(model + " failed loading data.  " + JSON.stringify(error));
						});
				}
			});
			 
			 return deferred.promise;
		};
		
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
}])
.service('ProjectService', ["UrlService" ,"$http", "$q", "$log", function (UrlService, $http, $q, $log) {
		
		this.projectData = {};	
		
		this.getProjectData = function (projectId) {
			var service = this;
			var deferred = $q.defer();
			if ("info" in service.projectData) {
				deferred.resolve(service.projectData);
			} else {
				$http({method: 'GET', url:UrlService.url('/project/'+projectId, 'dat/project_bbfs.json')}).then(function(result) {
					service.projectData['info'] = result.data.info;
					service.projectData['members'] = result.data.members;
					service.projectData['events'] = result.data.events;
					deferred.resolve(service.projectData);
			
				}, function (error) { $log.log("failed getting projects for user " + projectId + " - error : " + error.status + " " + error.data);});	
			}
			return deferred.promise;
		};
				
}])
.service('UserService', ["UrlService", "$http", "$q", "$log", function (UrlService, $http, $q, $log) {

		this.userData = {};	
		
		this.getUserData = function (userId) {
			var service = this;
			var deferred = $q.defer();
			if ("info" in service.userData) {
				deferred.resolve(service.userData);
			} else {
				$http({method: 'GET', url:UrlService.url('/user/'+userId, 'dat/1.json')}).then(function(result) { 
					service.userData['info'] = result.data.info;
					service.userData['projects'] = result.data.projects;
					service.userData['events'] = result.data.events;
					deferred.resolve(service.userData);
			
				}, function (error) { $log.log("failed getting projects for user " + userId + " - error : " + error.status + " " + error.data);});	
			}
		
			return deferred.promise;
		};
				
}])
.service('IconService', [ function () { 

		this.iconFolder = 'img/icons/';
		this.icons = { 
						'members' : 'members_icon.png',
						'lines_of_code' : 'code_lines_icon.png',
						'ruby' : 'ruby_icon.png',
						'cpp' : 'cpp_icon.gif',
						'c++' : 'cpp_icon.gif',
						'css' : 'css_icon.png',
						'java' : 'java_icon.gif',
						'xml' : 'xml_icon.gif',
						'python' : 'python_icon.png'

					};
		
		this.getIcon = function (from, width, height) {
			if (width === undefined && height === undefined) {
				return  this.iconFolder + this.icons[from.toLowerCase()];
			}
		}
		
}])
.service('UrlService', ['useMock', function(useMock) {

	this.url = function (liveUrl, mockUrl) {
		if (useMock == true) {
			return mockUrl;
		} else {
			return liveUrl;
		}
	}
}]);
