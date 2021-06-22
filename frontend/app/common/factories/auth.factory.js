(function () {
  angular.module('firstApp').factory('auth', [
    '$http',
    'consts',
    AuthFactory
  ]);

  function AuthFactory($http, consts) {

    let user = null;

    function getUser() {
      if (!user) {
        user = JSON.parse(localStorage.getItem(consts.userKey));
      }
      return user;
    }

    function signup(user, callback) {
      console.log(user);
      submit('signup', user, callback);
    }

    function login(user, callback) {
      submit('login', user, callback);
    }

    function submit(url, user, callback) {
      console.log(url)
      $http.post(`${consts.oapiUrl}/${url}`, user)
        .then(resp => {
          localStorage.setItem(consts.userKey, JSON.stringify(resp.data));
          $http.defaults.headers.common.Authorization = resp.data.token;
          if (callback) callback(null, resp.data);
        }).catch((resp) => {
          if (callback) callback(resp.data.errors, null);
        });
    }

    function logout(callback) {
      user = null;
      localStorage.removeItem(consts.userKey);
      $http.defaults.headers.common.Authorization = '';
      if (callback) callback(null);
    }

    function validateToken(token, callback) {
      if (token) {
        $http.post(`${consts.oapiUrl}/validate-token`, { token })
          .then(resp => {
            if (!resp.data.valid) {
              logout();
            } else {
              $http.defaults.headers.common.Authorization = getUser().token;
            }
            if (callback) callback(null, resp.data.valid);
          }).catch((resp) => {
            if (callback) callback(resp.data.errors);
          });
      } else {
        if (callback) callback('Token inválido.');
      }
    }

    return { signup, login, logout, getUser, validateToken };
  }
})();