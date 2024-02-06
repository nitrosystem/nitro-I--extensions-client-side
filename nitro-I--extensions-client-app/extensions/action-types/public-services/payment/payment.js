function PaymentActionController(actionService, $scope) {
    this.execute = (action, params, defer) => {
        defer.resolve();
    }
}