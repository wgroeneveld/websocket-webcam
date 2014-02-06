var gm = require("gm").subClass({ ImageMagick : true });

gm("image.jpg").quality(60).compress().write("compressed.jpg", function(e) {
	if(e) throw e; // Error: spawn ENOENT ? ImageMagick niet op PATH. 
	console.log("done");
});
