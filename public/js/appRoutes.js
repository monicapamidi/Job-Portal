angular.module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider

        // home page
            .when('/', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })

            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })

            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterController'
            })

            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
            });

        $locationProvider.html5Mode(true);
    }]);
