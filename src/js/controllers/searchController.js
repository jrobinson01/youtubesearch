angular.module("app").controller("searchController", ["$scope","$rootScope", function($scope, $rootScope){
	
	$scope.model = {
		results:[],
		query:"",
		totalResults:0,
		nextToken:null,
		prevToken:null,
		sort:"relevance",
		useLocation:false,
		rawResponse:null
	}

	//handle clicking search
	$scope.submitSearch = function() {
		console.log("search submit:", $scope.model.query, $scope.model.useLocation, $scope.model.sort);
		if($scope.model.query != "") {
			$scope.model.results = [];
			//initiate search!
			var options = {
				part:"snippet",
				maxResults:25,
				q:$scope.model.query,
				type:"video",
				order:$scope.model.sort
			};

			var runQuery = function() {
				console.log("running query:", options);
				var request = gapi.client.youtube.search.list(options);
				request.execute(function(response){
					console.log("search response:", response);
					if(response.error != undefined){
						$rootScope.$emit("apiError", response.error);
						return;
					}
					$scope.$apply(function(){
						$scope.model.results = response.items;
						$scope.model.totalResults = response.pageInfo.totalResults;
						$scope.model.nextToken = response.nextPageToken;
						$scope.model.prevToken = response.previousPageToken;
						$scope.model.rawResponse = response;
					});
				});
			};

			if($scope.model.useLocation) {
				//wait for geolocation callback
				options.locationRadius = "50mi";
				//options.location="";//get from geoapi!
				navigator.geolocation.getCurrentPosition(function(position){
					options.location = String(position.coords.latitude)+","+String(position.coords.longitude);
					console.log("position:", position.coords);
					runQuery();
				});
			} else {
				//no need to wait for geolocation callback, run it now!
				runQuery();
			}
			
			
		}
	};

	$scope.toggleLocation = function(){
		if($scope.model.rawResponse != null) {
			//re-run the search
			$scope.submitSearch();
		}
	};

	$scope.sortChange = function() {
		console.log("sortChange:", $scope.model.sort);
		if($scope.model.rawResponse != null) {
			//re-run the search
			$scope.submitSearch();
		}
	};

	$scope.setSort = function(val) {
		$scope.model.sort = val;
	};

	$scope.addToWatchLater = function(video) {
		console.log("addToWatchLater clicked", video);
		$rootScope.$emit("addWatchLater", video);
	};
}]);