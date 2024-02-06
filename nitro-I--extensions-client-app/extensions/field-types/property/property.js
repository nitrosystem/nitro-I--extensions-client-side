function PropertyController(field, $scope, moduleController, $element) {
    this.init = () => {
        $('#select-gear').selectize({
            plugins: ['remove_button'],
            sortField: 'text'
        });
    };
}