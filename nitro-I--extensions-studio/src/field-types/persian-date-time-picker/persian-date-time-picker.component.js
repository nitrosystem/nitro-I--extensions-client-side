import template from "./persian-date-time-picker.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class PersianDateTimePickerFieldController {
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

const PersianDateTimePickerFieldComponent = {
  bindings: {
    field: "<",
  },
  controller: PersianDateTimePickerFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default PersianDateTimePickerFieldComponent;
