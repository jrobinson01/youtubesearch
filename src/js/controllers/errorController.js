angular.module("app").controller("errorController", ["$scope","$rootScope", function($scope, $rootScope){
	
	$scope.errorMessage = null;
	
	$rootScope.$on("apiError", function(event, error){
		window.scrollTo(0,0);
		console.error("api Error:", error);
		$scope.$apply(function(){
			$scope.errorMessage = "api error: " + error.message;
			setTimeout(function(){
				console.log("clearing error message..");
				$scope.$apply(function(){
					$scope.errorMessage = null;
				});
			}, 5000);
		});
	});

}]);