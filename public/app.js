var app = angular.module('nodehack', ['ngRoute','ai','player','record','api']);

app.config(['$routeProvider', '$locationProvider','$httpProvider', function($routeProvider, $locationProvider,$httpProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/Main.html',
    controller:'rockPaperScisors'
  })
  .otherwise({
    templateUrl: 'app/views/404.html'
  });

  $locationProvider.html5Mode(true);

}]);
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]);

  app.run(['$rootScope', 'Auth', function($rootScope, Auth) {
  $rootScope.isLoggedIn = function() {
    return Auth.isLoggedIn.apply(Auth);
  };
}]);


