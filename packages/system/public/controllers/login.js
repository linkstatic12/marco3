'use strict';

angular.module('mean.system').controller('LoginController', ['$scope', 'Global','$http','$rootScope','$location','$window','$state',
  function($scope, Global,$http,$rootScope,$location,$window,$state) {
    console.log("Login");
 $scope.global = Global;
$scope.fb="";
$scope.linked="";
     $scope.user = {};
     
$scope.facebookauth = function()
{
	$scope.fb="FACEBOOK";
};
$scope.linkedinauth = function ()
{
	$scope.linked="LINKEDIN";


};


      $scope.global.registerForm = false;
      $scope.input = {
        type: 'password',
        placeholder: 'Password',
        confirmPlaceholder: 'Repeat Password',
        iconClass: '',
        tooltipText: 'Show password'
      };

      $scope.togglePasswordVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };

      // Register the login() function
      $scope.login = function() {
      	console.log($scope.fb+" "+$scope.linked);
if($scope.fb=='FACEBOOK')
	{
$window.location.href = 'https://frozen-beach-1452.herokuapp.com/auth/facebook';
		}
else
	if($scope.linked=='LINKEDIN')
	{
	
		$window.location.href = 'https://frozen-beach-1452.herokuapp.com/auth/linkedin';
		}
	else
		{
		 $http.post('/api/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
            // authentication OK
            $scope.loginError = 0;
            console.log(response);
            $rootScope.user = response.user;
             if(response.user.state=='Deactive')
            
              $location.url("/deactiveAccount");
            else{
            $rootScope.$emit('loggedin');
            $rootScope.$emit(response);
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                console.log(response.redirect);
                window.location = response.redirect;
              }
            } else {
            $state.go('auth.dashboard');
              
            }
          }})
          .error(function() {
            $scope.loginerror = 'Authentication failed.';
            $state.go('login');
          });
      }
      };
    


  }
  ]);