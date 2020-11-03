import React,{Component} from 'react';


import variables from './variables'

const Leyenda=()=> {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = React.useState(0);
  
    return (
      <div>
        <p id="titulo">Leyenda</p>
            <div id="razon_unidades_seccion" >
              <p className="descripcion">{variables.razon_unidades.titulo}  </p>
              <div>
                  {variables.razon_unidades.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.razon_unidades.colores[e]}}></span><p>{i}</p></div>)}
              </div>
            </div>
            <div id="dif_catastro_censo" className="hidden">
              <p className="descripcion">{variables.hot_spot.titulo}  </p>
              <div>
                  {variables.hot_spot.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.hot_spot.colores[e]}}></span><p>{i}</p></div>)}
              </div>
            </div>
            <div id="mz_uso_viv" className="hidden">
              <p className="descripcion">{variables.col4.titulo}  </p>
              <div>
                  {variables.col4.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.col4.colores[e]}}></span><p>{i}</p></div>)}
              </div>
            </div>
            <div id="mz_uso_mix" className="hidden">
              <p className="descripcion">
                  {variables.col5.titulo}  
              </p>
              <div>
              {variables.col5.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.col5.colores[e]}}></span><p>{i}</p></div>)}
              </div>
            </div>
            <div id="mz_uso_res" className="hidden">
            	<p className="descripcion">
            	    {variables.col6.titulo}  
            	</p>
            	<div>
            	{variables.col6.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.col6.colores[e]}}></span><p>{i}</p></div>)}
            	</div>
            </div>
      </div>
    );
  }

export default Leyenda;
