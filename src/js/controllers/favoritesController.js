angular.module("app").controller("favoritesController", ["$scope","$rootScope", function($scope, $rootScope){

	$scope.model = {
		favorites:[],
		key:null
	};
	
	$scope.getFavorites = function(){
		var favs = localStorage.getItem($scope.model.key);
		if(favs == null) {
			$scope.model.favorites = [];
			$scope.saveFavorites();
		} else {
			$scope.$apply(function(){
				$scope.model.favorites = JSON.parse(favs);
			});
		}
	};

	$scope.saveFavorites = function() {
		localStorage.setItem($scope.model.key, JSON.stringify($scope.model.favorites));
	};

	$scope.addFavorite = function(video){
		//prevent duplicates
		for(var i=0; i<$scope.model.favorites.length; i++) {
			var f = $scope.model.favorites[i];
			if(f.id.videoId == video.id.videoId){
				return;//duplicate
			}
		}
		$scope.model.favorites.push(video);
		$scope.saveFavorites();
	};

	$scope.removeFavorite = function(video){
		for(var i=0;i<$scope.model.favorites.length; i++) {
			//find it and remove it!
			var f = $scope.model.favorites[i];
			if(f.id.videoId == video.id.videoId) {
				$scope.model.favorites.splice(i,1);
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
			$scope.model.key = "bannotube_favorites_"+gapi.auth.getToken().client_id;//create a unique key for the logged in user
			$scope.getFavorites();
		}
	});

}]);