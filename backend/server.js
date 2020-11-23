var express = require('express');
var app = express();

const cors = require('cors');
const fs = require('fs');

const { Pool } = require("pg")
const SphericalMercator = require("@mapbox/sphericalmercator")

var expressStaticGzip = require("express-static-gzip");

var path = require('path');

app.use(cors({credentials: true, origin: 'http://localhost:9000'}));


const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "vector-tiles",
  password: '123456'
})
const mercator = new SphericalMercator()


app.get("/mvt/:x/:y/:z.pbf", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
  console.log(bbox.join(", "))

  const sql = `
  SELECT ST_AsMVT(q, 'buildings', 4096, 'geom')
  FROM (
      SELECT
      cod,
          ST_AsMVTGeom(
              geom,
              TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 3857),
              4096,
              0,
              false
          ) geom
      FROM toponimia_p
      WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 3857)))
  ) q`

  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
  pool.query(sql, values , function(err, mvt) {
          if (err) {
              console.log(err)
              response.status(400)
          } else {
            //console.log(mvt.rows[0].st_asmvt)
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/x-protobuf')
              fs.writeFileSync("foo.pbf", mvt.rows[0].st_asmvt);
              res.send(mvt.rows[0].st_asmvt)
          }
  })
})


app.get("/ruta/:start/:stop/:x/:y/:z.pbf", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
  console.log(bbox.join(", "))

  const sql = `
  SELECT ST_AsMVT(q, 'buildings', 4096, 'geom')
  FROM (
      SELECT
          ST_AsMVTGeom(
              geom,
              TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 3857),
              4096,
              0,
              false
          ) geom
      FROM (
        SELECT st_transform(geom,3857) as geom FROM pgr_dijkstra(
          'SELECT id, source, target, distancia as cost FROM vias_p',
          (select v.id as id
      from 
      vias_p_vertices_pgr v,
      poblacion p 
      where p.nombre='${req.params.start}' and ST_Intersects(v.the_geom,st_buffer(p.geom,5000))
      order by st_distance(v.the_geom,p.geom) limit 1),
        (select v.id as id
      from 
      vias_p_vertices_pgr v,
      poblacion p 
      where p.nombre='${req.params.stop}' and ST_Intersects(v.the_geom,st_buffer(p.geom,5000))
      order by st_distance(v.the_geom,p.geom) limit 1),
        false
      ) p
      LEFT JOIN vias_p AS r ON p.edge = r.id
      ) as sub
      WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 3857)))
  ) q`

  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
  pool.query(sql, values , function(err, mvt) {
          if (err) {
              console.log(err)
              response.status(400)
          } else {
            //console.log(mvt.rows[0].st_asmvt)
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/x-protobuf')
              fs.writeFileSync("foo.pbf", mvt.rows[0].st_asmvt);
              res.send(mvt.rows[0].st_asmvt)
          }
  })
})






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