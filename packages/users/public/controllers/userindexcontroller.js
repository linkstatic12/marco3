'use strict';


angular.module('mean.users')
  .controller('UserIndexController', ['$scope', '$rootScope', '$http', '$location', 'Global','$state','MeanSocket',
    function($scope, $rootScope, $http, $location, Global,$state,MeanSocket) {
    	    console.log("UserIndexController");

    	$scope.dashboard=true;
    	$scope.superAdmin=false;
      $scope.SalesRep=false;
      $scope.superAdminOrAssistant=false;
      $scope.users=false;
    	$scope.jobs=false;
      $scope.displaynav="none";
      $scope.clients=false;
    	$scope.initFunction = function()
    	{ 
   if($rootScope.user)
   {
  
  $scope.superAdmin= $scope.isSuperAdmin();
  $scope.superAdminOrAssistant=$scope.isAssistant();
   $scope.SalesRep=$scope.isSalesRep();
   MeanSocket.emit('adminRequires:makeMySocketAdmin',$rootScope.user);
   }
   else
   	$http.get('/api/users/me').success(function(res){
   
    console.log(res);
    $scope.user=res;
    $rootScope.user=res;
   $scope.superAdmin=$scope.isSuperAdmin();
   $scope.superAdminOrAssistant=$scope.isAssistant();
   $scope.SalesRep=$scope.isSalesRep();
   MeanSocket.emit('adminRequires:makeMySocketAdmin',res);
   // if($scope.SalesRep)
   //  $location.url('RepChat');
   // $location.url('guestchat') ;
  
  });
//$state.go('auth.dashboard');
    	};
      $scope.isSalesRep = function()
      {

          if($rootScope.user.roles.indexOf('SalesRep')!==-1)
        return true;
      else
        return false;
      }
      $scope.isAssistant = function()
      {  
          if($rootScope.user.roles.indexOf('Assistant')!==-1 || $rootScope.user.roles.indexOf('Admin') !== -1)
        return true;
      else
        return false;
      }

    	$scope.isSuperAdmin = function()
    	{

    		return $rootScope.user.roles.indexOf('Admin') !== -1;
    	}
      $scope.activeusers = function()
      {
         $scope.clients=false;
         $scope.jobs=false;
         $scope.dashboard=false;
         $scope.users=!$scope.users;

      }
      $scope.activeclients = function()
      {
        $scope.clients=!$scope.clients;
       $scope.jobs=false;
       $scope.users=false;
        $scope.dashboard=false;
      }
    	$scope.activejobs = function()
    	{
    		$scope.jobs=!$scope.jobs;
    	$scope.clients=false;
    		$scope.dashboard=false;
         $scope.users=false;
    	}

    $scope.activelivechat = function()
    {
      $scope.clients=false;
      $scope.jobs=false;
       $scope.users=false;
       $scope.dashboard=false;
       $scope.livechat=!$scope.livechat;
    }
   	$scope.activedashboard = function ()
   	{

   		$scope.dashboard=!$scope.dashboard;
   		$scope.clients=false;
   		$scope.jobs=false;
       $scope.users=false;
   	}
   

    }]);