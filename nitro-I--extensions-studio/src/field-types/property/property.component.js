import template from "./property.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class PropertyFieldController {
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

const PropertyFieldComponent = {
  bindings: {
    field: "<",
  },
  controller: PropertyFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default PropertyFieldComponent;
