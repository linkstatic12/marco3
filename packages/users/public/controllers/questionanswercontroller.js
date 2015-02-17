'use strict';


angular.module('mean.users')
  .controller('QuestionAnswerController', ['$scope', '$rootScope','$http',
    function($scope, $rootScope,$http) {
    	$scope.question="";
    	$scope.answer="";

    	$scope.AddQuestionAnswer = function()
    	{
    		$http.post("/api/sendquestionanswer",{question:$scope.question,answer:$scope.answer}).success(function(res){console.log(res);
            $scope.question="";
            $scope.answer="";
    		});
    	}

    }

    ]);