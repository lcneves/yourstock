(function() {
    var app = angular.module('stockModule', []);
    app.controller('MainController', ['$scope', function($scope) {
        
        // Websocket test
        var host = location.origin.replace(/^http/, 'ws');
        var ws = new WebSocket(host);
        ws.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if (data.error) {
                if (data.message) { $scope.message = data.message; }
            } else if (data.stocks) {
                console.log("Received");
                $scope.stocksArray = data.stocks;
                $scope.message = '';
            }
            $scope.$apply();
        };
        
        // Function to add new stock to watch list
        $scope.addStock = function(stockInput) {
            $scope.stockInput = '';
            if (stockInput) {
                var stockTrimmed = stockInput.replace(/\W/g, '');
                if (stockTrimmed.length > 1) {
                    ws.send(JSON.stringify({
                        add: true,
                        stock: stockTrimmed.toUpperCase()
                    }));
                }
            }
        };
        
        $scope.removeStock = function(stock) {
            ws.send(JSON.stringify({
                remove: true,
                stock: stock
            }));
        };
        
    }]);
}());