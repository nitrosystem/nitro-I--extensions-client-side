function TextBoxController(field, $scope, moduleController, $element) {
    this.init = () => {
        const $textbox = $element.find(`input[type="${field.Settings.InputType}"]`);

        // if (field.Settings.InputMask || field.Settings.InputMaskOptions) $scope.setInputMask();


        if (field.Settings.InputMask) {
            $("#bTextbox" + field.FieldName).inputmask({
                regex: field.Settings.InputMask,
            });
        }

        _.forEach(field.Settings.Attributes, (attr) => {
            $textbox.attr(attr.Name, attr.Value);
        });
    };

    $scope.bTextBox_onKeyPress = (field, $event) => {
        if ($event.which === 13) {
            //if (field.Actions && field.Actions.length)
            //    moduleController.callActionByEvent(
            //        field.Actions,
            //        field.FieldID,
            //        "OnEnterKey"
            //    );

            if (field.Settings.EnterAction)
                moduleController.callActionByActionID(field.Settings.EnterAction);

            if (field.Settings.EnterButtonClick) {
                var buttonField = moduleController.getFieldByID(
                    field.Settings.EnterButtonClick
                );
                if (buttonField) moduleController.$scope.$broadcast('onButtonClick', { field: buttonField });
            }

            if ($event) {
                $event.preventDefault();
                return false;
            }
        }
    };

    $scope.bTextBox_onBlur = (field, $event) => {
        moduleController.validateField(field).then((isValid) => {
            if (field.Actions && field.Actions.length) moduleController.callActionByEvent(field.Actions, field.FieldID, 'OnTextboxBlur');
        });
    };

    //$scope.bTextBox_onFocus = (field, $event) => {
    //    if (field.Actions && field.Actions.length)
    //        this.$scope.actionManagerService.callActionsByEvent(
    //            this.$scope,
    //            "OnTextboxFocus",
    //            field.Actions
    //        );
    //};

    //$scope.bTextBox_onTogglePassword = (field) => {
    //    field.Settings.InputType =
    //        field.Settings.InputType == "password" ? "text" : "password";
    //    field.Settings.StayTogglePassword = true;
    //};

    $scope.setInputMask = () => {
        setTimeout(() => {
            if (field.Settings.InputMask)
                $("#bTextbox" + field.FieldName).inputmask({
                    regex: field.Settings.InputMask,
                });
            if (field.Settings.InputMaskType) {
                var options = this.$scope.service.getJsonString(
                    field.Settings.InputMaskOptions
                );
                $("#bTextbox" + field.FieldName).inputmask(
                    field.Settings.InputMaskType,
                    options
                );
            }
        }, 500);
    };
}