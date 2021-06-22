(function () {
  angular.module('firstApp').controller('DashboardCtrl', [
    '$http',
    'consts',
    DashboardController
  ]);

  function DashboardController($http, consts) {
    const vm = this;

    vm.getSummary = function () {
      const url = `${consts.apiUrl}/billing-summary`;
      $http.get(url).then((response) => {
        const { credit, debt } = response.data;
        vm.credit = credit;
        vm.debt = debt;
        vm.total = credit - debt;
      });
    }

    vm.getSummary();
  }

})();
