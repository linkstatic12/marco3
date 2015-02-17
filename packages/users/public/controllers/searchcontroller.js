'use strict';


angular.module('mean.users')
  .controller('SearchController', ['$scope', '$rootScope','$http',
    function($scope, $rootScope,$http) {
      console.log("SEARCH CONTROLLER");
      $scope.query="";
      $scope.timetaken;
      $scope.numberofresults=0;
      $scope.searchresults=[];
      $scope.rated=false;
      $scope.rateup = function(searchresult)
      {console.log(searchresult);
        $http.post('/api/rateup',{question:searchresult.Question,answer:searchresult.Answer}).success(function(res){

$scope.rated=true;
searchresult.rating++;
$scope.searchresults=[searchresult];
 



        });
      }
      $scope.search = function()
      {    $scope.rated=false;
           $http.post('/api/searchqanda',{query:$scope.query}).success(function(res){

           if(res.output.results.length!=0)
          { $scope.numberofresults=res.output.results.length;

            $scope.searchresults=res.output.results;
           $scope.timetaken= res.timetaken;
         }
         else
         { $scope.searchresults=[];
        $scope.timetaken="";}

         });
      }


    }]);