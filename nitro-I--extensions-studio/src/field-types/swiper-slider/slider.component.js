import template from "./slider.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";
import settingsWidget from "./settings.html";

class SwiperSliderFieldController {
  constructor($scope, $timeout, globalService) {
    "ngInject";

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.globalService = globalService;

    this.settingsWidget = settingsWidget;
  }

  $onInit() {
    this.$scope.$on(
      "onBindFieldSettings_" + this.field.FieldName,
      (e, args) => {
        this.field.CustomSettings = sidebarSettingsTemplate;
      }
    );
  }

  onEditSettingsClick() {
    this.workingMode = "edit-settings";
    this.$scope.$emit("onShowRightWidget");
  }

  onSaveSettingsClick() {
    this.disposeWorkingMode();
  }

  onCancelSettingsClick() {
    // this.field.Settings.Columns[
    //   this.field.Settings.Columns.indexOf(this.columnBackup)
    // ] = this.columnBackup;

    this.disposeWorkingMode();
  }

  disposeWorkingMode() {
    this.$scope.$emit("onHideRightWidget");

    this.$timeout(() => {
      delete this.workingMode;
    }, 200);
  }
}

const SwiperSliderFieldComponent = {
  bindings: {
    field: "<",
    actions: "<",
  },
  controller: SwiperSliderFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default SwiperSliderFieldComponent;
