(function () {
    angular.module("app").factory('userSvc', ['$http', function ($http) {
        var f = {};

        f.getUser = function (selected) {
            return $http.post('/api/budget/GetUserByName', selected).then(function (response) {
                return response.data;
            });
        }

        return f;

    }
    ])
})();