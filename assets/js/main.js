const apiURL = "https://mindicador.cl/api/";
const input = document.querySelector("#monto");
const moneda = document.querySelector("#moneda");
const btn = document.querySelector("#btn");
const mostrar = document.querySelector("#mostrar");
const myChart = document.getElementById("chart");
let graficar = "";

//---------------------------------------------- validacion ingresos
input.addEventListener("keydown", validaNumero);

function validaNumero(evento) {      
    if (!(evento.key >= 0 && evento.key <= 9 || evento.key == "Backspace" || evento.key == "Delete")) {        
        evento.returnValue = false;
    }    
};

btn.addEventListener("click",validaInput);

function validaInput() {
    let monto = Number(input.value);
    if (monto == 0) {
        alert("Debe ingresar un Monto");
    } else {
        if (moneda.value == "none") {
            alert("Debe seleccionar una Moneda");
        } else {                       
            calcular(monto, moneda.value);
        }
    };   
};

//---------------------------------------------- calcular
async function calcular(monto, moneda) {
    const indicadores = await obtenerApi();        
    const valorMoneda = indicadores[moneda].valor;
    const resultado = monto / valorMoneda;

    mostrar.innerHTML = `Resultado: $ ${resultado.toFixed(2)}`;
    traeDataGrafico(moneda);   
};

async function obtenerApi() {
    try {
        const respuesta = await fetch(apiURL);
        const indicadores = await respuesta.json();        
        return indicadores;
    } catch {
        alert("Intentelo mas tarde.....");
    };   
};


// ::::::::::::::::::::::::::::::::::::::: grafico ::::::::::::::::::::

async function traeDataGrafico(moneda) {    
    try {
        const res = await fetch(`${apiURL}${moneda}`);
        const divisas = await res.json();    
        const series = divisas.serie;       

        const mapfecha = series.map((valor) => {
        let data = valor.fecha.slice(0, -14);
        return data;        
        });
        mapfecha.splice(10);        
    
        const mapvalor = series.map((valor) => {
        return valor.valor;
        });
        mapvalor.splice(10);    

        renderGrafico(mapfecha, mapvalor, moneda);
    } catch {
        alert("Intentelo mas tarde.....");
    };    
};

function renderGrafico(labels, data, money) {                
    const config = {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: `Ultimos 10 valores de ${money}`,
                backgroundColor: "royalblue",
                data
            }]
        },
        options: {
            scales: {
                x: {
                    reverse: true                    
                }
            }
        }
    };    

    if (graficar) {
        graficar.destroy();
    };    
    myChart.style.backgroundColor = "white";    
    graficar = new Chart(myChart, config);        
};