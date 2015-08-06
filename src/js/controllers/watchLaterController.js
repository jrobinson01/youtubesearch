angular.module("app").controller("watchLaterController", ["$scope","$rootScope", function($scope, $rootScope){
	
	
	$scope.watchLater = [];
	$scope.watchLaterId = null;
	
	//if we're authenticated, start loading watchLater list.
	$rootScope.$on("youtubeReady", function(event, authenticated){
		//skip if not authenticated
		if(!authenticated){
			return;
		}

		$scope.listWatchLater();
	});

	$scope.listWatchLater = function() {
		var options = {
			part:"snippet,contentDetails",
			mine:true
		};
		
		var request = gapi.client.youtube.channels.list(options);
		
		request.execute(function(response){
			
			if(response.error != undefined){
				$rootScope.$emit("apiError", response.error);
				return;
			}

			console.log("channels.list response:", response);
			//first get watchLater id
			$scope.watchLaterId = response.items[0].contentDetails.relatedPlaylists.watchLater;
			console.log("watchLaterId", $scope.watchLaterId);
			//second, query playListItems for watch later list
			var options = {
				part:"snippet",
				playlistId:$scope.watchLaterId
			};
			var request = gapi.client.youtube.playlistItems.list(options);
			request.execute(function(response){
				console.log("watchLater playlist response!", response);
				if(response.error != undefined){
					$rootScope.$emit("apiError", response.error);
					return;
				}
				
				$scope.$apply(function(){
					$scope.watchLater = response.items;
				});
				
			});
		});
	};

	//listen for addWatchLater events
	$rootScope.$on("addWatchLater", function(event, video){
		$scope.addWatchLater(video);
	});

	//add a video to watchLater list
	$scope.addWatchLater = function(video) {
		var options = {
			part:"snippet",
			"snippet":{
				playlistId:$scope.watchLaterId,
				resourceId:{
					kind:"youtube#video",
					videoId:video.id.videoId
				}
			}
		};
		var request = gapi.client.youtube.playlistItems.insert(options);
		request.execute(function(response){
			console.log("addWatchLater response:", response);
			if(response.error != undefined){
				$rootScope.$emit("apiError", response.error);
				return;
			}
			//refresh watchLater
			$scope.listWatchLater();
		});

	};

	//remove a video from watch later list
	$scope.removeWatchLater = function(video){
		//
		console.log("removeWatchLater:", video);
		
		var options = {
			id:video.id
		};
		var request = gapi.client.youtube.playlistItems.delete(options);
		request.execute(function(response){
			if(response.error != undefined){
				$rootScope.$emit("apiError", response.error);
				return;
			}
			$scope.listWatchLater();
		})
		
	};

}]);