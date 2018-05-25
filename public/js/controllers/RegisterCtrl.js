angular.module('RegisterCtrl', []).controller('RegisterController', function ($scope, $http, $window) {
    $scope.dataLoading = false;
    $scope.user = {};

    $scope.register = function () {
        $scope.dataLoading = true;
        $http({
            method: 'POST',
            url: '/api/register',
            data: angular.toJson($scope.user)
        })
            .success(function (response) {
                $window.location = '/home';
            })
            .error(function (errorResponse) {
                $scope.dataLoading = false;
            });
    }

    $scope.switchLogin = function () {
        $window.location = '/login';
    }
});
