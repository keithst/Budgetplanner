(function () {
    angular.module("app").factory('HouseSvc', ['$http', function ($http) {
        var f = {};

        f.getHouse = function (selected) {
            return $http.post('/api/budget/GetHouse', selected).then(function (response) {
                return response.data;
            });
        }

        return f;

    }
    ])
})();