import template from "./leafletjs-map.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class LeafletjsMapFieldController {
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

const LeafletjsMapComponent = {
  bindings: {
    field: "<",
  },
  controller: LeafletjsMapFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default LeafletjsMapComponent;
