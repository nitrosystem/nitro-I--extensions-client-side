function LeafletjsMapController(field, $scope, moduleController, $element) {

    this.init = () => {
        setTimeout(() => {
            createMap(field);
            if (field.Value) {
                field.Lng = field.Value.lng;
                field.Lat = field.Value.lat;
                $scope.$apply();
            }
        }, 1600);
    };

    //let map;
    function createMap(field) {
        L.Map.addInitHook(function() {
            // Generate global variable.
            if (!window.leafletjsMaps || !window.leafletjsMaps.find(x => x.mapId === "map" + field.FieldID)) {
                window.leafletjsMaps = [];
                window.leafletjsMaps.push({ mapId: "map" + field.FieldID, map: this });
            } else {
                window.leafletjsMaps.splice(window.leafletjsMaps.findIndex(x => x.mapId === "map" + field.FieldID), 1);
                window.leafletjsMaps.push({ mapId: "map" + field.FieldID, map: this });
            }
        });

        map = L.map("map" + field.FieldName, {
            //scrollWheelZoom: false,
        });

        var osmLayer = new L.TileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                minZoom: 1,
                maxZoom: 18,
                attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            }
        );

        map.addLayer(osmLayer);

        var defaultLocation = { lat: 51.505, lng: -0.09 };
        if (field.Settings.DefaultLocationLat && field.Settings.DefaultLocationLng)
            defaultLocation = {
                lat: field.Settings.DefaultLocationLat,
                lng: field.Settings.DefaultLocationLng,
            };

        if (!field.Value) field.Value = defaultLocation;

        var position = field.Value || defaultLocation;
        map.setView([position.lat, position.lng], field.Settings.DefaultZoom);

        var marker = L.marker([position.lat, position.lng], {
            draggable: true,
            name: "marker",
        }).addTo(map);

        marker.on("dragend", function(e) {
            var marker = e.target;
            field.Value = marker.getLatLng();
            $scope.$apply();
        });

        map.on("click", function(e) {
            marker.setLatLng(new L.LatLng(e.latlng.lat, e.latlng.lng));

            field.Settings.DefaultLocationLat = e.lat;
            field.Lng = e.latlng.lng.toFixed(12);
            field.Lat = e.latlng.lat.toFixed(12);
            field.Value = e.latlng;

            $scope.$apply();
        });

        if (!!field.Settings.EnableFitBounds && field.Settings.EnableFitBounds) {
            if (!!field.Settings.FitBoundsFromLat && field.Settings.FitBoundsFromLng &&
                field.Settings.FitBoundsToLat && field.Settings.FitBoundsToLng) {
                map.fitBounds([
                    [field.Settings.FitBoundsFromLat, field.Settings.FitBoundsFromLng],
                    [field.Settings.FitBoundsToLat, field.Settings.FitBoundsToLng]
                ]);
            }
        }
    }


    let lat;
    let lng;
    $scope.bLeafletjsMap_onKeyUp = (field, $event, fieldName) => {
        switch (fieldName) {
            case 'Lat':
                lat = $event.target.value;
                break;
            case 'Lng':
                lng = $event.target.value;
                break;
        }

        if (!!+lat && !!+lng) {
            let map = window.leafletjsMaps.find(x => x.mapId === "map" + field.FieldID).map;
            map.eachLayer(function(layer) {
                if (layer.options.name === 'marker') {
                    layer.setLatLng([lat, lng])
                }
            });
        }

    }

    if (!!field.Settings.EnableFitBounds && field.Settings.EnableFitBounds) {
        $scope.$watch('Field.' + field.FieldName + '.Settings.FitBoundsFromLat', function() {
            if (!!field.Settings.FitBoundsFromLat && !!window.leafletjsMaps) {
                let map = window.leafletjsMaps.find(x => x.mapId === "map" + field.FieldID).map;
                map.fitBounds([
                    [field.Settings.FitBoundsFromLat, field.Settings.FitBoundsFromLng],
                    [field.Settings.FitBoundsToLat, field.Settings.FitBoundsToLng]
                ]);
            }
        });
    }

    /*
    var obj = JSON.parse($scope.Field.DropDownList1.Value);
    $scope.Field.LeafletjsMap1.Settings.FitBoundsFromLat=obj.flat
    $scope.Field.LeafletjsMap1.Settings.FitBoundsFromLng=obj.flng
    $scope.Field.LeafletjsMap1.Settings.FitBoundsToLat=obj.tlat
    $scope.Field.LeafletjsMap1.Settings.FitBoundsToLng=obj.tlng
    */

    // $scope.$on('test123', function (e, args) {
    //     console.log($scope);
    // });
    //$scope.$broadcast('test123',{a:123});
}