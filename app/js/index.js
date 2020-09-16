
import '../css/styles.scss';
//openlayers
import './filtros'

import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {transform} from 'ol/proj';
import {Style, Fill, Stroke} from 'ol/style';
import {boundingExtent} from 'ol/extent';
import {transformExtent} from 'ol/proj';
import Overlay from 'ol/Overlay';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Cluster from 'ol/source/Cluster';
import {Circle as CircleStyle, RegularShape, Text,Icon} from 'ol/style';
import {defaults as defaultControls} from 'ol/control.js';

import {get as getProjection} from 'ol/proj';



import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import geometria from '../json/bbox.json'

import Leyenda from './leyenda.js'

import { getZip} from './csvtojson'

import variables from './variables'

import Load from './util'




import {Barras,Dona} from '../modulos/graficos'
import { jsPDF } from "jspdf";



var loading=ReactDOM.render(<Load visible={true} />, document.getElementById('loader'));

ReactDOM.render(<Leyenda  />, document.getElementById('leyenda'));

var donita= [0,0,0];
var barrita = [0,0,0];


barrita[0] = ReactDOM.render(<Barras titulo="Ejemplo de gráfico" series={variables.series} colors={variables.col4.colores} labels={variables.col4.labels}/>, document.getElementById('grafico'));
barrita[1] =   ReactDOM.render(<Barras titulo="Ejemplo de gráfico" series={variables.series} colors={variables.col5.colores} labels={variables.col5.labels}/>, document.getElementById('grafico1'));
barrita[2] =   ReactDOM.render(<Barras titulo="Ejemplo de gráfico" series={variables.series} colors={variables.col6.colores} labels={variables.col6.labels}/>, document.getElementById('grafico2'));

donita[0] = ReactDOM.render(<Dona titulo="Ejemplo de gráfico" series={variables.series} colors={variables.col4.colores} labels={variables.col4.labels} />, document.getElementById('grafico3'));

donita[1]=  ReactDOM.render(<Dona titulo="Ejemplo de gráfico"  series={variables.series} colors={variables.col5.colores} labels={variables.col5.labels}/>, document.getElementById('grafico4'));
donita[2]=  ReactDOM.render(<Dona titulo="Ejemplo de gráfico" series={variables.series} colors={variables.col6.colores} labels={variables.col6.labels}/>, document.getElementById('grafico5'));

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../img/', false, /\.(png|jpg|svg)$/));


  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');
  
  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
  
  var overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  var token="pk.eyJ1IjoiaXZhbjEyMzQ1Njc4IiwiYSI6ImNqc2ZkOTNtMjA0emgzeXQ3N2ppMng4dXAifQ.2k-OLO6Do2AoH5GLOWt-xw" 
var base = new TileLayer({
  source: new XYZ({
    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token='+token,
    crossOrigin: "Anonymous"
  })
});
  const map = new Map({
    target: 'mapa',
    controls: [],
    overlays: [overlay],
    layers: [
      base
    ],
    view: new View({
      center: transform([-74.1083125,4.663437], 'EPSG:4326', 'EPSG:3857'),
      zoom: 15
    })
  });





var key="pk.eyJ1IjoiaXZhbjEyMzQ1Njc4IiwiYSI6ImNqc2ZkOTNtMjA0emgzeXQ3N2ppMng4dXAifQ.2k-OLO6Do2AoH5GLOWt-xw"

  

var resolutions = [];
for (var i = 0; i <= 8; ++i) {
  resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
}
// Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
function tileUrlFunction(tileCoord) {
  return (
    'https://api.mapbox.com/v4/ivan12345678.9t8jbmu0/{z}/{x}/{y}.vector.pbf?sku=101h6wrNEIHUF&access_token=' +
    key
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
}



const mz_source = new VectorTileSource({
  format: new MVT(),
  tileGrid: new TileGrid({
    extent: getProjection('EPSG:3857').getExtent(),
    resolutions: resolutions,
    tileSize: 512,
  }),
  tileUrlFunction: tileUrlFunction,
});






const mz_uso_viv = new VectorTileLayer({
  source: mz_source,
  zIndex:3
});

const mz_uso_mix = new VectorTileLayer({
  source: mz_source,
  zIndex:2
});
const mz_uso_res = new VectorTileLayer({
  source: mz_source,
  zIndex:1
});

map.addLayer(mz_uso_res);
mz_uso_res.set('id', 'mz_uso_res')
map.addLayer(mz_uso_mix);
mz_uso_mix.set('id','mz_uso_mix')
map.addLayer(mz_uso_viv);
mz_uso_viv.set('id','mz_uso_viv')



const mpio_source = new VectorTileSource({
  
  format: new MVT(),
  url: `https://geoportal.dane.gov.co/vector-tiles/capa/V2018_MGN_MPIO_POLITICO/{z}/{x}/{-y}.pbf`,

});

const mpio = new VectorTileLayer({
  source: mpio_source,
});

map.addLayer(mpio);
mpio.set('id', 'mpio')


const depto_source = new VectorTileSource({
  format: new MVT(),
  url: `https://geoportal.dane.gov.co/vector-tiles/capa/V2018_MGN_DPTO_POLITICO/{z}/{x}/{-y}.pbf`,
});

const depto = new VectorTileLayer({
  source: depto_source,
});

map.addLayer(depto);
depto.set('id', 'depto')



const emptyLayerStyle = () => {
  return new Style({
    fill: new Fill({
      color:'rgba(255, 255, 255, 0)'
    })
  });
}

mz_uso_viv.setStyle(function(feature) {
  
  emptyLayerStyle()
  
});
mz_uso_mix.setStyle(function(feature) {
  
  emptyLayerStyle()
  
});
mz_uso_res.setStyle(function(feature) {
  
  emptyLayerStyle()
  
});

  mpio.setStyle(function(feature) {

    return new Style({
      stroke: new Stroke({
        color: '#015592',
        width: 0.5,
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0)'
      })
    });
  });
  depto.setStyle(function(feature) {

    return new Style({
      stroke: new Stroke({
        color: '#349C00',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0)'
      })
    });
  });



  var newdata=[]

  async function getDatos(){
    newdata = await getZip('manzana');
    
    layerStyle();

  }
  getDatos()




  const getColor = (valor,columna) => {

    var array = []
    var colores=[]
    switch (columna){
      case 4:
        array= variables.col4.rangos;
        colores = variables.col4.colores;
        break;
      case 5:
        array = variables.col5.rangos;
        colores = variables.col5.colores;
      break;
      case 6:
        array = variables.col6.rangos;
        colores = variables.col6.colores;
        break;
    }

    var filter = array.map((e,i) => {
      return e < valor?i:false;
    })
  
    return colores[Math.max(...filter)]
    
  }
  

  const iterador = (feature,columna) => {
    const key = feature.get('cod_dane');

    var color="#fff"
    if(typeof newdata[key] !== "undefined")
    {
      //console.log(newdata[key])
      
        color=getColor(parseFloat(newdata[key].row[columna]),columna)
         
    }
    return color;
  }

  const layerStyle = () => {

    mz_uso_viv.setStyle(function(feature) {
  
    var color = iterador(feature,4);
      
      //console.log(feature)
      
      return new Style({
        fill: new Fill({
          color: color
        })
      });
    });
    mz_uso_mix.setStyle(function(feature) {
  
      var color = iterador(feature,5);
        
        return new Style({
          fill: new Fill({
            color: color
          })
        });
      });
      mz_uso_res.setStyle(function(feature) {
  
        var color = iterador(feature,6);
          
          return new Style({
            fill: new Fill({
              color: color
            })
          });
        });
        
    ReactDOM.unmountComponentAtNode(document.getElementById('loader'))
    mz_source.on('tileloadend', function () {
      var extent = map.getView().calculateExtent(map.getSize());
  

      var elementos = mz_source.getFeaturesInExtent(extent);
      
      elementos = getUniqueFeatures(elementos, 'cod_dane');
    
      
      
      const getIndex = (data,col) => {
        var valor=data.row[col]
        return getEstadistica(valor,col)
        
      }
    
      var est1 = [0, 0, 0, 0, 0];
      var est2 = [0, 0, 0, 0, 0];
      var est3 = [0, 0, 0, 0, 0];
    
      if (elementos.length<5000) {
    
      elementos.forEach(function(feature) {
         
        var data = newdata[feature.get("cod_dane")];
        
       
          var i1=getIndex(data,4)
          var i2=getIndex(data,5)
          var i3=getIndex(data,6)
      
          est1[i1] = est1[i1] + 1
          est2[i2] = est2[i2] + 1
          est3[i3] = est3[i3] + 1
       
    
    
        
      });
      }
    
      if (mz_uso_viv.getProperties().visible) {
        barrita[0].setState({ series: [{ data: est1 }] })
        donita[0].setState({ series: est1 })
    
      }
      if (mz_uso_mix.getProperties().visible) {
        barrita[1].setState({ series: [{ data: est2 }] })
        donita[1].setState({ series: est2 })
    
      }
      if (mz_uso_res.getProperties().visible) {
        barrita[2].setState({ series: [{ data: est3 }] })
        donita[2].setState({ series: est3 })
      }




    });
  }




// zoom to municipio 
  const sel_municipio = document.querySelector('#municipio');
  sel_municipio.addEventListener('change', (event) => {

    var value = sel_municipio.value;

    var boundary=geometria[value]

       var ext = boundingExtent([[boundary[0][0],boundary[0][1]],[boundary[1][0],boundary[1][1]]]);
      ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');

    map.getView().fit(ext, map.getSize());
     

    mz_source.on('tileloadend', function () {
      var extent = map.getView().calculateExtent(map.getSize());
  

      var elementos = mz_source.getFeaturesInExtent(extent);
      
      elementos = getUniqueFeatures(elementos, 'cod_dane');
    
      
      
      const getIndex = (data,col) => {
        var valor=data.row[col]
        return getEstadistica(valor,col)
        
      }
    
      var est1 = [0, 0, 0, 0, 0];
      var est2 = [0, 0, 0, 0, 0];
      var est3 = [0, 0, 0, 0, 0];
    
      if (elementos.length<5000) {
    
      elementos.forEach(function(feature) {
         
        var data = newdata[feature.get("cod_dane")];
        
       
          var i1=getIndex(data,4)
          var i2=getIndex(data,5)
          var i3=getIndex(data,6)
      
          est1[i1] = est1[i1] + 1
          est2[i2] = est2[i2] + 1
          est3[i3] = est3[i3] + 1
       
    
    
        
      });
      }
    
      if (mz_uso_viv.getProperties().visible) {
        barrita[0].setState({ series: [{ data: est1 }] })
        donita[0].setState({ series: est1 })
    
      }
      if (mz_uso_mix.getProperties().visible) {
        barrita[1].setState({ series: [{ data: est2 }] })
        donita[1].setState({ series: est2 })
    
      }
      if (mz_uso_res.getProperties().visible) {
        barrita[2].setState({ series: [{ data: est3 }] })
        donita[2].setState({ series: est3 })
      }




    });







});





// Popup al hacer click sobre una capa
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;

  var mensaje = "";
  var id = "";

  var feature=map.forEachFeatureAtPixel(evt.pixel, function(feature,layer) { 
    id = layer.get('id')
    return feature;
    
  }, {
    hitTolerance: 2
  });


  if (id == "mz_uso_viv") {
    var info=newdata[feature.get("cod_dane")].row
    mensaje="<p>Cod DANE: "+info[0]+"</p><p>Conteo: "+info[1]+"</p><p>% : "+info[4]+"</p>"
  }else if (id == "mz_uso_mix") {
    var info=newdata[feature.get("cod_dane")].row
    mensaje="<p>Cod DANE: "+info[0]+"</p><p>Conteo: "+info[2]+"</p><p>% : "+info[5]+"</p>"
  }else if (id == "mz_uso_res") {
    var info=newdata[feature.get("cod_dane")].row
    mensaje="<p>Cod DANE: "+info[0]+"</p><p>Conteo: "+info[3]+"</p><p>% : "+info[6]+"</p>"
  }




  if (mensaje!="") {
    content.innerHTML = '<p>'+mensaje+'</p>';
    overlay.setPosition(coordinate);
  }
  

});



// Generación de la impresión del PDF 
var dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

var exportButton = document.getElementById('export-pdf');

exportButton.addEventListener(
  'click',
  function () {
    exportButton.disabled = true;
    document.body.style.cursor = 'progress';

    var format = document.getElementById('format').value;
    var resolution = document.getElementById('resolution').value;
    var dim = dims[format];
    var width = Math.round((dim[0] * resolution) / 25.4);
    var height = Math.round((dim[1] * resolution) / 25.4);
    var size = map.getSize();
    var viewResolution = map.getView().getResolution();

    map.once('rendercomplete', function () {
      var mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      var mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        function (canvas) {
          if (canvas.width > 0) {
            var opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            var transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            var matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      var pdf = new jsPDF('landscape', undefined, format);
      pdf.addImage(
        mapCanvas.toDataURL('image/jpeg'),
        'JPEG',
        5,
        5,
        dim[0]-10,
        dim[1]-10
      );
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(0,0,0);
      pdf.setTextColor(0,0,0)
      pdf.rect(18, 10, 80, 50, 'FD');
      pdf.text(20, 15, 'Concentraciones espaciales');
      pdf.setFontSize(15);
      pdf.text(20, 22, 'Diferencias CNPV - Catastro');

      pdf.setFillColor(232, 97, 79);

      pdf.rect(20, 30, 5, 5, 'F');
      pdf.setFillColor(79, 111, 232);
      pdf.rect(20, 40, 5, 5, 'F');
      pdf.setFillColor(208, 208, 208);
      pdf.rect(20, 50, 5, 5, 'F');

      pdf.setFontSize(12);
      pdf.text(30, 35, 'Altas diferencias encontradas');
      pdf.text(30, 45, 'Bajas diferencias encontradas');
      pdf.text(30, 55, 'Comportamiento aleatorio');

      pdf.save('map.pdf');
      // Reset original map size
      map.setSize(size);
      map.getView().setResolution(viewResolution);
      exportButton.disabled = false;
      document.body.style.cursor = 'auto';
    });

    // Set print size
    var printSize = [width, height];
    map.setSize(printSize);
    var scaling = Math.min(width / size[0], height / size[1]);
    map.getView().setResolution(viewResolution / scaling);
  },
  false
);



// cambio del mapa base
var radios = document.querySelectorAll('input[type=radio][name=radio]');
radios.forEach(radio => radio.addEventListener('change', () => {
  const mapa = radio.value;
  if (mapa=="gris") {
    base.setSource(
      new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token='+token,
        crossOrigin: "Anonymous"
      })
    ) 
  } else if (mapa == "dark") {
    base.setSource(
      new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token='+token,
        crossOrigin: "Anonymous"
      })
    ) 
  } else {
    base.setSource(
      new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token='+token,
        crossOrigin: "Anonymous"
      })
    ) 
  }

}

))


//visibilidad de las capas de los layer
var check_depto = document.getElementsByClassName('layer');

const myFunction = (e) => {

  var elemento = document.querySelector('.graph[name="'+e.target.name+'"]')
  
  if (e.target.checked) {
    eval(e.target.name).setVisible(true)
    elemento.style.width="280px"
  } else {
    eval(e.target.name).setVisible(false)
    elemento.style.width="0px"
  }
}

for (var i = 0; i < check_depto.length; i++) {
  check_depto[i].addEventListener('change', e=>myFunction(e), false);
}


//cambio de transparencia
var slider = document.getElementsByClassName('slider');

const changeSlider = (e) => {
  const transparencia=e.target.value/10
  eval(e.target.name).setOpacity(transparencia)
}
  for (var i = 0; i < slider.length; i++) {
    slider[i].addEventListener('change', e=>changeSlider(e), false);
}
  


// actualización de las estadisticas


const getEstadistica = (valor,columna) => {

  var array = []

  switch (columna){
    case 4:
      array= variables.col4.rangos;
      break;
    case 5:
      array = variables.col5.rangos;
    break;
    case 6:
      array = variables.col6.rangos;
      break;
  }

  var filter = array.map((e,i) => {
    return e < valor?i:false;
  })

  return Math.max(...filter)
  
}


var grafico=document.getElementById('grupo-graficos')
function onMoveEnd(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  if (evt.map.getView().getZoom() > 14) {
    
  

  var map = evt.map;
  var extent = map.getView().calculateExtent(map.getSize());
  

  var elementos = mz_source.getFeaturesInExtent(extent);
  
  elementos = getUniqueFeatures(elementos, 'cod_dane');

  
  
  const getIndex = (data,col) => {
    var valor=data.row[col]
    return getEstadistica(valor,col)
    
  }

  var est1 = [0, 0, 0, 0, 0];
  var est2 = [0, 0, 0, 0, 0];
  var est3 = [0, 0, 0, 0, 0];

  if (elementos.length<5000) {
    grafico.style.height = "500px";
  elementos.forEach(function(feature) {
     
    var data = newdata[feature.get("cod_dane")];
    
   
      var i1=getIndex(data,4)
      var i2=getIndex(data,5)
      var i3=getIndex(data,6)
  
      est1[i1] = est1[i1] + 1
      est2[i2] = est2[i2] + 1
      est3[i3] = est3[i3] + 1
   


    
  });
  }

  if (mz_uso_viv.getProperties().visible) {
    barrita[0].setState({ series: [{ data: est1 }] })
    donita[0].setState({ series: est1 })

  }
  if (mz_uso_mix.getProperties().visible) {
    barrita[1].setState({ series: [{ data: est2 }] })
    donita[1].setState({ series: est2 })

  }
  if (mz_uso_res.getProperties().visible) {
    barrita[2].setState({ series: [{ data: est3 }] })
    donita[2].setState({ series: est3 })
  }
  } else {
    grafico.style.height = "0px";
  }
  
}

map.on('moveend', onMoveEnd);

function getUniqueFeatures(array, comparatorProperty) {
  var existingFeatureKeys = {};
  var uniqueFeatures = array.filter(function(el) {
    
  if (existingFeatureKeys[el.get(comparatorProperty)]) {
  return false;
  } else {
  existingFeatureKeys[el.get(comparatorProperty)] = true;
  return true;
  }
  });
   
  return uniqueFeatures;
  }



const mq = window.matchMedia("(max-width: 700px)");
  
  if (mq.matches) {
    document.getElementById('ham').checked = false;


    var ham = document.getElementById('ham');
ham.addEventListener('change', e => {
  
  if (ham.checked) {
    document.getElementById('leyenda').style.visibility = "hidden";
  } else {
    document.getElementById('leyenda').style.visibility = "visible";
    
  }

}

, false);


  } else {
    document.getElementById('ham').checked = true;
  }

