(function () {
    angular.module("app").factory('TransSvc', ['$http', function ($http) {
        var f = {};

        f.getTrans = function (selected) {
            return $http.post('/api/budget/GetTransFromType', selected).then(function (response) {
                return response.data;
            });
        }

        f.getTypes = function () {
            return $http.get('/api/budget/GetTransType').then(function (response) {
                return response.data;
            });
        }

        return f;

    }
    ])
})();