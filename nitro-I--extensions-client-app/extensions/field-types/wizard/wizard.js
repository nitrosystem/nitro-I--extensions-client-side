function WizardController(field, $scope, moduleController, $element) {
    this.init = () => {
        if (field.Settings.Steps && field.Settings.Steps.length) field.Settings.CurrentStep = field.Settings.Steps[0].Name;

        field.Step = {};
        for (var i = 0; i < field.Settings.Steps.length; i++) {
            field.Step[field.Settings.Steps[i].Name] = field.Settings.Steps[i];

            $scope.wizardShowHideStep(i);
            $scope.wizardEnableDisableStep(i);
        }
    };

    $scope.wizardShowHideStep = (stepIndex) => {
        field.Settings.Steps[stepIndex].IsShow = moduleController.expressionService.checkConditions(field.Settings.Steps[stepIndex].ShowConditions, $scope);
    };

    $scope.wizardEnableDisableStep = (stepIndex) => {
        field.Settings.Steps[stepIndex].IsEnable = moduleController.expressionService.checkConditions(field.Settings.Steps[stepIndex].EnableConditions, $scope);
    };

    $scope.bWizard_onStepClick = (field, step, $event) => {
        var currentStep = _.find(field.Settings.Steps, (s) => { return s.Name == field.Settings.CurrentStep });
        var currentStepIndex = field.Settings.Steps.indexOf(currentStep);

        if (field.Settings.Steps.indexOf(step) > currentStepIndex && field.Settings.ValidateStepbyStep) {
            const paneName = `WizardStep_${currentStep.Name}`;

            moduleController.validatePane(paneName).then((isValid) => {
                if (isValid && step.IsShow && step.IsEnable) {
                    field.Settings.CurrentStep = step.Name;
                }
            });
        } else if (step.IsShow && step.IsEnable) {
            field.Settings.CurrentStep = step.Name;
        }
    };

    $scope.bWizard_goNextStep = () => {
        const steps = field.Settings.Steps;
        var currentStep = _.find(steps, (s) => { return s.Name == field.Settings.CurrentStep });
        var currentStepIndex = steps.indexOf(currentStep);
        if (currentStepIndex + 1 < steps.length && steps[currentStepIndex + 1].IsShow && steps[currentStepIndex + 1].IsEnable)
            field.Settings.CurrentStep = steps[currentStepIndex + 1].Name;
    };

    $scope.bWizard_goPreviousStep = () => {
        const steps = field.Settings.Steps;
        var currentStep = _.find(steps, (s) => { return s.Name == field.Settings.CurrentStep });
        var currentStepIndex = steps.indexOf(currentStep);
        if (currentStepIndex > 0 && steps[currentStepIndex - 1].IsShow && steps[currentStepIndex - 1].IsEnable)
            field.Settings.CurrentStep = steps[currentStepIndex - 1].Name;
    };

    $scope.$on("bWizard_onValidateMatrix", (e, task, args) => {
        $scope.bWizard_ValidateMatrix(field, task, args)
    });

    $scope.bWizard_ValidateMatrix = function(field) {
        const defer = moduleController.$q.defer();

        const steps = _.filter(field.Settings.Steps, (step) => { return step.IsShow && step.IsEnable });
        const validateSteps = (index) => {
            if (index >= steps.length) return;

            const step = steps[index];
            const paneName = `WizardStep_${step.Name}`;

            moduleController.validatePane(paneName).then((isValid) => {
                if (!isValid) {
                    field.Settings.CurrentStep = step.Name;
                    defer.resolve(false);
                    return;
                } else
                    validateSteps(index + 1);
            });
        }

        validateSteps(0);

        return defer.promise;
    };
}