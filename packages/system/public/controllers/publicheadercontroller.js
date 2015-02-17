'use strict';

angular.module('mean.system').controller('PublicHeaderController', ['$scope', '$rootScope', 'Global', 'MeanSocket',
  function($scope, $rootScope, Global, MeanSocket) {
    $scope.dontshowHeader=false;
    $scope.headertitle= "Marco Spijkerman";
    $scope.headertitlelink= "http://localhost:3000";
    $scope.global = Global;
    MeanSocket.on('HideTheChat',function(){
      $scope.dontshowHeader=true;
    });

  $scope.openchatbox= function()
  {
      $rootScope.$emit('openchatbox'); 
  }

}
]);
