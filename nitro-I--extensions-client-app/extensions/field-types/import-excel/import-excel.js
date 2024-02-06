function ImportExcelController(field, $scope, moduleController) {
    this.init = () => {
        field.Settings.ColumnList = field.Settings.Columns.split(',');
    }

    $scope.bUploadExcel_onUploadExcel = function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
        if ($files.length || $newFiles.length || $duplicateFiles.length || $invalidFiles.length) {
            field.Value = null;

            angular.forEach($files, function (f) {
                uploadExcel(f);
            });
        }
    };

    function uploadExcel(file) {
        var headers = {
            'Content-Type': file.type
        }

        var url = window.bEngineGlobalSettings.apiBaseUrl + 'BusinessEngineBasicServices/API/Service/UploadExcel';

        var params = { files: file,  Columns: field.Settings.Columns };

        moduleController.uploadService.upload({
            url: url,
            headers: headers,
            data: params,
        }).then(function (data) {
            field.Value = data.data;

        }, function (error) {
            console.warn(error.data.Message);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            file.Progress = progressPercentage;
        });
    }
}