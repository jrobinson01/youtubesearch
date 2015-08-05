angular.module("app").controller("watchLaterController", ["$scope","$rootScope", function($scope, $rootScope){
	
	
	$scope.watchLater = [];
	$scope.watchLaterId = null;
	
	//if we're authenticated, start loading watchLater list.
	$rootScope.$on("youtubeReady", function(event, authenticated){
		//skip if not authenticated
		if(!authenticated){
			return;
		}

		$scope.listFavorites();
	});

	$scope.listFavorites = function() {
		var options = {
			part:"snippet,contentDetails",
			mine:true
		};
		
		var request = gapi.client.youtube.channels.list(options);
		
		request.execute(function(response){
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
				$scope.watchLater = response.items;
				$scope.$digest();//force a dom update
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
			//refresh favorites
			$scope.listFavorites();
		});

	};

	//remove a video from watch later list
	$scope.removeWatchLater = function(video){
		//
		var options = {
			part:"snippet",
			playlistId:$scope.watchLaterId,
			resourceId:{
				kind:"youtube#video",
				videoId:video.id.videoId//must be playlistItem_id not videoId
			}
		};
		var request = gapi.client.youtube.playlistItems.delete(options);
		request.execute(function(response){
			
		})
		
	};

}]);