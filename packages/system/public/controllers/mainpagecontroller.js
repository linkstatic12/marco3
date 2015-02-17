'use strict';

angular.module('mean.system').controller('MainPageController', ['$scope', 'Global','$http','MeanSocket','$timeout','$stateParams','$location','$state','$rootScope',
function($scope, Global,$http,MeanSocket,$timeout,$stateParams,$location,$state,$rootScope) {
	
	console.log("MAIN PAGE CONTROLLER");
	$scope.initFunction= function()
	{  

     
	   if(!$stateParams.jobId)
		{

		 $timeout(function(){console.log("CALLING WITHOUT ID"); MeanSocket.emit('guestUser:entering');},100);
			
		}
		 else if($stateParams.jobId=="login")
			 {
		 
			  	MeanSocket.emit("hideTheChatBox");
                $state.go("login");
             }
		if($stateParams.jobId!='login' && $stateParams.jobId)
			//$rootScope.$broadcast('guestUser:enteringWithCLId',$stateParams.jobId);
		 MeanSocket.emit('guestUser:enteringWithCLId',$stateParams.jobId);
		
	
	}
	
}
]);