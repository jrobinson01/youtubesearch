angular.module("app").controller("commentsController", ["$scope", "$rootScope", "$http", function($scope, $rootScope, $http){
	
	$scope.model = {
		results:[],
		showComments:false
	};

	$scope.toggleComments = function(){
		$scope.model.showComments = !$scope.model.showComments;
	};

	$scope.loadComments = function(video){
		/* //JR: interestingly, I get a 403 using the google api client. 
		var options ={
			part:"snippet,replies",
			videoId:(video.id.videoId != undefined) ? video.id.videoId : video.snippet.resourceId.videoId
		}
		var request = gapi.client.youtube.commentThreads.list(options);
		request.execute(function(response){
			console.log("comments response:", response);
			if(response.error != undefined){
				$rootScope.$emit("apiError", response.error);
				return;
			}
			$scope.$apply(function(){
				$scope.model.results = response.items;
			});
		});
		*/
		//JR: use straight $http instead
		$http.get(" https://content.googleapis.com/youtube/v3/commentThreads", {
			params:{
				key:"AIzaSyCHcEK6PC6a1QsWlEbV2IVjF_6mKE4u7jM",
				videoId:(video.id.videoId != undefined) ? video.id.videoId : video.snippet.resourceId.videoId,
				part:"snippet,replies",
				order:"relevance",
				textFormat:"plainText"
			}
		}).success(function(data){
			console.log("got comments data:", data);
			$scope.model.results = data.items;
		}).error(function(){
			console.error("error getting comments:", arguments);
			$rootScope.$emit("apiError");
		});
	};

	//listen for playVideo event
	$rootScope.$on("playVideo", function(event, video){
		console.log("comments got playVideo event");
		$scope.loadComments(video);
	})
}]);