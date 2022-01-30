var noPresentes = [];
var presentes = [];
var correctas = [];
var palabraComprobada = true;

function cambiarEstado(div) {
    if (div.classList.contains("bg-absent")) {
        div.classList.remove("bg-absent");
        div.classList.add("bg-present");
    }
    else if (div.classList.contains("bg-present")) {
        div.classList.remove("bg-present");
        div.classList.add("bg-correct");
    }
    else if (div.classList.contains("bg-correct")) {
        div.classList.remove("bg-correct");
        div.classList.add("bg-absent");
    }

}

function comprobar(){
    var boxesPalabra = document.getElementById("box-"+lastBoxId).parentElement.querySelectorAll(".box");
    let pos = 0;

    if(lastBoxId%5 == "4"){
        boxesPalabra.forEach(function(box){
            let letra = box.innerHTML;
            if(!noPresentes.includes(letra)){
                if (box.classList.contains("bg-absent") && (!presentes.includes(letra) || !correctas.include(letra))) {
                    fallo(letra);
                    document.getElementById("letra-"+letra).classList.remove("bg-key");
                    document.getElementById("letra-"+letra).className += " bg-absent text-white";
                }
                else if (box.classList.contains("bg-present") && !correctas.includes(letra)) {
                    posicion_incorrecta(letra, pos);
                    document.getElementById("letra-"+letra).classList.remove("bg-key");
                    document.getElementById("letra-"+letra).className += " bg-present text-white";
                }
                else if (box.classList.contains("bg-correct")) {
                    acierto(letra, pos);
                    document.getElementById("letra-"+letra).classList.remove("bg-key");
                    document.getElementById("letra-"+letra).classList.remove("bg-present");
                    document.getElementById("letra-"+letra).className += " bg-correct text-white";
                }
            }
            pos++;
        })
        palabraComprobada = true;
    }  
    console.log(palabras);
    document.getElementById("num-palabras").innerHTML = palabras.length;
}

function eliminarColor(div) {
    if (div.classList.contains("bg-absent")) {
        div.classList.remove("bg-absent");
    }
    else if (div.classList.contains("bg-present")) {
        div.classList.remove("bg-present");
    }
    else if (div.classList.contains("bg-correct")) {
        div.classList.remove("bg-correct");
    }
}

var lastBoxId = 0;

document.addEventListener('keydown', function (event) {
    if (isLetter(event.key)) {
        anadirLetra(event.key);
    }
    else if (event.key == "Backspace") {
        eliminarLetra();
    } else if (event.key == "Enter") {
        comprobar();
    }
});

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function anadirLetra(letra) {
    if(lastBoxId%5 != 0 || palabraComprobada){//cambiar
        if (lastBoxId < 30) {
            id = "box-" + ++lastBoxId;
            box = document.getElementById(id);
            box.innerHTML = letra;
            box.classList.add("bg-absent");
            palabraComprobada = false;
        }
    }
}

function eliminarLetra() {
    if (lastBoxId > 0) {
        id = "box-" + lastBoxId--;
        box = document.getElementById(id);
        box.innerHTML = "";
        eliminarColor(box);
    }
}

function cargarPalabras() {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "./palabras.json", false);
    xhReq.send(null);
    return JSON.parse(xhReq.responseText);

}

var palabras = cargarPalabras()
document.getElementById("num-palabras").innerHTML = palabras.length;

function acierto(letra, pos) {
    correctas.push(letra);
    presentes = presentes.filter(function(a) { return a != letra});

    palabras = palabras.filter(function (palabra) {
        return palabra[pos] == letra;
    })
}

function fallo(letra) {
    noPresentes.push(letra);
    palabras = palabras.filter(function (palabra) {
        return !palabra.includes(letra);
    })
}

function posicion_incorrecta(letra, pos) {
    presentes.push(letra);
    palabras = palabras.filter(function (palabra) {
        return palabra[pos] != letra && palabra.includes(letra);
    })
}