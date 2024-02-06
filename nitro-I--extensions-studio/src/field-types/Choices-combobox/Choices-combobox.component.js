import template from "./choices-combobox.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class ChoicesComboboxFieldController {
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

const ChoicesComboboxFieldComponent = {
  bindings: {
    field: "<",
  },
  controller: ChoicesComboboxFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default ChoicesComboboxFieldComponent;
