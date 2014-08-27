'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('pulse.services', [])
  .value('version', '0.1')
  .value('useMock', true)
  .service('ContentService', ["UrlService","$http", "$q", "$log", "_", "DataProcessService", function (UrlService, $http, $q, $log, _, DataProcessService) {
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
					$http({method: 'GET', url: UrlService.url('/' + model, 'dat/' + model + '.json', "liveUrl")} )
						.then(function (result){
							var method = DataProcessService.getProcessMethod(model);
							var data = result.data;
							if (_.isArray(data)) {
								if (method) { 
									_.each(data, method);
								}
							} else {
								data = (method) ? method(data) : data;	
							}
							$log.log(model + " data recieved from server : " + JSON.stringify(data));
							service.modelCache[model] = data;
							deferred.resolve(data);									
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
.service('ProjectService', ["UrlService" ,"$http", "$q", "$log", "_", "DataProcessService", function (UrlService, $http, $q, $log, _, DataProcessService) {
		
		this.projectData = {};	
		
		this.getProjectData = function (projectId) {
			var service = this;
			var deferred = $q.defer();

			$http({method: 'GET', url:UrlService.url('/projects/'+projectId, 'dat/project_bbfs.json', "liveUrl")}).then(function(result) {

				var processedData = DataProcessService.getProcessMethod('projects')(result.data);

				service.projectData['info'] = processedData.info;
				service.projectData['members'] = processedData.members;
				service.projectData['events'] = processedData.events;
				deferred.resolve(service.projectData);
		
			}, function (error) { $log.log("failed getting projects for user " + projectId + " - error : " + error.status + " " + error.data);});	

			return deferred.promise;
		};
				
}])
.service('UserService', ["UrlService", "$http", "$q", "$log", "DataProcessService",function (UrlService, $http, $q, $log, DataProcessService) {

		this.userData = {};	
		var service = this;
		this.getUserData = function (userId) {
			
			var deferred = $q.defer();

			$http({method: 'GET', url:UrlService.url('/members/'+userId, 'dat/1.json', "liveUrl")}).then(function(result) {

				var processedData = DataProcessService.getProcessMethod('members')(result.data);

				service.userData['info'] = processedData.info;
				service.userData['projects'] = processedData.projects;
				service.userData['events'] = processedData.events;

				deferred.resolve(service.userData);
		
			}, function (error) { $log.log("failed getting projects for user " + userId + " - error : " + error.status + " " + error.data);});	
		
			return deferred.promise;
		};		
				
}])
.service('IconService', [ function () { 

		this.iconFolder = 'img/icons/';
		this.icons = { 
						'members' : 'members_icon.png',
						'code_size' : 'code_lines_icon.png',
						'ruby' : 'ruby_icon.png',
						'cpp' : 'cpp_icon.gif',
						'c++' : 'cpp_icon.gif',
						'css' : 'css_icon.png',
						'java' : 'java_icon.gif',
						'xml' : 'xml_icon.gif',
						'python' : 'python_icon.png',
						'javascript' : 'javascript_icon.png',
						'shell' : 'shell_icon.png',
						'coffeescript' : 'coffeescript_icon.png',
						'bullet' : 'bullet.png',
						'semi_colon' : 'semi_colon.png'

					};
		
		this.getIcon = function (from, width, height) {
			if (width === undefined && height === undefined) {
				return  this.iconFolder + this.icons[from.toLowerCase()];
			}
		}
		
}])
.service('UrlService', ['useMock', function(useMock) {

	this.url = function (liveUrl, mockUrl, override) {
		if (override !== undefined) {
			if (override == "liveUrl") 
				return liveUrl;
			else
				return mockUrl;
		}

		if (useMock == true) {
			return mockUrl;
		} else {
			return liveUrl;
		}
	}
}])
.service('InfoService', ['_', '$log', function(_, $log) {

	this.zipLanguages = function(languages) {
		var out = [];
		if (languages) {
			var groups = _(languages).groupBy('name');

			out = _(groups).map(function(list, key) {
			  return { 
			     name: key, 
			     usage: _(list).reduce(function(m,x) { 
			       return m + x.usage;
			     }, 0) 
			  };
			});
		}

		return out;
	};

	this.languagesToPercentages = function(languages) {
		var languagesPercentage = [];
		if (languages) {
			var totalUsage = 0;
			_.each(languages, function(language) {
				totalUsage += parseInt(language['usage']);
			}); 

			_.each(languages, function(language) {
				languagesPercentage.push({'name' : language['name'], 'usage' : String(((language['usage'] / totalUsage)*100).toFixed(2)) + '%'});
			} );
		
		}
		return languagesPercentage; 
	};

	this.generateCodeSize = function (languages) {
		var codeSize = 0;
		if (languages) {
			var averageLength = 6;
			_.each(languages, function(languageObj) {
				codeSize += parseInt(languageObj['usage']);
			});

			codeSize = parseInt(codeSize / averageLength);
		}

		return codeSize;
	};

	this.generateLanguages = function(userData) {
		var languages = [];
		if (userData.projects) {
			_.each(userData.projects, function(project) {
				languages = languages.concat(project.info.languages);
			});
		}

		return languages;
	}

}])
.service('DataProcessService', ['InfoService', '$log', function(InfoService, $log) {
	var service = this;
	this.processUserData = function(userData, stopRecursive) {	

		userData.info['languages'] = InfoService.generateLanguages(userData);
		userData.info['languages'] = InfoService.zipLanguages(userData.info.languages);
		userData.info['languagesPercentage'] = InfoService.languagesToPercentages(userData.info.languages);
		userData.info['code_size'] = InfoService.generateCodeSize(userData.info.languages);
		userData.info['projects_count'] = (userData.projects && _.isArray(userData.projects)) ? userData.projects.length : 0;

		if (userData.projects && stopRecursive != true) {
			_.each(userData.projects, function (projectData) { service.processProjectData(projectData, true) });
		}

		return userData;
	};

	this.processProjectData = function(projectData, stopRecursive) {
		projectData.info['languages'] = InfoService.zipLanguages(projectData.info.languages);
		projectData.info['languagesPercentage'] = InfoService.languagesToPercentages(projectData.info.languages);
		projectData.info['code_size'] = InfoService.generateCodeSize(projectData.info.languages);
		projectData.info['members_count'] = (projectData.members && _.isArray(projectData.members)) ? projectData.members.length : 0;

		if (projectData.members && stopRecursive != true) {
			_.each(projectData.members, function (userData) { service.processUserData(userData, true) });
		}

		return projectData;
	};

	this.map = {
				'projects' : this.processProjectData,
				'members' : this.processUserData
			   };

	this.getProcessMethod = function (type) {
		return this.map[type];
	}

}]);
