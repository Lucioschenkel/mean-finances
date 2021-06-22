(function () {
  angular.module('firstApp').component('formField', {
    bindings: {
      id: '@',
      label: '@',
      grid: '@',
      placeholder: '@',
      type: '@',
      model: '=',
      readonly: '<',
    },
    controller: [
      'gridSystem',
      function (gridSystem) {
        this.$onInit = () => {
          this.gridClasses = gridSystem.toCssClasses(this.grid);
        }
      }
    ],
    template: `
      <div class="{{ $ctrl.gridClasses }}">
        <div class="form-group">
          <label for="{{ $ctrl.id }}">{{ $ctrl.label }}</label>
          <input type="{{ $ctrl.type }}" ng-readonly="$ctrl.readonly" ng-model="$ctrl.model" id="{{ $ctrl.label }}" class="form-control" placeholder="{{ $ctrl.placeholder }}">
        </div>
      </div>
    `
  })
})();