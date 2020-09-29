var express = require('express');
var app = express();

const cors = require('cors');
const fs = require('fs');

var expressStaticGzip = require("express-static-gzip");

var path = require('path');

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


app.get('/datos/:archivo', function (req, res) {
  
  var archivo = req.params.archivo;
  
    const file = `${__dirname}/datos/`+archivo+`.zip`;

    res.writeHead(200, {
        'Content-Type': 'application/zip'
    });

    var readStream = fs.createReadStream(file);
    readStream.pipe(res);


});


var DIST_DIR = path.join(__dirname, "../dist/");

app.use("/",expressStaticGzip(DIST_DIR));





app.get('/:layer/:x/:y/:z.pbf', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');

  const z = req.params.z;
  const x = req.params.x;
  const y = req.params.y;
  const layer = req.params.layer;
  
  var file = __dirname + '/'+layer+'/' + z + '/' + x + '/' + y + '.gz';
  console.log(file)
  
  if (fs.existsSync(file)) {
      var fileDos = fs.readFileSync(file);

      res.writeHead(200, {'Content-Type': 'application/x-protobuf', 'Content-Encoding': 'gzip'});

      res.end(fileDos);

  } else {
      res.sendStatus(400)
  }

});




app.listen(3000, function () {
  console.log('Example app listening on port 9000!');
});