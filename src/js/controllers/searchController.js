angular.module("app").controller("searchController", ["$scope","$rootScope", function($scope, $rootScope){
	console.log("search $scope:", $scope);
	
	$scope.model = {
		results:[],
		query:"",
		totalResults:0,
		nextToken:null,
		prevToken:null,
		sort:"relevance",
		useLocation:false
	}

	//handle clicking search
	$scope.submitSearch = function() {
		console.log("search submit:", $scope.model.query, $scope.model.useLocation, $scope.model.sort);
		if($scope.model.query != "") {
			$scope.model.results = [];
			//initiate search!
			var options = {
				part:"snippet",
				maxResults:5,
				q:$scope.model.query
			}
			/*
			if($scope.model.useLocation) {
				options.locationRadius = "50mi";
				options.location="";//get from geoapi!
			}
			*/
			var request = gapi.client.youtube.search.list(options);
			request.execute(function(response){
				console.log("search response:", response.items);
				$scope.model.results = response.items;
				$scope.model.totalResults = response.pageInfo.totalResults;
				$scope.model.nextToken = response.nextPageToken;
				$scope.model.prevToken = response.previousPageToken;
				//JR: force a digest cycle to update dom
				$scope.$digest();
			})
		}
	};

	$scope.toggleLocation = function(){
		$scope.model.useLocation = !$scope.model.useLocation;
	};

	$scope.setSort = function(val) {
		$scope.model.sort = val;
	};

	$scope.addToWatchLater = function(video) {
		console.log("addToWatchLater clicked", video);
		$rootScope.$emit("addWatchLater", video);
	};
}]);