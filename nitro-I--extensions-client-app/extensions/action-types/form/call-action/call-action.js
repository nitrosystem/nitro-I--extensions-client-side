function CallActionActionController(actionService, $scope) {
    this.execute = (action, params, defer) => {
        const moduleController = $scope.moduleController;

        _.filter(moduleController.actions, (a) => {
            return a.ActionID == action.Settings.ActionID;
        }).map((a) => {
            return moduleController.actionService.callClientAction(
                a,
                $scope,
                action.Settings.Params
            );
        });

        return defer.promise;
    }
}