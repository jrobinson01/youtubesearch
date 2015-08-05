angular.module("app.directives.videoItem", []).directive("videoItem", function(){
	return {
		restrict:"EA",
		
		scope:{
			video:"="
		},
		
		templateUrl:"src/templates/directives/videoItem.html",
		
		transclude:true,

		controller:function($scope, $rootScope) {
			
			$scope.playVideo = function(video){
				//emit an event
				$rootScope.$emit("playVideo", video);
			};

			//format date
			$scope.getDate = function() {
				var d = new Date(this.video.snippet.publishedAt);
				return d.getMonth()+"/"+d.getDate()+"/"+d.getFullYear();
			}
		}
	};
});