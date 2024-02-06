import template from "./leafletjs-map-routing.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class LeafletjsMapRoutingFieldController {
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
        if (this.field.Settings.ToolTipFromText === undefined) {
          this.field.Settings.ToolTipFromText = "آیا از انتخاب مبدا اطمینان دارید؟"
        }

        if (this.field.Settings.ToolTipToText === undefined) {
          this.field.Settings.ToolTipToText = "آیا از انتخاب مقصد اطمینان دارید؟"
        }

        if (this.field.Settings.ToolTipClearText === undefined) {
          this.field.Settings.ToolTipClearText = "آیا از حذف مسیر اطمینان دارید؟"
        }

        if (this.field.Settings.ToolTipOKText === undefined) {
          this.field.Settings.ToolTipOKText = "بله"
        }

      }
    );
  }
}

const LeafletjsMapRoutingComponent = {
  bindings: {
    field: "<",
  },
  controller: LeafletjsMapRoutingFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default LeafletjsMapRoutingComponent;
