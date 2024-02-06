import template from "./tabs.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";
import editTabWidget from "./edit-tab.html";

class TabsFieldController {
    constructor($scope, $timeout, $q) {
        "ngInject";

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$q = $q;

        this.editTabWidget = editTabWidget;

        $scope.$on("onGetTabsFieldPanes", (e, task, args) => {
            this.getTabsPanes.apply(this, [task, args]);
        });
    }

    $onInit() {
        this.$scope.$on(
            "onBindFieldSettings_" + this.field.FieldName,
            (e, args) => {
                this.field.CustomSettings = sidebarSettingsTemplate;
            }
        );
    }

    onAddTabClick() {
        this.workingMode = "edit-tab";
        this.$scope.$emit("onShowRightWidget");

        this.tab = { IsNew: true };
    }

    onEditTabClick(tab) {
        this.tabBackup = tab;
        this.tab = _.clone(tab);

        this.workingMode = "edit-tab";
        this.$scope.$emit("onShowRightWidget");
    }

    onSaveTabClick() {
        this.field.Settings.Tabs = this.field.Settings.Tabs || [];

        if (this.tab.IsNew) {
            delete this.tab.IsNew;
            this.field.Settings.Tabs.push(this.tab);
        } else {
            this.field.Settings.Tabs[
                this.field.Settings.Tabs.indexOf(this.tabBackup)
            ] = this.tab;
        }

        this.disposeWorkingMode();
    }

    onCancelTabClick() {
        this.field.Settings.Tabs[this.field.Settings.Tabs.indexOf(this.tabBackup)] =
            this.tabBackup;

        this.disposeWorkingMode();
    }

    disposeWorkingMode() {
        this.$scope.$emit("onHideRightWidget");

        this.$timeout(() => {
            delete this.workingMode;
        }, 200);
    }

    getTabsPanes(task, args) {
        task.wait(() => {
            const defer = this.$q.defer();

            var panes = [];
            var index = 0;
            const field = args.field;
            const attrs = args.attrs;

            _.forEach(field.Settings.Tabs, (tab) => {
                const pane = `<div data-pane="TabsTab_${tab.Name}" data-pane-title="${
          tab.Name
        } Pane" 
            data-parent-id="${
              field.FieldID
            }" ng-show="[FIELD].Settings.CurrentTab=='${tab.Name}'" 
            class="${
              tab.PaneCssClass
            }" ng-class="{'active':[FIELD].Settings.CurrentTab=='${
          tab.Name
        }','disabled':![FIELD].Tab['${tab.Name}'].IsEnable}"
            id="bTab${field.FieldName}${index++}" ${attrs ? attrs : ""}></div>`;

                panes.push(pane);
            });

            defer.resolve({ type: 0, html: panes.join(" ") });

            return defer.promise;
        });
    }
}

const TabsFieldComponent = {
    bindings: {
        field: "<",
    },
    controller: TabsFieldController,
    controllerAs: "$",
    templateUrl: template,
};

export default TabsFieldComponent;