const axios = require('axios');


const destino = "https://nowsoft.app/visor-multiproposito/";

//const destino = "http://localhost:3000/";


function servidorPost(uri,datos){

    return axios({
        method: 'post',
        url: destino+uri,
        data: datos,
        withCredentials: false
        })

}

function servidorGet(uri) {
    return axios.get(destino + uri, {
        responseType: 'blob',
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', uri+'.zip'); //or any other extension
            document.body.appendChild(link);
            link.click();
    });
}

function redireccionar(error){
    if(error.response.status==403){
        window.location.href = './login.html';
    }
}

function getData(uri) {
    
    return axios.get(destino+uri,
        
        {
            responseType: 'arraybuffer'
        }
    ).then(resp => {

        return (resp);
        
    });
    
}


exports.getUrl=()=> { return destino };
exports.servidorPost=servidorPost;
exports.servidorGet = servidorGet;
exports.getData = getData;
exports.redireccionar=redireccionar;
