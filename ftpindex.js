var Ftp = require("jsftp"), fs = require("fs");

var user = "FILL ME IN";
var pass = "FILL ME IN";
var root = "/domains/brainbaking.com/public_html";

var ftp = new Ftp({
	host: "ftp.brainbaking.com",
	port: 21
});

ftp.auth(user, pass, function(err, res) {
	var images = { files: [] };
	ftp.ls(root + "/cam", function(err, list) {

		images.files = list.filter(function(file) {
			return file.name.indexOf('.jpg') > 0;		
		});

		console.log("writing " + images);
		fs.writeFile("index.json", JSON.stringify(images), function(e) {
			if(e) throw e;

			ftp.put("index.json", root + "/cam/index.json", function(e) {
				if(e) throw e;
				console.log("written index JSON file.");
			});
		});

	});

});
