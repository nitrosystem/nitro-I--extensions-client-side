import template from "./selectable-list.html";
import editTemplatesWidget from "./edit-templates.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";

class SelectableListFieldController {
    constructor($scope, $timeout) {
        "ngInject";

        this.$scope = $scope;
        this.$timeout = $timeout;

        this.editTemplatesWidget = editTemplatesWidget;
    }

    $onInit() {
        debugger
        this.$scope.$on("onBindFieldSettings_" + this.field.FieldName, (e, args) => {
            debugger
            this.field.CustomSettings = sidebarSettingsTemplate;
        });
    }

    onEditTemplatesClick() {
        this.workingMode = "selectable-list-edit-templates";
        this.$scope.$emit("onShowRightWidget");
    }
}

const SelectableListFieldComponent = {
    bindings: {
        field: "<",
    },
    controller: SelectableListFieldController,
    controllerAs: "$",
    templateUrl: template,
};

export default SelectableListFieldComponent;