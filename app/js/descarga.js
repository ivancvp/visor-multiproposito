import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import { servidorGet } from './request'


export const DescargaInfo = () => {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    const { handleSubmit, register, errors } = useForm();

    const onSubmit = values => {
        var archivo=values.nivel
        async function getData() {

            const result = await servidorGet('datos/'+archivo);

        }
        getData();
    };

    return (
        <div>
            <p class="titulo_seccion">Descarga de datos</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="grupo">
                    <label>Nivel</label>
                    <select name="nivel" ref={register({ required: true })}>
                        <option value="">Seleccione...</option>
                        <option value="manzana">Manzana (Urbano)</option>
                        <option value="sector">Séctor (rural)</option>
                    </select>
                    {errors.nivel && <span>Obligatorio!</span>}
                    <label>Datos</label>
                    <select name="layer" ref={register({ required: true })}>
                        <option value="">Seleccione...</option>
                        <option value="dif_catastro_censo">Diferencias Censo - Catastro</option>
                        <option value="mz_uso_viv">Conteo unidades uso de vivienda</option>
                        <option value="mz_uso_mix">Conteo unidades uso mixto</option>
                        <option value="mz_uso_res">Conteo unidades uso No residencial</option>
                    </select>
                    {errors.layer && <span>Obligatorio!</span>}
                    <label>Correo</label>
                    <input type="email" name="correo" ref={register({ required: true })} />
                    {errors.correo && <span>Obligatorio!</span>}
                    <button type="submit" className="btn-large" >Descargar</button>
                </div>
            </form>
        </div>
    );
}
