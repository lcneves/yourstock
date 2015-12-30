var BARCHART_API_KEY = '0ad7bb82e7ddbd05211965fdecfad21b',
    PORT = process.env.PORT || 8080,
    http = require("http"),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ server: server });
    
// Testing requirements
var util = require('util');

// Serve static HTML and JS files from the "public" dir.
app.use(express.static('public'));

// The stocks to follow are in an array.
var stocksArray = ['AAPL', 'QQQ', 'MSFT'];

// Test WS

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var data = JSON.parse(message);
        if (data.add) {
            if (stocksArray.indexOf(data.stock) == -1) {
                stocksArray.push(data.stock);
                wss.broadcast();
            } else {
                sendError('Stock ' + data.stock + ' is already being watched');
            }
        }
        if (data.remove) {
            var index = stocksArray.indexOf(data.stock);
            if (index != -1) {
                stocksArray.splice(index, 1);
            }
            wss.broadcast();
        }
    });
    
    wss.broadcast = function broadcast() {
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify({
                error: false,
                stocks: stocksArray
            }));
        });
    };

    var sendError = function(err) {
        ws.send(JSON.stringify({
            error: true,
            message: err
        }));
    };
    
    var getStockHistory = function(stock) {
        var date = new Date();
        var lastYear = (date.getFullYear() - 1).toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + '000000';
        var options = {
            host: 'marketdata.websol.barchart.com',
            path: '/getHistory.json?key=' + BARCHART_API_KEY + '&symbol=' + stock + '&type=daily&startDate=' + lastYear;
        };

            var req = http.get(options, function(res) {
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                }).on('end', function() {
                    var data = JSON.parse(body);
                    if (data.status.code == 200) {
                        var sendArray = [];
                        data.results.forEach(function(each) {
                            sendArray.push({
                                
                            });
                        });
                    } else {
                        
                    }
                })
            });

            req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
            });
    }
    
    sendStocks();
});

// Start listening to connections
server.listen(PORT, function() { console.log('Listening on ' + server.address().port) });
