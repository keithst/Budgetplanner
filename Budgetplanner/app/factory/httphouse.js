(function () {
    angular.module("app").factory('HouseSvc', ['$http', function ($http) {
        var f = {};

        f.getHouse = function (selected) {
            return $http.post('/api/budget/GetHouse', selected).then(function (response) {
                return response.data;
            });
        }

        f.getUsers = function (selected) {
            return $http.post('/api/budget/GetUsersInHouse', selected).then(function (response) {
                return response.data;
            })
        }

        f.getAllUsers = function () {
            return $http.post('/api/budget/GetUser').then(function (response) {
                return response.data;
            })
        }

        f.kickUser = function (updated) {
            return $http.post('/api/budget/KickUser', updated)
        }

        return f;

    }
    ])
})();