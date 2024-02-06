import template from "./chart.html";
import sidebarSettingsTemplate from "./sidebar-settings.html";
import editColumnWidget from "./edit-column.html";
import editLabelWidget from "./edit-label.html";

class ChartFieldController {
  constructor($scope, $timeout, globalService) {
    "ngInject";

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.globalService = globalService;
    this.editColumnWidget = editColumnWidget;
    this.editLabelWidget = editLabelWidget;
  }

  $onInit() {
    this.$scope.$on(
      "onBindFieldSettings_" + this.field.FieldName,
      (e, args) => {
        this.field.CustomSettings = sidebarSettingsTemplate;
      }
    );
  }

  onEditFieldDataSourceClick() {
    this.$scope.$emit("onShowFieldDataSource", { field: this.field });
  }

  onAddColumnClick() {
    this.workingMode = "edit-column";
    this.$scope.$emit("onShowRightWidget");

    this.column = { IsNew: true };
    
    
    
    console.log({sss:this.field.Settings.Columns.length,vv:this.column.BorderColor,ss:this.column})
    switch (this.field.Settings.Columns.length) {
      case 0:
        this.column.BorderColor = '#36a2eb';
        this.column.BackgroundColor = '#36a2eb';
        break;
      case 1:
        this.column.BorderColor = '#ff6384';
        this.column.BackgroundColor = '#ff6384';
        break;
      case 2:
        this.column.BorderColor = '#4bc0c0';
        this.column.BackgroundColor = '#4bc0c0';
        break;
      case 3:
        this.column.BorderColor = '#ff9f40';
        this.column.BackgroundColor = '#ff9f40';
        break;
      case 4:
        this.column.BorderColor = '#9966ff';
        this.column.BackgroundColor = '#9966ff';
        break;
      case 5:
        this.column.BorderColor = '#ffcd56';
        this.column.BackgroundColor = '#ffcd56';
        break;
      case 6:
        this.column.BorderColor = '#c9cbcf';
        this.column.BackgroundColor = '#c9cbcf';
        break;
      default:
        this.column.BorderColor = '#36a2eb';
        this.column.BackgroundColor = '#36a2eb';
        break;
    }
  }

  onAddLabelClick() {
    this.workingMode = "edit-label";
    this.$scope.$emit("onShowRightWidget");

    //this.customLables = { IsNew: true };
  }

  onSaveColumnClick() {
    this.field.Settings.Columns = this.field.Settings.Columns || [];

    if (this.column.IsNew) {
      delete this.column.IsNew;
      this.field.Settings.Columns.push(this.column);
    } else {
      this.field.Settings.Columns[
        this.field.Settings.Columns.indexOf(this.columnBackup)
      ] = this.column;
    }

    this.disposeWorkingMode();
  }

  onCancelColumnClick() {
    this.field.Settings.Columns[
      this.field.Settings.Columns.indexOf(this.columnBackup)
    ] = this.columnBackup;

    this.disposeWorkingMode();
  }

  onEditColumnClick(column) {
    this.columnBackup = column;
    this.column = _.clone(column);

    this.workingMode = "edit-column";
    this.$scope.$emit("onShowRightWidget");
  }

  onDeleteColumnClick(column) {
    if (confirm("Are you sure for delete this column!?")) {
      this.field.Settings.Columns.splice(
        this.field.Settings.Columns.indexOf(column),
        1
      );
    }
  }

  onAddCustomLablesClick(){
    this.field.Settings.CustomLables = this.field.Settings.CustomLables || [];
    this.field.Settings.BindLable =this.field.Settings.BindLable || {};
    this.field.Settings.CustomLables.push({});
  }

  onSaveLableClick() {
    debugger
    if (this.field.Settings.LableType == 'BindToProperty') {
      this.field.Settings.BindLable = this.field.Settings.BindLable;
    }
    else {
      this.field.Settings.CustomLables = this.field.Settings.CustomLables || [];

      //if (this.customLables.IsNew) {
      //delete this.customLables.IsNew;
      this.field.Settings.CustomLables = this.field.Settings.CustomLables;
      // } else {
      //   this.field.Settings.CustomLables[
      //     this.field.Settings.CustomLables.indexOf(this.customLablesBackup)
      //   ] = this.customLables;
      // }
    }
    this.disposeWorkingMode();
  }

  onCancelLableClick() {
    this.field.Settings.CustomLables[
      this.field.Settings.CustomLables.indexOf(this.customLablesBackup)
    ] = this.customLablesBackup;

    this.disposeWorkingMode();
  }

  disposeWorkingMode() {
    this.$scope.$emit("onHideRightWidget");

    this.$timeout(() => {
      delete this.workingMode;
    }, 200);
  }
}



const ChartFieldComponent = {
  bindings: {
    field: "<",
  },
  controller: ChartFieldController,
  controllerAs: "$",
  templateUrl: template,
};

export default ChartFieldComponent;
