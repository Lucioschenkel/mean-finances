(function () {
  angular.module('firstApp').constant('consts', {
    appName: 'Ciclo de Pagamentos',
    apiUrl: 'http://localhost:3003/api',
    oapiUrl: 'http://localhost:3003/oapi',
    year: new Date(),
    owner: 'Lucio Schenkel',
    version: '1.0',
    site: 'https://github.com/Lucioschenkel',
    userKey: '_primeira_app_user',
  }).run([
    '$rootScope',
    'consts',
    function ($rootScope, consts) {
      $rootScope.consts = consts;
    }
  ])
})();