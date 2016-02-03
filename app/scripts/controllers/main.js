'use strict';

angular.module('imageEditorApp')
    .controller('MainCtrl', function ($scope) {

        $scope.setImageFile = function (element) {
            $scope.init();
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.image.src = e.target.result;
            };
            reader.readAsDataURL(element.files[0]);
            $scope.image.onload = $scope.resetImage;
        };
        $scope.init = function () {
            $scope.brightness = 0;
            $scope.contrast = 1;
            $scope.strength = 1;
            $scope.color = {
                red: 255,
                green: 189,
                blue: 0
            };
            $scope.autocontrast = false;
            $scope.vignette = false;
            $scope.canvas = angular.element('#myCanvas')[0];
            $scope.ctx = $scope.canvas.getContext('2d');

            //            $scope.numberPixels = $sc
            $scope.image = new Image();
            $scope.vignImage = new Image();


        };

        $scope.init();

        $scope.resetImage = function () {
            $scope.canvas.height = $scope.image.height;
            $scope.canvas.width = $scope.image.width;
            $scope.ctx.drawImage($scope.image, 0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.imageData = $scope.ctx.getImageData(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.pixels = $scope.imageData.data;
            $scope.numPixels = $scope.imageData.width * $scope.imageData.height;
            if ($scope.vignImage.src === '') {
                $scope.vignImage.src = '/images/vignette.jpg';
                
                
            }
        };

        $scope.applyFilter = function () {
            $scope.resetImage();
            setBrightness();
            setContrast();
            tint();
            if ($scope.vignette) {
                setVign();
            }
            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.ctx.putImageData($scope.imageData, 0, 0);

        };

        var setBrightness = function () {
            var value = parseInt($scope.brightness);
            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] += value;
                $scope.pixels[i * 4 + 1] += value;
                $scope.pixels[i * 4 + 2] += value;
            }
        };

        var setContrast = function () {
            var contrastFloat = parseFloat($scope.contrast);
            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = ($scope.pixels[i * 4] - 128) * contrastFloat + 128;
                $scope.pixels[i * 4 + 1] = ($scope.pixels[i * 4 + 1] - 128) * contrastFloat + 128;
                $scope.pixels[i * 4 + 2] = ($scope.pixels[i * 4 + 2] - 128) * contrastFloat + 128;
            }
        };

        var tint = function () {
            var red = parseInt($scope.color.red);
            var green = parseInt($scope.color.green);
            var blue = parseInt($scope.color.blue);
            var strengthInt = parseInt($scope.strength);
            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] += $scope.color.red * strengthInt / 100
                $scope.pixels[i * 4 + 1] += $scope.color.green * strengthInt / 100
                $scope.pixels[i * 4 + 2] += $scope.color.blue * strengthInt / 100
            }
        };

        var resetVign = function () {
            var cn = document.createElement('canvas');
            cn.width = $scope.image.width;
            cn.height = $scope.image.height;
            var ctx = cn.getContext('2d');
            ctx.drawImage($scope.vignImage, 0, 0, $scope.vignImage.width, $scope.vignImage.height, 0, 0, cn.width, cn.height);
            $scope.vignData = ctx.getImageData(0, 0, cn.width, cn.height);
            $scope.vignPixels = $scope.vignData.data;
        };

        var setVign = function () {
            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] *= $scope.vignPixels[i * 4] / 255;
                $scope.pixels[i * 4 + 1] *= $scope.vignPixels[i * 4 + 1] / 255;
                $scope.pixels[i * 4 + 2] *= $scope.vignPixels[i * 4 + 2] / 255;
            }
        };
    
        $scope.saveImage = function()  {
            $scope.url = $scope.canvas.toDataURL('image/png');
        };


    })
        .config(function ($compileProvider){
           $compileProvider.aHrefSanitizationWhitelist(/^\s*(http?|ftp|mailto|coui|data):/); 
        });