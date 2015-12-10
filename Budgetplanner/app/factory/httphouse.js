(function () {
    angular.module("app").factory('HouseSvc', ['$http', function ($http) {
        var f = {};

        f.getHouse = function (selected) {
            return $http.post('/api/budget/GetHouse', selected).then(function (response) {
                return response.data;
            });
        }

        f.deleteHouse = function (updated) {
            return $http.post('/api/budget/DeleteHouse', updated)
        }

        f.getUsers = function (selected) {
            return $http.post('/api/budget/GetUsersInHouse', selected).then(function (response) {
                return response.data;
            })
        }

        f.getAllUsers = function () {
            return $http.post('/api/budget/GetNonInvite').then(function (response) {
                return response.data;
            })
        }

        f.kickUser = function (updated) {
            return $http.post('/api/budget/KickUser', updated)
        }

        f.inviteUser = function (updated) {
            return $http.post('/api/budget/InviteUser', updated)
        }

        f.joinUser = function (updated) {
            return $http.post('/api/budget/JoinUser', updated)
        }

        f.createHouse = function (updated) {
            return $http.post('/api/budget/AddHouse', updated)
        }

        return f;

    }
    ])
})();