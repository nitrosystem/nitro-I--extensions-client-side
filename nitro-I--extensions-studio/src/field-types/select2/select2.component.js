import template from "./select2.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class Select2FieldController {
  constructor($scope, $timeout) {
    "ngInject";

    this.$scope = $scope;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.$scope.$on(
      "onBindFieldSettings_" + this.field.FieldName,
      (e, args) => {
        this.field.CustomSettings = sidebarSettingsTemplate;
      }
    );
  }
}

const Select2FieldComponent = {
  bindings: {
    field: "<",
  },
  controller: Select2FieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default Select2FieldComponent;
