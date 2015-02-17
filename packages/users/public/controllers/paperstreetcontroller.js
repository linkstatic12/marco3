'use strict';


angular.module('mean.users')
  .controller('PaperStreetController', ['$scope', '$rootScope',
    function($scope, $rootScope) {
        angular.element(document).ready(function () {
             $('#banner-fade').bjqs({
            width       : 960,
            height      : 805,
            animduration : 1000,
            animtype    :'fade',
            responsive  : true
          });
          $('.bjqs-next a').click();
          $('.bjqs-prev a').click();   
        });
    }]);