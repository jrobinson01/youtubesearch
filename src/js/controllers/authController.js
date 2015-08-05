angular.module("app").controller("authController", ["$rootScope", function($rootScope){
	
	// The client ID is obtained from the {{ Google Cloud Console }}
	// at {{ https://cloud.google.com/console }}.
	// If you run this code from a server other than http://localhost,
	// you need to register your own client ID.
		
	var OAUTH2_CLIENT_ID = '169813148487-v1o1o75glkf4c25f175hq3lca137vmse.apps.googleusercontent.com';
	var OAUTH2_SCOPES = [
	  'https://www.googleapis.com/auth/youtube'
	];

	//JR: use API_KEY for unauthenticated users
	var API_KEY = "AIzaSyCHcEK6PC6a1QsWlEbV2IVjF_6mKE4u7jM";

	//are we authenticated?
	var authenticated = false;

	// Upon loading, the Google APIs JS client automatically invokes this callback.
	// JR: automatically as in, if we tell it to below or supply it as a url param.
	googleApiClientReady = function() {
	  gapi.auth.init(function() {
	  	gapi.client.setApiKey(API_KEY);
	    setTimeout(checkAuth, 1);
	  });
	};
	//gapi expects the callback to be in global scope.
	//tell it load our locally scoped callback instead.
	gapi.load("auth", googleApiClientReady);

	// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
	// If the currently logged-in Google Account has previously authorized
	// the client specified as the OAUTH2_CLIENT_ID, then the authorization
	// succeeds with no user intervention. Otherwise, it fails and the
	// user interface that prompts for authorization needs to display.
	function checkAuth() {
	  gapi.auth.authorize({
	    client_id: OAUTH2_CLIENT_ID,
	    scope: OAUTH2_SCOPES,
	    immediate: true
	  }, handleAuthResult);
	};

	// Handle the result of a gapi.auth.authorize() call.
	function handleAuthResult(authResult) {
	  //JR:load client interfaces regardless of auth status
	  loadAPIClientInterfaces();
	  console.log("authResult:", authResult);
	  if (authResult && !authResult.error) {  
	    // Authorization was successful.
	    //JR: show search and watchLater containers
	    //TODO: this should move out of this controller and be handled by the respective controllers
	    $("#search").show();
	    $("#watchLater").show();
	    $("#login-link").hide();//JR: hide login link. TODO: swap for logout button
	    authenticated = true;
	  } else {
	    //JR: hide watchLater container if unauth'd
	    $("#search").show();
	    $("#watchLater").hide();
	    // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
	    // client flow. The current function is called when that flow completes.
	    $scope.authenticated = false;
	    $('#login-link').click(function(e) {
	      console.log("login-link clicked...");
	      gapi.auth.authorize({
	        client_id: OAUTH2_CLIENT_ID,
	        scope: OAUTH2_SCOPES,
	        immediate: false
	        }, handleAuthResult);
	    });
	    
	  }
	};

	// Load the client interfaces for the YouTube Data APIs, which
	// are required to use the Google APIs JS client. More info is available at
	// http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
	function loadAPIClientInterfaces() {
	  gapi.client.load('youtube', 'v3', function() {
	    //handleAPILoaded();
	    $rootScope.$emit("youtubeReady", authenticated);
	  });
	};
}]);