import template from "./chosen-dropdown.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class ChosenDropDownFieldController {
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

const ChosenDropDownFieldComponent = {
  bindings: {
    field: "<",
  },
  controller: ChosenDropDownFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default ChosenDropDownFieldComponent;
