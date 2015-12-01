(function () {
    angular.module("car-finder").factory('testCarSvc', ['$http', function ($http) {
        var f = {};

        f.getMakes = function (selected) {
            return $http.post('/api/budget/GetTrans', selected).then(function (response) {
                return response.data;
            });
        }

        return f;

    }
    ])
})();