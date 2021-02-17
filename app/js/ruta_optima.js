import React,{Component} from 'react';


import Select  from "react-select";

import {peticionGet} from './request'
import servidor from './request'
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';

const Ruta=({ruta,map})=> {
    // Declare a new state variable, which we'll call "count"
    const [data, setData] = React.useState(0);
    const[show, setShow]=React.useState(false);

    const[info, setInfo]=React.useState([]);
    const [info1, setInfo1] = React.useState([]);
    
    const[from,setFrom]= React.useState(0);
    const[to,setTo]= React.useState(0);

    
    React.useEffect( () => {

        async function getData() {
            
            const result = await peticionGet('c_pob');
            
            console.log(result)
                           
            setData(result);
            setShow(true);
        }
    
     
        getData();
    

            
            
        },[]);

    
    const cleanCadena=(value)=> {
         return value.normalize('NFD').replace(/[\u00C0-\u00FF]/g, '').toUpperCase();
       }
    
    const options = (inputValue) => {
        var result = data.filter(e => cleanCadena(e.label).includes(cleanCadena(inputValue)));
            
        return result=result.slice(0,10)
    }
    

    const handleInputChange = (inputValue) => {
        if (inputValue.length>2) {
            
            setInfo(options(inputValue));

        } else {
            setInfo([]);
        }
    };
    const handleInputChange1 = (inputValue) => {
        if (inputValue.length>2) {
            
            setInfo1(options(inputValue));

        } else {
            setInfo1([]);
        }
      };

    const change = (e) => {
  
        setFrom(e.value)
        return e;
    }
    const change1 = (e) => {
        setTo(e.value)
        return e;
    }
    const seacrh = () => {
        console.log(from)
        console.log(to)
        

      
        ruta.getSource().setUrl(servidor.getUrl() + 'ruta/' + from + '/' + to + '/' + '{x}/{y}/{z}.pbf'); 
        

        async function getBbox() {
            
            var result = await peticionGet('bbox/'+ from + '/' + to );
            
            result=result[0]


            var ext = boundingExtent([[result.c1, result.c2], [result.c3, result.c4]]);
     
            ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');
          
            map.getView().fit(ext, map.getSize());        
            map.getView().setZoom(map.getView().getZoom()-1);
        }
    
     
        getBbox();




        


    }
    
    return (

        <>
            {show ? <>
            <p>Inicio</p>
                <Select options={info} onChange={(e) => change(e)} onInputChange={handleInputChange}
                    placeholder={'Mínimo 3 letras'}
                    noOptionsMessage={() => 'Sin coincidencias'}
            />
            <p>Destino</p>
                <Select options={info1} onChange={(e) => change1(e)} onInputChange={handleInputChange1}
                    placeholder={'Mínimo 3 letras'}
                    noOptionsMessage={() => 'Sin coincidencias'}
                />
                <button class="btn" id="calcular-ruta" onClick={seacrh}>Obtener ruta</button>
            </>:''}
               
        </>
    );
  }

export default Ruta;