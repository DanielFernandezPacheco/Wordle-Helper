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

function comprobar() {
    if (lastBoxId % 5 == 0) {
        for (let pos = 0; pos < 5; pos++) {
            box = document.getElementById("box-" + (lastBoxId - 4 + pos));
            let letra = box.innerHTML;
            if (!noPresentes.includes(letra)) {
                if (box.classList.contains("bg-absent") && (!presentes.includes(letra) || !correctas.include(letra))) {
                    fallo(letra);
                    document.getElementById("letra-" + letra).classList.remove("bg-key");
                    document.getElementById("letra-" + letra).className += " bg-absent text-white";
                }
                else if (box.classList.contains("bg-present") && !correctas.includes(letra)) {
                    posicion_incorrecta(letra, pos);
                    document.getElementById("letra-" + letra).classList.remove("bg-key");
                    document.getElementById("letra-" + letra).className += " bg-present text-white";
                }
                else if (box.classList.contains("bg-correct")) {
                    acierto(letra, pos);
                    document.getElementById("letra-" + letra).classList.remove("bg-key");
                    document.getElementById("letra-" + letra).classList.remove("bg-present");
                    document.getElementById("letra-" + letra).className += " bg-correct text-white";
                }
            }

        }
        palabraComprobada = true;

        actualizarNumPalabras();
    }
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
    if (lastBoxId % 5 != 0 || palabraComprobada) {//cambiar
        if (lastBoxId < 30) {
            id = "box-" + ++lastBoxId;
            box = document.getElementById(id);
            box.innerHTML = letra;
            box.classList.add("bg-absent");
            palabraComprobada = false;
        }
    }
    if (lastBoxId % 5 == 0 && palabraComprobada) {
        palabraComprobada = false
    }
}

function eliminarLetra() {
    if (!palabraComprobada) {
        if (lastBoxId > 0) {
            id = "box-" + lastBoxId--;
            box = document.getElementById(id);
            box.innerHTML = "";
            eliminarColor(box);
            console.log(lastBoxId);
            if (lastBoxId % 5 == 0) {
                palabraComprobada = true
            }
        }
    }
}

function cargarPalabras() {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "./json/palabras.json", false);
    xhReq.send(null);
    return JSON.parse(xhReq.responseText);
}

var palabras = cargarPalabras()
actualizarNumPalabras();

function actualizarNumPalabras() {
    document.querySelectorAll('.num-palabras').forEach(function (element) {
        element.innerHTML = palabras.length.toLocaleString("es-ES");
    })

    document.getElementById("palabras-tab").innerHTML = palabras.map(function (element) {
        return '<span>' + element.toUpperCase() + '</span>';
    }).join('');
}


function acierto(letra, pos) {
    correctas.push(letra);
    presentes = presentes.filter(function (a) { return a != letra });

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


$(function () {

    function toggleDivs() {
        var $inner = $("#nav");
        if ($inner.css("margin-right") == "0px") {

            $inner.animate({
                'margin-right': '-70%'
            });
            $(".nav-btn").html('<span class="num-palabras">' + palabras.length.toLocaleString("es-ES") + '</span><br><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"> <svg xmlns="http://www.w3.org/2000/svg" class="flecha" width="0.20in" height="0.20in" viewBox="0 0 24 24"> <path id="Ruta importada" fill="white" stroke="none" stroke-width="1" d="M 22.65,10.12 C 22.65,10.12 22.69,10.13 22.69,10.13 22.69,10.13 6.63,10.13 6.63,10.13 6.63,10.13 11.68,5.07 11.68,5.07 11.92,4.82 12.06,4.48 12.06,4.13 12.06,3.78 11.92,3.45 11.68,3.20 11.68,3.20 10.89,2.42 10.89,2.42 10.64,2.17 10.32,2.03 9.96,2.03 9.61,2.03 9.28,2.17 9.04,2.42 9.04,2.42 0.38,11.07 0.38,11.07 0.13,11.32 -0.00,11.65 0.00,12.00 -0.00,12.35 0.13,12.68 0.38,12.93 0.38,12.93 9.04,21.58 9.04,21.58 9.28,21.83 9.61,21.97 9.96,21.97 10.32,21.97 10.64,21.83 10.89,21.58 10.89,21.58 11.68,20.80 11.68,20.80 11.92,20.55 12.06,20.22 12.06,19.87 12.06,19.52 11.92,19.21 11.68,18.96 11.68,18.96 6.57,13.87 6.57,13.87 6.57,13.87 22.67,13.87 22.67,13.87 23.39,13.87 24.00,13.25 24.00,12.53 24.00,12.53 24.00,11.42 24.00,11.42 24.00,10.69 23.37,10.12 22.65,10.12 Z" /> </svg>');
        } else {
            $inner.animate({
                'margin-right': "0px"
            });
            $(".flecha").addClass("flecha-cerrar")
        }
    }
    $(".nav-btn").bind("click", function () {
        toggleDivs();
    });

});