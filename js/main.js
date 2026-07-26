import { preguntas } from "./imagenes.js";

// =========================
// VARIABLES
// =========================
let actual = 0;
let puntos = 0;
let opcionTemporal = -1;
let terminado = false;

// =========================
// ELEMENTOS DEL DOM
// =========================
const pregunta = document.getElementById("pregunta");
const imagen = document.getElementById("imagen");
const opciones = document.getElementById("opciones");
const explicacion = document.getElementById("explicacion");
const contador = document.getElementById("contador");

const dialog = document.getElementById("dialogConfirmar");
const texto = document.getElementById("textoConfirmacion");
const botonSi = document.getElementById("si");
const botonNo = document.getElementById("no");

const botonAnterior = document.getElementById("anterior");
const botonSiguiente = document.getElementById("siguiente");
const botonTerminar = document.getElementById("terminar");

const dialogFinal = document.getElementById("dialogFinal");
const botonCerrarFinal = document.getElementById("cerrarFinal");

const formulario = document.getElementById("formulario");
const correo = document.getElementById("correo");
const mensajeFinal = document.getElementById("mensajeFinal");

// =========================
// FUNCIONES
// =========================
const actualizarMarcador = () => {
  document.getElementById("puntos").textContent = puntos;
};

// =========================
const mostrarPregunta = () => {
  const p = preguntas[actual];

  contador.textContent = `${actual + 1}/${preguntas.length}`;
  pregunta.textContent = p.pregunta;
  imagen.src = p.imagen;

  opciones.innerHTML = "";
  explicacion.innerHTML = "";
  explicacion.classList.add("hidden");

  p.opciones.forEach((opcion, indice) => {
    const boton = document.createElement("button");

    boton.textContent = opcion;
    boton.className =
      "w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white font-semibold py-4 px-4 rounded-xl shadow text-sm sm:text-base lg:text-lg";

    // Si el cuestionario terminó, todo queda bloqueado
    if (terminado) {
      boton.disabled = true;
    }

    // Si la pregunta ya fue respondida
    if (p.respuesta !== null) {
      boton.disabled = true;

      if (indice === p.correcta) {
        boton.classList.remove("bg-blue-600");
        boton.classList.add("bg-green-600");
        boton.textContent = "➜ " + opcion;
      }

      explicacion.classList.remove("hidden");
      explicacion.innerHTML = `
        <b>Respuesta correcta:</b> ${p.opciones[p.correcta]}
        <br><br>
        ${p.explicacion}
      `;
    }

    // Escuchador del botón
    boton.addEventListener("click", () => {
      if (terminado) return;
      if (p.respuesta !== null) return;

      opcionTemporal = indice;
      texto.textContent = `¿Desea confirmar la respuesta "${opcion}"?`;
      dialog.showModal();
    });

    opciones.appendChild(boton);
  });

  actualizarMarcador();
};

// =========================
// CONFIRMAR RESPUESTA
// =========================
const confirmarRespuesta = () => {
  const p = preguntas[actual];

  p.respuesta = opcionTemporal;

  if (opcionTemporal === p.correcta) {
    puntos++;
  }

  dialog.close();
  mostrarPregunta();
};

const cancelarRespuesta = () => {
  opcionTemporal = -1;
  dialog.close();
};

// =========================
// NAVEGACIÓN
// =========================
const siguientePregunta = () => {
  if (terminado) return;

  actual++;

  if (actual >= preguntas.length) {
    actual = 0;
  }

  mostrarPregunta();
};

const anteriorPregunta = () => {
  if (terminado) return;

  actual--;

  if (actual < 0) {
    actual = preguntas.length - 1;
  }

  mostrarPregunta();
};

// =========================
// TERMINAR CUESTIONARIO
// =========================
const terminarCuestionario = () => {
  terminado = true;

  botonAnterior.disabled = true;
  botonSiguiente.disabled = true;
  botonTerminar.disabled = true;

  mostrarPregunta();
  dialogFinal.showModal();
};

// =========================
// ENVIAR FORMULARIO
// =========================
const enviarFormulario = (e) => {
  e.preventDefault();

  const email = correo.value.trim();

  mensajeFinal.innerHTML = `
    Sus respuestas y la calificación (${puntos}/10) ha sido enviada a
    <b>${email}</b>.
  `;

  // Deshabilitar formulario
  formulario.querySelectorAll("input, button").forEach((elemento) => {
    elemento.disabled = true;
  });

  // Deshabilitar todos los botones de respuesta
  document.querySelectorAll("#opciones button").forEach((boton) => {
    boton.disabled = true;
  });

  // Eliminar escuchadores
  botonSi.removeEventListener("click", confirmarRespuesta);
  botonNo.removeEventListener("click", cancelarRespuesta);
  botonAnterior.removeEventListener("click", anteriorPregunta);
  botonSiguiente.removeEventListener("click", siguientePregunta);
  botonTerminar.removeEventListener("click", terminarCuestionario);
  formulario.removeEventListener("submit", enviarFormulario);
};

// =========================
// CERRAR DIALOG FINAL
// =========================
const cerrarDialogFinal = () => {
  dialogFinal.close();
};

// =========================
// ESCUCHADORES
// =========================
botonSi.addEventListener("click", confirmarRespuesta);
botonNo.addEventListener("click", cancelarRespuesta);

botonAnterior.addEventListener("click", anteriorPregunta);
botonSiguiente.addEventListener("click", siguientePregunta);
botonTerminar.addEventListener("click", terminarCuestionario);

formulario.addEventListener("submit", enviarFormulario);
botonCerrarFinal.addEventListener("click", cerrarDialogFinal);

// =========================
// INICIO
// =========================
mostrarPregunta();