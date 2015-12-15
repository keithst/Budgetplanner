'use strict';
angular.module('app')
.factory('authSvc', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _saveRegistration = function (registration) {

        _logout();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };


    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.Username + "&password=" + loginData.Password;

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.token = response.access_token;
            _authentication.roles = response.roles;
            _authentication.refreshToken = response.refresh_token

            localStorageService.set('authorizationData', _authentication);

            deferred.resolve(response);

        }, function (response) {
            _logout();
            deferred.reject(response.data);
        });

        return deferred.promise;

    };

    var _logout = function () {

        localStorageService.remove('authorizationData');
        localStorageService.remove('home')

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.token = "";
        _authentication.roles = [];
        _authentication.refreshToken = "";

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.token = authData.token;
            _authentication.roles = authData.roles;
            _authentication.refreshToken = authData.refreshToken;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken;

            localStorageService.remove('authorizationData');

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                localStorageService.set('authorizationData', {
                    token: response.access_token, userName: response.userName, refreshToken: response.refresh_token,
                    roles: response.roles
                });


                deferred.resolve(response);

            }).error(function (err, status) {
                _logout();
                deferred.reject(err);
            });
        }

        return deferred.promise;
    };

    authServiceFactory.register = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logout = _logout;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refresh = _refreshToken;

    return authServiceFactory;
}]);