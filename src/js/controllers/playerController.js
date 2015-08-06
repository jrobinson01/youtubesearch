angular.module("app").controller("playerController", ["$scope", "$rootScope", function($scope, $rootScope){
	//currently selected video
	$scope.currentVideo = null;
	$scope.player = null;

	
	$rootScope.$on("playVideo", function(event, video){
		//force scroll to top
		window.scrollTo(0, 0);
		$scope.currentVideo = video;

		//videoId is in different places when videos come from search results vs playlist
		var videoId = null;
		
		//video is from search results
		if(video.id.videoId != undefined){
			videoId = video.id.videoId;
		}
		//video is from a playlist
		if(videoId == null) {
			videoId = video.snippet.resourceId.videoId;
		}
		//player event handlers
		//TODO: move to $scope
		var onPlayerReady = function(){
			//console.log("player ready");
			$scope.player.loadVideoById(videoId);
		};
		var onPlayerStateChange = function() {
			console.log("player state change");
		};

		if($scope.player == null) {
			//create the player
			$scope.player = new YT.Player('iframe-player', {
				events: {
	            'onReady': onPlayerReady,
	            'onStateChange': onPlayerStateChange
	          }
	        });
		} else {
			$scope.player.loadVideoById(videoId);
		}
		
	});
	
	//relay addFavorites event
	$scope.addToFavorites = function() {
		console.log("player addToFavorites", $scope.currentVideo);
		$rootScope.$emit("addFavorite", $scope.currentVideo);
	};
	
}]);