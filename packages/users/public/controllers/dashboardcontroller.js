angular.module('mean.users')
  .controller('DashboardController', ['$scope','$rootScope','$http','MeanSocket',
    function($scope,$rootScope,$http,MeanSocket) {
console.log("DASHBOARD");

   $scope.initFunction = function()
   {

 $http.get('/api/users/me').success(function(res){
    $scope.user=res;
  
    if($scope.user.roles[1]=="superadmin")
       $scope.Usertype="Administrator";
     else
      $scope.Usertype=$scope.user.roles[1];
  });


   }



function showTooltip(x, y, label, data) {
  $('<div id="flot-tooltip">' + '<b>' + label + ': </b><i>' + data + '</i>' + '</div>').css({
    top: y + 5,
    left: x + 20
  }).appendTo("body").fadeIn(200);
};


 



    }

    ]);