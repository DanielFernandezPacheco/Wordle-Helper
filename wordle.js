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
    if (lastBoxId > 0) {
        id = "box-" + lastBoxId--;
        box = document.getElementById(id);
        box.innerHTML = "";
        eliminarColor(box);
        if (lastBoxId % 5 == 0) {
            palabraComprobada = true
        }
    }
}

function cargarPalabras() {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", "./palabras.json", false);
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
            $(".nav-btn").html('<span class="num-palabras">' + palabras.length.toLocaleString("es-ES") + '</span><br>&#x1F860;');
        } else {
            $inner.animate({
                'margin-right': "0px"
            });
            $(".nav-btn").html('&#129122;')
        }
    }
    $(".nav-btn").bind("click", function () {
        toggleDivs();
    });

});