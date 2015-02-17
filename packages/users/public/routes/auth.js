'use strict';

//Setting up route
angular.module('mean.users').config(['$meanStateProvider',
  function($meanStateProvider) {
    // Check if the user is not connected
    var checkLoggedOut = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/users/me').success(function(user) {
        // Authenticated
        if (!user) {
          $timeout(deferred.reject);
          $location.url('/');
        }

        // Not Authenticated
        else $timeout(deferred.resolve);
      });

      return deferred.promise;
    };


    // states for my app
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'users/views/index.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      }).
      state('auth.dashboard', {
        url: '/dashboard',
        templateUrl: 'users/views/dashboard.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      }).
      state('auth.addQA', {
        url: '/addQ&A',
        templateUrl: 'users/views/AddQ&A.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      }).
       state('auth.search', {
        url: '/Q&A',
        templateUrl: 'users/views/question_search.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      }).
      state('auth.guestchat',{

        url: '/adminchat',
        templateUrl: 'users/views/admin-side-chat.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      }).
      state('auth.email',{

        url: '/email',
        templateUrl: 'users/views/email.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'users/views/forgot-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }

      }).
      state('theplayers',{
        url: '/theplayers',
        templateUrl: 'users/views/theplayers.html'
      })
      .
      state('butler',{
        url: '/butlerbot',
        templateUrl: 'users/views/butler.html'
      })
      .
      state('paperstreet',{
        url: '/paperstreet',
        templateUrl: 'users/views/paperstreet.html'
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'users/views/reset-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      });
  }
]);
