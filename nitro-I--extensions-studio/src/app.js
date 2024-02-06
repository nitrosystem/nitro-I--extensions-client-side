import "./app.css";

const app = window["app"];

//  register business engine service components
//database services
import SubmitEntityService from "./services-types/database/submit-entity/submit-entity.component";
import DataSourceService from "./services-types/database/data-source/data-source.component";
import CustomQueryService from "./services-types/database/custom-qeury/custom-query.component";
import BindEntityService from "./services-types/database/bind-entity/bind-entity.component";

//dnn services
import LoginUserService from "./services-types/dnn-services/login-user/login-user.component";
import RegisterUserService from "./services-types/dnn-services/register-user/register-user.component";
import ApproveUserService from "./services-types/dnn-services/approve-user/approve-user.component";
import ResetPasswordService from "./services-types/dnn-services/reset-password/reset-password.component";

//public services
import SendSmsService from "./services-types/public-services/send-sms/send-sms.component";
import SendEmailService from "./services-types/public-services/send-email/send-email.component";
import ImportExcelService from "./services-types/public-services/import-excel/import-excel.component";
import RestFulService from "./services-types/webservice/restful/restful.component";

//  register business engine action components
//database actions
import RunServiceAction from "./action-types/run-service/run-service.component";

//programming actions
import JavascriptAction from "./action-types/programming/javascript.component";

//form actions
import SetVariableAction from "./action-types/form/set-variable.component";
import UpdateFieldDataSource from "./action-types/form/update-field-data-source.component";
import CallAction from "./action-types/form/call-action.component";

//  register business engine field components
import GroupFieldComponent from "./field-types/group/group-studio.component";
import TextboxFieldComponent from "./field-types/textbox/textbox.component";
import TextareaFieldComponent from "./field-types/textarea/textarea.component";
import TextEditorFieldComponent from "./field-types/text-editor/editor.component";
import ContentFieldComponent from "./field-types/content/content.component";
import SwitchButtonComponent from "./field-types/switch-button/switch-button.compoment";
import GridFieldComponent from "./field-types/grid/grid.component";
import MatrixFieldComponent from "./field-types/matrix/matrix.component";
import CustomListFieldComponent from "./field-types/custom-list/custom-list.component";
import WizardFieldComponent from "./field-types/wizard/wizard.component";
import TabsFieldComponent from "./field-types/tabs/tabs.component";
import ButtonFieldComponent from "./field-types/button/button.component";
import CheckboxListFieldComponent from "./field-types/checkbox-list/checkbox-list.component";
import ChosenDropDownFieldComponent from "./field-types/chosen-dropdown/chosen-dropdown.component";
import Select2FieldComponent from "./field-types/select2/select2.component";
import SelectizeFieldComponent from "./field-types/selectize/selectize.component";
import NiceSelectFieldComponent from "./field-types/nice-select/nice-select.component";
import TypeaheadAutocompleteFieldComponent from "./field-types/typeahead-autocomplete/typeahead.component";
import SelectableListFieldComponent from "./field-types/selectable-list/selectable-list.component";
import DashboardMenuFieldComponent from "./field-types/dashboard-menu/dashboard-menu.component";
import DashboardLinkFieldComponent from "./field-types/dashboard-link/dashboard-link.component";
import UploadFileFieldComponent from "./field-types/upload-file/upload-file.component";
import UploadImageFieldComponent from "./field-types/upload-image/upload-image.component";
import PropertyFieldComponent from "./field-types/property/property.component";
import MessageBoxFieldComponent from "./field-types/message-box/message-box.component";
import DashboardBreadcrumbFieldComponent from "./field-types/dashboard-breadcrumb/dashboard-breadcrumb.component";
import PersianDateTimePickerFieldComponent from "./field-types/persian-date-time-picker/persian-date-time-picker.component";
import ChoicesComboboxFieldComponent from "./field-types/Choices-combobox/Choices-combobox.component";
import LeafletjsMapComponent from "./field-types/leafletjs-map/leafletjs-map.compoment";
import SwiperSliderFieldComponent from "./field-types/swiper-slider/slider.component";
import ImportExcelFieldComponent from "./field-types/import-excel/import-excel.component";
import LeafletjsMapRoutingComponent from "./field-types/leafletjs-map-routing/leafletjs-map-routing.compoment";
import ChartFieldComponent from "./field-types/chart/chart.component";

app.component("bServiceCustomQuery", CustomQueryService);
app.component("bServiceSubmitEntity", SubmitEntityService);
app.component("bServiceBindEntity", BindEntityService);
app.component("bServiceDataSource", DataSourceService);
app.component("bServiceSendSms", SendSmsService);
app.component("bServiceSendEmail", SendEmailService);
app.component("bServiceImportExcel", ImportExcelService);
app.component("bLoginUser", LoginUserService);
app.component("bRegisterUser", RegisterUserService);
app.component("bApproveUser", ApproveUserService);
app.component("bResetPassword", ResetPasswordService);
app.component("bServiceRestful", RestFulService);
app.component("bActionRunService", RunServiceAction);
app.component("bActionRunJavascript", JavascriptAction);
app.component("bActionSetVariable", SetVariableAction);
app.component("bActionCallAction", CallAction);
app.component("bActionUpdateFieldDataSource", UpdateFieldDataSource);
app.component("bFieldGroup", GroupFieldComponent);
app.component("bFieldTextbox", TextboxFieldComponent);
app.component("bFieldTextarea", TextareaFieldComponent);
app.component("bFieldTextEditor", TextEditorFieldComponent);
app.component("bFieldContent", ContentFieldComponent);
app.component("bFieldSwitchButton", SwitchButtonComponent);
app.component("bFieldGrid", GridFieldComponent);
app.component("bFieldMatrix", MatrixFieldComponent);
app.component("bFieldCustomList", CustomListFieldComponent);
app.component("bFieldWizard", WizardFieldComponent);
app.component("bFieldTabs", TabsFieldComponent);
app.component("bFieldButton", ButtonFieldComponent);
app.component("bFieldCheckboxList", CheckboxListFieldComponent);
app.component("bFieldChosenDropdown", ChosenDropDownFieldComponent);
app.component("bFieldChoisecCombobox", ChoicesComboboxFieldComponent);
app.component("bFieldSelect2", Select2FieldComponent);
app.component("bFieldSelectize", SelectizeFieldComponent);
app.component("bFieldNiceSelect", NiceSelectFieldComponent);
app.component("bFieldTypeaheadAutocomplete", TypeaheadAutocompleteFieldComponent);
app.component("bFieldSelectableList", SelectableListFieldComponent);
app.component("bFieldDashboardMenu", DashboardMenuFieldComponent);
app.component("bFieldDashboardLink", DashboardLinkFieldComponent);
app.component("bFieldUploadFile", UploadFileFieldComponent);
app.component("bFieldUploadImage", UploadImageFieldComponent);
app.component("bFieldProperty", PropertyFieldComponent);
app.component("bFieldMessageBox", MessageBoxFieldComponent);
app.component("bFieldDashboardBreadcrumb", DashboardBreadcrumbFieldComponent);
app.component("bFieldLeafletjsMap", LeafletjsMapComponent);
app.component("bFieldLeafletjsMapRouting", LeafletjsMapRoutingComponent);
app.component("bFieldSwiperSlider", SwiperSliderFieldComponent);
app.component("bFieldImportExcel", ImportExcelFieldComponent);
app.component(
    "bFieldPersianDateTimePicker",
    PersianDateTimePickerFieldComponent
);
app.component("bFieldChart", ChartFieldComponent);