angular.module('jobPortal', [
    'ngRoute',
    'LocalStorageModule',
    'ngTable',
    'appRoutes',
    'MainCtrl',
    'LoginCtrl',
    'RegisterCtrl'
]).run(function ($rootScope, $location, localStorageService) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var user = localStorageService.get("user");
        if (user === null) {
            if (next.originalPath === '/register') {
                $location.path("/register");
            } else {
                $location.path("/login");
            }

        } else {
            $location.path("/home");
        }
    });
});

