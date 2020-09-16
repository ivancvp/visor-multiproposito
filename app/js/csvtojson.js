var JSZip = require("jszip");
var zip = new JSZip();
const CSV = require('csv-string');
const servidor = require('./request.js');


export function getZip(archivo) {
    
    var datos_geo=[]
    var newdata=[]

     async function datos() {
        const response = await servidor.getData('http://localhost:9000/datos/'+archivo);

        return zip.loadAsync(response.data)
        .then(function(zip) {
            // you now have every files contained in the loaded zip
          
          return zip.file("manzana.csv").async("string").then(function (data) { 
    
            const parsedCsv = CSV.parse(data);
            datos_geo = parsedCsv;
    
            datos_geo.map((row, i) => {
              var cod=row[0]
              newdata[cod] = {
                 row
              }
            })
              return newdata;
    
          })
          
    
    
        }); 
    }
    return datos();
 
}

