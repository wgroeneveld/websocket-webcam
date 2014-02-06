// npm install ws en jsftp
var sys = require("sys"),
	fs = require("fs"),
	Ftp = require("jsftp"),
	WebSocketServer = require('ws').Server;

function hour() { return new Date().getHours(); };

var wss = new WebSocketServer({port: 8080});
var clients = [];
var snapshotHour = -1;	// start auto-capping the history feed. 
var imageName = "image.jpg";

function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    return new Buffer(base64, 'base64'); // atob(base64) in window scope
}

function reuploadImage() {
	var user = "FILL ME IN";
	var pass = "FILL ME IN";
	var rootPath = "/domains/brainbaking.com/public_html/cam/";

	var ftp = new Ftp({
		host: "ftp.brainbaking.com",
		port: 21
	});

	ftp.auth(user, pass, function(err, res) {
		function uploadImageTo(path, callback) {
			ftp.put(imageName, path, function(err, data) {
				if(err) {
					sys.debug("ERROR while uploading");
					sys.debug(err);
				} else {
					sys.debug("file uploaded to " + path + " - callback firing...");
					callback(data);
				}
			});
		}

		function uploadSnapshotIndexFile() {
			var images = { files: [] };
			ftp.ls(rootPath, function(err, list) {

				images.files = list.filter(function(file) {
					return file.name.indexOf('.jpg') > 0 && file.name.indexOf('_') > 0;		
				});

				fs.writeFile("index.json", JSON.stringify(images), function(e) {
					if(e) throw e;

					ftp.put("index.json", rootPath + "index.json", function(e) {
						if(e) throw e;
						sys.debug("written index JSON file.");
					});
				});

			});
		}

		function createHistorySnapshotIfNeeded() {
			if(hour() !== snapshotHour) {
				sys.debug("Hourly snapshot needs refreshment, creating...");
				snapshotHour = hour();
				uploadImageTo(rootPath + new Date().getTime() + "_" + imageName, uploadSnapshotIndexFile);
			}

		}

		uploadImageTo(rootPath + imageName, createHistorySnapshotIfNeeded);
	});
}
  
wss.on('connection', function(ws) {
	sys.debug("connected client");
	clients.push(ws);
    ws.on('message', function(message) {
        sys.debug('received data - broadcasting back to client...');
		fs.writeFile(imageName, convertDataURIToBinary(message), function(e) {
			if(e) {
				sys.debug(e);
			} else {
				sys.debug("file written, starting upload...");
				reuploadImage();
			}
		});
		
		clients.forEach(function(client) {
			try {
				client.send(message);
			} catch(notOpenEx) {
				// should I remove the client? Can I do a check instead of try/catch?
				sys.debug("client not connected anymore, ignoring exception");
			}
		});
    });
});

sys.debug("Listening on port 8080");
