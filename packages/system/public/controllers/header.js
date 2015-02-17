'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus', '$http', 'MeanSocket',
    function($scope, $rootScope, Global, Menus, $http, MeanSocket) {
        $scope.user;
        $scope.search = false;
        $scope.menus = {};
        $scope.global = Global;
        $rootScope.smallnav = false;
        $scope.superadmin = false;
        $rootScope.$on('profileChanged', function(event) {
             console.log("profileChanged");
            $http.get('/api/users/me').success(function(res) {
                $scope.user = res;
            });
        });
        $rootScope.$on('loggedin', function(event) {
console.log("loggedin");
            $http.get('/api/users/me').success(function(res) {
               //  MeanSocket.emit('adminRequires:makeMySocketAdmin',res);
                $scope.user = res;
                $rootScope.user = res;
                $scope.superadmin = isSuperAdmin();
                if (isAssistant())
                    MeanSocket.emit('authorizeduser:enter', {
                        username: res.username,
                        id: res._id,
                        role: 'adminOrAssistant',
                        profile_pic: res.profile_pic
                    });

                if (isSalesRep())
                    MeanSocket.emit('authorizeduser:enter', {
                        username: res.username,
                        id: res._id,
                        role: 'SalesRep',
                        profile_pic: res.profile_pic
                    });


                $scope.global.authenticated = true;
            });
        });
        var isSalesRep = function() {
            return $scope.user.roles.indexOf('SalesRep') !== -1;

        }
        var isSuperAdmin = function() {

            return $scope.user.roles.indexOf('Admin') !== -1;
        };
        var isAssistant = function() {
            if ($rootScope.user.roles.indexOf('Assistant') !== -1 || $rootScope.user.roles.indexOf('Admin') !== -1)
                return true;
            else
                return false;
        }
        $scope.InitFunction = function() {
         
            $http.get('/api/users/me').success(function(res) {
                // MeanSocket.emit("authorizeduser:enter",res);
                $scope.user = res;
                $rootScope.user = res;
                if (res) {
                   // MeanSocket.emit('adminRequires:makeMySocketAdmin',res);
                    $scope.superadmin = isSuperAdmin();
                    if (isAssistant())
                        MeanSocket.emit('authorizeduser:enter', {
                            username: res.username,
                            id: res._id,
                            role: 'adminOrAssistant',
                            profile_pic: res.profile_pic
                        });

                    if (isSalesRep())
                        MeanSocket.emit('authorizeduser:enter', {
                            username: res.username,
                            id: res._id,
                            role: 'SalesRep',
                            profile_pic: res.profile_pic
                        });


                }
            });


        };
        $scope.activesearch = function() {
            $scope.search = !$scope.search;
        }

    }
]);
