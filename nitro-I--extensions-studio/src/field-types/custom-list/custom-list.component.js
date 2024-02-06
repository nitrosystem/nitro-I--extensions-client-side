import template from "./custom-list.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";
import listBuilder from "./list-builder.html";
import customTemplate from "./custom-template.html";

class CustomListFieldController {
  constructor($scope, $timeout) {
    "ngInject";

    this.$scope = $scope;
    this.$timeout = $timeout;

    this.listBuilder = listBuilder;
    this.customTemplate = customTemplate;
  }

  $onInit() {
    this.$scope.$on(
      "onBindFieldSettings_" + this.field.FieldName,
      (e, args) => {
        this.field.CustomSettings = sidebarSettingsTemplate;
      }
    );
  }

  onShowListBuilderClick() {
    window["wnListBuilder"].show();
  }

  onShowDataSourceClick() {
    this.$scope.$emit("onShowFieldDataSource", { field: this.field });
  }
}

const CustomListFieldComponent = {
  bindings: {
    field: "<",
  },
  controller: CustomListFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default CustomListFieldComponent;
