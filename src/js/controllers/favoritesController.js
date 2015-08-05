angular.module("app").controller("favoritesController", ["$scope","$rootScope", function($scope, $rootScope){

	$scope.favorites = [];
	$scope.key = null;
	
	$scope.getFavorites = function(){
		var favs = localStorage.getItem($scope.key);
		if(favs == null) {
			$scope.favorites = [];
			localStorage.setItem($scope.key, JSON.stringify($scope.favorites));
		} else {
			$scope.favorites = JSON.parse(favs);
		}
		$scope.$digest();//force redraw
	};

	$scope.saveFavorites = function() {
		localStorage.setItem($scope.key, JSON.stringify($scope.favorites));
	};

	$scope.addFavorite = function(video){
		//prevent duplicates
		for(var i=0; i<$scope.favorites.length; i++) {
			var f = $scope.favorites[i];
			if(f.id.videoId == video.id.videoId){
				return;//duplicate
			}
		}
		$scope.favorites.push(video);
		$scope.saveFavorites();
	};

	$scope.removeFavorite = function(video){
		for(var i=0;i<$scope.favorites.length; i++) {
			//find it and remove it!
			var f = $scope.favorites[i];
			if(f.id.videoId == video.id.videoId) {
				$scope.favorites.splice(i,1);
			}
			$scope.saveFavorites();
		}
	};

	//listen for add favorite event
	$rootScope.$on("addFavorite", function(event, video){
		$scope.addFavorite(video);
	});

	//listen for youtube ready
	$rootScope.$on("youtubeReady", function(event, authenticated){
		if(authenticated){
			$scope.key = "bannotube_favorites_"+gapi.auth.getToken().client_id;//create a unique key for the logged in user
			$scope.getFavorites();
		}
	});

}]);