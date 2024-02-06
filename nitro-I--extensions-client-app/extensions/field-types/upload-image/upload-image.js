function UploadImageController(field, $scope, moduleController, $element) {
    this.init = () => {
        if (field.Value) {
            const images = field.Value instanceof Array ? field.Value : [field.Value];
            field.Files = angular.copy(images);
        }
    }

    $scope.$watch('Field.' + field.FieldName + '.Value', function(newVal, oldVal) {
        if (newVal != oldVal) {
            if (newVal && typeof newVal == 'string') newVal = moduleController.globalService.getJsonString(newVal);

            const images = newVal instanceof Array ? newVal : (newVal ? [newVal] : []);

            field.Files = angular.copy(images);

            if (field.Files && field.Files.length) _.map(field.Files, (f) => f.Status = 1);
        }
    });

    $scope.onUploadImages = function(field, $files, $invalidFiles) {
        if ((!$files || !$files.length) && (!$invalidFiles || !$invalidFiles.length)) return;

        if (!field.Files || !field.Settings.AllowUploadMultipleFile) {
            field.Files = [];
        }

        var params = {};

        if (field.Settings.ResizeLargeImage) {
            params.ResizeLargeImage = true;
            params.LargeImageWidth = field.Settings.LargeImageWidth;
            params.LargeImageHeight = field.Settings.LargeImageHeight;
        }

        if (field.Settings.Thumbnails && field.Settings.Thumbnails.length) {
            params.CreateThumbnail1 = true;
            params.Thumbnail1Name = field.Settings.Thumbnails[0].Name;
            params.Thumbnail1Width = field.Settings.Thumbnails[0].Width;
            params.Thumbnail1Height = field.Settings.Thumbnails[0].Height;
        }

        if (field.Settings.Thumbnails && field.Settings.Thumbnails.length > 1) {
            params.CreateThumbnail2 = true;
            params.Thumbnail2Name = field.Settings.Thumbnails[1].Name;
            params.Thumbnail2Width = field.Settings.Thumbnails[1].Width;
            params.Thumbnail2Height = field.Settings.Thumbnails[1].Height;
        }

        uploadFiles(field, $files, $invalidFiles, params, field.Settings.MaxFileCount).then(function(data) {
            if (data && data.length) {
                setValue(field, data);
            }
        });
    };

    $scope.onDeleteImageClick = function(field, $index, $event) {
        field.Files.splice($index, 1);

        setValue(field, field.Files);

        if ($event) $event.stopPropagation();
    };

    $scope.onSetMainImageClick = function(field, file) {
        if (file.Status != 1) return;

        angular.forEach(field.Files, function(f) {
            f.IsMain = false;
        });

        file.IsMain = true;

        setValue(field, field.Files);
    };

    $scope.onTryAgainUploadImageClick = function(field, file, $event) {
        if (field.Value.length < field.Settings.MaxFileCount) {
            file.Status = 0;
            $scope.onUploadImages(fieldID);
        }

        if ($event) $event.stopPropagation();
    };

    function uploadFiles(field, $files, $invalidFiles, params, maxFiles) {
        var defer = moduleController.$q.defer();

        field.Files = field.Files || [];

        angular.forEach($invalidFiles, function(f) {
            var file = {
                File: f,
                FileName: f.name,
                FileType: f.type,
                FileSize: f.size,
                Status: -1,
                Message: f.$error,
            }

            field.Files.push(file);

            moduleController.globalService.previewImage(f).then(function(data) {
                file.PreviewImage = data;
            });
        });

        angular.forEach($files, function(f) {
            var file = {
                File: f,
                FileName: f.name,
                FileType: f.type,
                FileSize: f.size,
                Status: 0,
            }

            field.Files.push(file);

            if (_.filter(field.Files, function(ff) { return ff.Status != -1 }).length > maxFiles) {
                file.Status = -1;
                file.Message = 'maxFiles';
            }

            moduleController.globalService.previewImage(f).then(function(data) {
                file.PreviewImage = data;
            });
        });

        processUploads(field.Files, params).then(function(data) {
            defer.resolve(field.Files);
        });

        return defer.promise
    }

    function processUploads(files, params) {
        var defer = moduleController.$q.defer();

        var result = _.filter(files, function(f) { return f.Status == 0 });
        var file = result.length ? result[0] : undefined;

        return processUpload(file, params).then(function(data) {
            if (data.isFinal)
                defer.resolve();
            else
                return processUploads(files, params);
        })

        return defer.promise
    }

    function processUpload(file, params) {
        var defer = moduleController.$q.defer();

        if (!file) {
            defer.resolve({ isFinal: true });
        } else {
            params.files = file.File;

            var headers = {
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarypGHmYNJKTbq3AL6Y',
                Moduleid: 397,
                Tabid: 72,
                Requestverificationtoken: 'bsQNNyL_1TW02G0f2z-08SqXD36YLLmbUVbF6NSZrHmVRrHF4-zx8gP586SSuLtUgjTurpKxTnZAjtRq0'
            }

            var url = window.bEngineGlobalSettings.apiBaseUrl + 'BusinessEngine/API/Common/UploadPhoto';
            if (field.Settings.UploadBy == 'dnn') {
                var data = new FormData();
                data.append('file', file.File);
                moduleController.apiService.$http({
                    method: "POST",
                    url: '/API/InternalServices/FileUpload/UploadFromLocal',
                    headers: headers,
                    data: data,
                }).then((data) => {
                    debugger
                }, (error) => {
                    console.log(error);
                });
            }
            if (field.Settings.UploadBy == 'jquery') {
                var data = new FormData();
                data.append('file', file.File);
                $.ajax({
                    url: url,
                    processData: false,
                    contentType: false,
                    data: data,
                    type: 'POST'
                }).done(function(result) {
                    file.Status = 1;
                    file.Data = result;

                    field.Value = result;

                    if (!$scope.$$phase) $scope.$apply();

                    defer.resolve({ isFinal: true });
                }).fail(function(a, b, c) {
                    console.log(a, b, c);
                });
            } else
                moduleController.uploadService.upload({
                    url: url,
                    headers: headers,
                    data: params,
                }).then(function(data) {
                    file.Status = 1;

                    file.Data = data.data;

                    defer.resolve({ isFinal: false });
                }, function(error) {
                    file.Status = -1;

                    file.Message = error.data.Message;

                    defer.resolve({ isFinal: false });
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    file.Progress = progressPercentage;
                });
        }

        return defer.promise
    }

    function setValue(field, data) {
        var files = [];
        angular.forEach(data, function(f) {
            var file = {};
            file.Status = f.Status;
            file.PreviewImage = f.PreviewImage;
            file.Message = f.Message;
            file.File = f.File;

            if (f.Status == 1) {
                if (f.Data) {
                    file.FilePath = f.Data.FilePath;
                    file.Thumbnails = f.Data.Thumbnails;
                } else {
                    file.FilePath = f.FilePath;
                    file.Thumbnails = f.Thumbnails;
                    if (f.IsMain) file.IsMain = f.IsMain;
                }
            }

            files.push(file);
        });

        if (files.length && !$.grep(files, function(f) { return f.Status == 1 && f.IsMain }).length) {
            var filesUploaded = $.grep(files, function(f) { return f.Status == 1 });
            if (filesUploaded.length) filesUploaded[0].IsMain = true;
        }

        field.Files = files;
        field.Value = $.grep(field.Files, function(f) { return f.Status == 1 }).map(function(f) {
            var obj = {
                FileName: f.FileName,
                FilePath: f.FilePath,
                IsMain: f.IsMain,
                Thumbnails: f.Thumbnails
            }

            return obj;
        });

        if (!field.Value.length) field.Value = null;
    }
}