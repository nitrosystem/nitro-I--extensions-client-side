import template from "./import-excel.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class ImportExcelFieldController {
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

const ImportExcelFieldComponent = {
  bindings: {
    field: "<",
    actions: "<",
  },
  controller: ImportExcelFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default ImportExcelFieldComponent;
