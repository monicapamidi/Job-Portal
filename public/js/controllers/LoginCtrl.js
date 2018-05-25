angular.module('LoginCtrl', []).controller('LoginController', function ($scope, $http, $window, localStorageService) {
    $scope.dataLoading = false;
    $scope.loginData = {};

    $scope.login = function () {
        $scope.dataLoading = true;
        $http({
            method: 'POST',
            url: '/api/login',
            data: angular.toJson($scope.loginData)
        })
            .success(function (response) {
                localStorageService.add("user", response);
                $window.location = '/home';
            })
            .error(function (errorResponse) {
                $scope.dataLoading = false;
            });
    }

    $scope.switchRegister = function () {
        $window.location = '/register';
    }
});
