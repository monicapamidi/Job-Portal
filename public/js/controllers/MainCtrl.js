angular.module('MainCtrl', []).controller('MainController', function ($scope, $http, $filter, $window, localStorageService, NgTableParams) {
    $scope.user = localStorageService.get("user");
    $scope.dataLoading = false;
    $scope.noJobsFound = false;
    $scope.postJobFlow = false;
    $scope.data = [];
    $scope.jobSearchData = {
        user: $scope.user._id
    };
    $scope.resetSearch = function () {
        $scope.jobSearchData = {};
        setupData([], false);
    };
    $scope.searchJob = function () {
        if (angular.equals({}, $scope.jobSearchData)) {
            alert("Empty search");
            return;
        }

        $scope.dataLoading = true;
        $http({
            url: '/api/search/jobs',
            method: "GET",
            params: $scope.jobSearchData
        }).success(function (response) {
            setupData(response);
            $scope.dataLoading = false;
        }).error(function (errorResponse) {
            alert(errorResponse);
            $scope.dataLoading = false;
        });
    };
    $scope.viewSavedJobs = function () {
        $scope.dataLoading = true;
        $http({
            url: '/api/jobs/saved',
            method: "GET",
            params: {user: $scope.user._id}
        }).success(function (response) {
            setupData(response);
            $scope.dataLoading = false;
        }).error(function (errorResponse) {
            alert(errorResponse);
            $scope.dataLoading = false;
        });
    };

    $scope.viewAppliedJobs = function () {
        $scope.dataLoading = true;
        $http({
            url: '/api/jobs/applied',
            method: "GET",
            params: {user: $scope.user._id}
        }).success(function (response) {
            setupData(response);
            $scope.dataLoading = false;
        }).error(function (errorResponse) {
            alert(errorResponse);
            $scope.dataLoading = false;
        });
    };

    function setupData(response, showError) {
        showError = typeof showError !== 'undefined' ? showError : true;
        if (showError && response.length < 1) {
            $scope.noJobsFound = true;
        } else {
            $scope.noJobsFound = false;
        }

        $scope.data = response;

        //Table configuration
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 100 // count per page
        }, {
            dataset: $scope.data,
            counts: []
        });
    }

    $scope.saveJob = function (job) {
        var data = {
            user: $scope.user,
            job: job
        };

        $http({
            method: 'POST',
            url: '/api/jobs/save',
            data: angular.toJson(data)
        })
            .success(function (response) {
                refreshData(response);
                $scope.dataLoading = false;
            })
            .error(function (errorResponse) {
                $scope.dataLoading = false;
            });
    };

    $scope.applyJob = function (job) {
        var data = {
            user: $scope.user,
            job: job
        };

        $http({
            method: 'POST',
            url: '/api/jobs/apply',
            data: angular.toJson(data)
        })
            .success(function (response) {
                refreshData(response);
                $scope.dataLoading = false;
            })
            .error(function (errorResponse) {
                $scope.dataLoading = false;
            });
    };

    function refreshData(job) {
        $scope.data.forEach(function (existingJob, $index) {
            if (existingJob._id === job._id) {
                $scope.data[$index] = job;
                return;
            }
        });
        $scope.tableParams.reload();
    }


    $scope.viewPostedJobs = function () {
        $scope.postJobFlow = false;
        $http({
            url: '/api/jobs/posted',
            method: "GET",
            params: {user: $scope.user._id}
        }).success(function (response) {
            setupData(response);
            $scope.dataLoading = false;
        }).error(function (errorResponse) {
            alert(errorResponse);
            $scope.dataLoading = false;
        });
    };

    $scope.postJob = function () {
        $scope.resetSearch();
        $scope.postJobFlow = true;
    };

    $scope.jobData = {};
    $scope.post = function () {
        $scope.dataLoading = true;
        var data = {
            user: $scope.user,
            job: $scope.jobData
        };

        $http({
            method: 'POST',
            url: '/api/create/job',
            data: angular.toJson(data)
        })
            .success(function (response) {
                $scope.dataLoading = false;
                $scope.jobData = {};
                $scope.viewPostedJobs();
            })
            .error(function (errorResponse) {
                $scope.dataLoading = false;
                alert(errorResponse);
            });

    };

    $scope.logout = function () {
        localStorageService.clearAll();
        $window.location = '/login'
    }
});