function SetVariableActionController(actionService, $scope) {
    this.execute = (action, params, defer) => {
        defer.resolve();
    }
}