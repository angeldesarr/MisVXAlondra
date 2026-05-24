// ==========  FIREBASE ==========

const firebaseConfig = {
  apiKey: "AIzaSyBuu4CvDvjqJZqkUFoM4BTLe8m66Tes3WI", 
  authDomain: "vxalondra.firebaseapp.com",  
  databaseURL: "https://vxalondra-default-rtdb.firebaseio.com",  
  projectId: "vxalondra", 
  storageBucket: "vxalondra.firebasestorage.app",  
  messagingSenderId: "447594504805", 
  appId: "1:447594504805:web:293b7d6b51030d4b14dc8c"  
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log('🔥 Firebase conectado a proyecto:', firebaseConfig.projectId);

// ========== FILTRO DE MALAS PALABRAS ==========
const malasPalabras = ["pendejo", "pendeja", "chinga", "puto", "verga", "cabron", "mamon", "culero", "hijodeputa", "idiota"];

function contieneMalasPalabras(texto) {
  texto = texto.toLowerCase();
  return malasPalabras.some(palabra => texto.includes(palabra));
}

// ========== PARTICULAS ==========
particlesJS("particles-js", {
  particles: {
    number: { value: 100 },
    color: { value: "#C0C0C0" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 2 },
    move: { enable: true, speed: 1 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  }
});

// ========== TYPED TEXT ==========
new Typed("#typed-text", {
  strings: ["¡Mis XV Años!", "22 de Agosto", "¡Te espero!"],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true
});

// ========== MÚSICA ==========
const canciones = [
  "audio/lady.mp3",
];

let indiceActual = Math.floor(Math.random() * canciones.length);
const musica = document.getElementById("bg-music");
if (musica) {
  musica.volume = 0.3;
  musica.src = canciones[indiceActual];

  musica.addEventListener("ended", () => {
    indiceActual = (indiceActual + 1) % canciones.length;
    musica.src = canciones[indiceActual];
    musica.load();
    musica.play();
  });
}

// ========== CONTADOR CON HOJAS QUE CAEN ==========
let valoresAnteriores = {
  dias: null,
  horas: null,
  minutos: null,
  segundos: null
};

const fechaMisa = new Date("2026-08-22T16:00:00-06:00");
const fechaSalon = new Date("2026-08-22T18:00:00-06:00");

function actualizarContador() {
  const ahora = new Date();
  let nuevoValor = {};
  
  if (ahora < fechaMisa) {
    const diferencia = fechaMisa - ahora;
    nuevoValor = {
      dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
      horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((diferencia / (1000 * 60)) % 60),
      segundos: Math.floor((diferencia / 1000) % 60)
    };
  } else if (ahora >= fechaMisa && ahora < fechaSalon) {
    const diferencia = fechaSalon - ahora;
    nuevoValor = {
      dias: 0,
      horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((diferencia / (1000 * 60)) % 60),
      segundos: Math.floor((diferencia / 1000) % 60)
    };
  } else {
    nuevoValor = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }
  
  actualizarTarjeta('dias', nuevoValor.dias, valoresAnteriores.dias);
  actualizarTarjeta('horas', nuevoValor.horas, valoresAnteriores.horas);
  actualizarTarjeta('minutos', nuevoValor.minutos, valoresAnteriores.minutos);
  actualizarTarjeta('segundos', nuevoValor.segundos, valoresAnteriores.segundos);
  
  valoresAnteriores = { ...nuevoValor };
  
  if (ahora < fechaMisa) {
    const titulo = document.querySelector(".contador-titulo");
    if (titulo) titulo.innerHTML = "⏳ Faltan para la Misa...";
  } else if (ahora >= fechaMisa && ahora < fechaSalon) {
    const mediaHoraAntes = new Date(fechaSalon.getTime() - 30 * 60 * 1000);
    const titulo = document.querySelector(".contador-titulo");
    if (titulo) {
      if (ahora >= mediaHoraAntes) {
        titulo.innerHTML = "⏰ ¡No alcanzaste la misa pero aún llegas a celebrar! Ya casi empieza mi festejo";
      } else {
        titulo.innerHTML = "⛪ La misa ya comenzó, pero aún llegas al salón";
      }
    }
  } else {
    const titulo = document.querySelector(".contador-titulo");
    if (titulo) titulo.innerHTML = "🎉 ¡YA EMPEZÓ MI FIESTA! 🎉";
  }
}

function actualizarTarjeta(tipo, nuevoValor, viejoValor) {
  const nuevoStr = String(nuevoValor).padStart(2, '0');
  const viejoStr = String(viejoValor).padStart(2, '0');
  
  const flipCard = document.getElementById(`flip-${tipo}`);
  if (!flipCard) return;
  
  const numeroEl = flipCard.querySelector('.flip-number');
  const hoja = flipCard.querySelector('.hoja-cayendo');
  
  if (!numeroEl) return;
  
  if (viejoValor === null || viejoValor === undefined) {
    numeroEl.textContent = nuevoStr;
    if (hoja) hoja.style.opacity = '0';
    return;
  }
  
  if (nuevoStr === viejoStr) return;
  
  if (hoja) {
    hoja.textContent = viejoStr;
    hoja.classList.remove('animar');
    hoja.style.opacity = '1';
    
    void hoja.offsetWidth;
    
    hoja.classList.add('animar');
    numeroEl.textContent = nuevoStr;
    
    setTimeout(() => {
      hoja.style.opacity = '0';
      hoja.classList.remove('animar');
    }, 400);
  } else {
    numeroEl.textContent = nuevoStr;
  }
}

setInterval(actualizarContador, 1000);
actualizarContador();

// ========== CONSTELACIÓN (INVITADOS) ==========
const canvas = document.getElementById("constelacion-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let animacionConstelacionActiva = false;
let frameId = null;
let estrellas = [];
let ultimaActualizacionConstelacion = 0;

function ajustarCanvas() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

window.addEventListener("resize", () => {
  ajustarCanvas();
  if (estrellas.length > 0) {
    estrellas.forEach(e => {
      e.x = Math.random() * canvas.width;
      e.y = Math.random() * canvas.height;
    });
  }
});

function dibujarEstrella(ctx, x, y, radio, puntas, radioInterno, color) {
  const paso = Math.PI / puntas;
  ctx.beginPath();
  for (let i = 0; i < 2 * puntas; i++) {
    const r = (i % 2 === 0) ? radio : radioInterno;
    const a = i * paso;
    const xPos = x + r * Math.sin(a);
    const yPos = y - r * Math.cos(a);
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function animarConstelacion() {
  if (!animacionConstelacionActiva) return;
  if (!ctx || !canvas) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  estrellas.forEach(e => {
    e.x += e.vx;
    e.y += e.vy;

    if (e.x < 0 || e.x > canvas.width) e.vx *= -1;
    if (e.y < 0 || e.y > canvas.height) e.vy *= -1;
    if (e.x < 0) e.x = 0;
    if (e.x > canvas.width) e.x = canvas.width;
    if (e.y < 0) e.y = 0;
    if (e.y > canvas.height) e.y = canvas.height;

    dibujarEstrella(ctx, e.x, e.y, 6, 5, 2.5, "#C0C0C0");
    ctx.font = "11px Montserrat";
    ctx.fillStyle = "#fff";
    ctx.fillText(e.nombre.substring(0, 15), e.x + 8, e.y - 8);
  });

  for (let i = 0; i < estrellas.length; i++) {
    for (let j = i + 1; j < estrellas.length; j++) {
      const dx = estrellas[i].x - estrellas[j].x;
      const dy = estrellas[i].y - estrellas[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(estrellas[i].x, estrellas[i].y);
        ctx.lineTo(estrellas[j].x, estrellas[j].y);
        ctx.strokeStyle = "rgba(192, 192, 192, 0.15)";
        ctx.stroke();
      }
    }
  }

  frameId = requestAnimationFrame(animarConstelacion);
}

function cargarConstelacion() {
  const ahora = Date.now();
  if (ahora - ultimaActualizacionConstelacion < 2000) return;
  ultimaActualizacionConstelacion = ahora;
  
  // Cambiar: en lugar de filtrar por activo, traer todos pero filtrar en JS
  db.ref("asistentes").once("value").then(snapshot => {
    const datos = snapshot.val() || {};
    // Filtrar solo los que NO tienen activo: false (o sea, activos)
    const lista = Object.values(datos).filter(a => a.activo !== false);
    
    if (!canvas) return;
    ajustarCanvas();
    
    if (lista.length === 0) {
      estrellas = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      alert("Aún no hay invitados confirmados. ¡Sé el primero!");
      return;
    }
    
    estrellas = lista.map(a => ({
      nombre: a.nombre || 'Anónimo',
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2
    }));
    
    if (!animacionConstelacionActiva && estrellas.length > 0) {
      animacionConstelacionActiva = true;
      animarConstelacion();
    }
  }).catch(error => console.error("Error cargando constelación:", error));
}

function verConstelacion() {
  db.ref("asistentes").once("value").then(snapshot => {
    const datos = snapshot.val();
    // Filtrar los activos (activo !== false)
    const activos = Object.values(datos || {}).filter(a => a.activo !== false);
    if (!activos || activos.length === 0) {
      alert("Aún no hay invitados confirmados. ¡Sé el primero!");
      return;
    }
    cargarConstelacion();
  });
}


// Buscar por código y permitir reactivar si está cancelado
document.getElementById("btn-buscar-codigo")?.addEventListener("click", async () => {
  const codigo = document.getElementById("codigo-buscar").value.trim().toUpperCase();
  if (!codigo) {
    alert("Ingresa tu código");
    return;
  }
  
  const snapshot = await db.ref(`codigos/${codigo}`).once("value");
  const data = snapshot.val();
  
  if (!data) {
    alert("❌ Código no válido.");
    return;
  }
  
  const invitadoSnap = await db.ref(`asistentes/${data.idAsistente}`).once("value");
  const invitado = invitadoSnap.val();
  
  if (!invitado) {
    alert("Error: Datos no encontrados");
    return;
  }
  
  // Si está cancelado, preguntar si quiere REACTIVAR
  if (invitado.activo === false) {
    const reactivar = confirm(`¿Quieres REACTIVAR tu confirmación?\n Preciona el boton de:\n\n- "Aceptar" para reactivar tu confirmacion\n"o"\n- "Cancelar" para no hacer ni un cambio`);
    
    if (reactivar) {
      await db.ref(`asistentes/${data.idAsistente}`).update({
        activo: true,
        fechaReactivacion: new Date().toISOString()
      });
      await db.ref(`codigos/${codigo}`).update({ activo: true });
      
      alert(`¡Bienvenid@ de nuevo ${invitado.nombre}!\nGracias por hacernos un espacio en tu agenda.`);
      limpiarActualizacion();
      cargarConstelacion();
      if (typeof cargarTablaInvitados === 'function') cargarTablaInvitados();
      return;
    }
    return;
  }
  
  // Si está activo, mostrar para actualizar
  document.getElementById("datos-actualizacion").style.display = "block";
  document.getElementById("nombre-buscado").textContent = `✨ ${invitado.nombre} ✨`;
  document.getElementById("codigo-buscar").disabled = true;
  
  window.codigoActual = codigo;
  window.idAsistenteActual = data.idAsistente;
  window.acompanantesActuales = invitado.acompanantes || 0;
  
  document.querySelectorAll('.btn-acomp-update').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.acomp) === window.acompanantesActuales) {
      btn.classList.add('active');
    }
  });
});

// ========== VIDEO ==========
const videoDivertido = document.getElementById("video-divertido");
if (videoDivertido) {
  videoDivertido.addEventListener("play", () => {
    if (musica && !musica.paused) musica.pause();
  });
  videoDivertido.addEventListener("ended", () => {
    if (musica) musica.play();
  });
}

// ========== CALENDARIO GOOGLE ==========
function agregarAlCalendario() {
  const titulo = encodeURIComponent("XV Años de Alondra");
  const descripcion = encodeURIComponent("Misa a las 4:00 PM en Parroquia San Felipe de Jesus Hueyotlipan, Celebración a las 6:00 PM en Recepciones Luga Salon & Jardin");
  const ubicacion = encodeURIComponent("Recepciones Luga Salon & Jardin - Calle 11 Nte. 6209, Veinte de Noviembre, 72230 Puebla");
  
  const fechaInicio = "20260822T160000";
  const fechaFin = "20260823T020000";
  
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${fechaInicio}/${fechaFin}&details=${descripcion}&location=${ubicacion}`;
  
  window.open(url, '_blank');
}

// ========== AMPLIAR IMÁGENES ==========
function iniciarAmpliacionImagenes() {
  const imgIglesia = document.querySelector('#modal-iglesia img');
  if (imgIglesia) {
    imgIglesia.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalImagen(imgIglesia.src, "⛪ Parroquia San Felipe de Jesus");
    });
  }
  
  const imgSalon = document.querySelector('#modal-salon img');
  if (imgSalon) {
    imgSalon.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalImagen(imgSalon.src, "🎉 Recepciones Luga Salon & Jardin");
    });
  }
}

function abrirModalImagen(src, titulo) {
  let modalImagen = document.getElementById('modal-imagen-ampliada');
  if (!modalImagen) {
    modalImagen = document.createElement('div');
    modalImagen.id = 'modal-imagen-ampliada';
    modalImagen.className = 'modal-imagen';
    modalImagen.innerHTML = `
      <div class="modal-imagen-content">
        <span class="close-imagen">&times;</span>
        <h3></h3>
        <img src="" alt="Ampliación">
      </div>
    `;
    document.body.appendChild(modalImagen);
    
    modalImagen.querySelector('.close-imagen').addEventListener('click', () => {
      modalImagen.style.display = 'none';
    });
    
    modalImagen.addEventListener('click', (e) => {
      if (e.target === modalImagen) {
        modalImagen.style.display = 'none';
      }
    });
  }
  
  modalImagen.querySelector('h3').textContent = titulo;
  modalImagen.querySelector('img').src = src;
  modalImagen.style.display = 'flex';
}

function iniciarCierreModales() {

  const closes = document.querySelectorAll('.close');
  closes.forEach(close => {
  
    const newClose = close.cloneNode(true);
    close.parentNode.replaceChild(newClose, close);
    
    newClose.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar que se propague
      const modal = newClose.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
 
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
}

// ========== SELECTOR DE ACOMPAÑANTES ==========
let acompananteSeleccionado = 0;

function iniciarSelectorAcompanantes() {
  const botones = document.querySelectorAll('.btn-acompanante');
  if (botones.length === 0) return;
  
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      acompananteSeleccionado = parseInt(btn.getAttribute('data-acomp'));
      const inputAcomp = document.getElementById('acompanantes');
      if (inputAcomp) inputAcomp.value = acompananteSeleccionado;
    });
  });
  const btnCero = document.querySelector('.btn-acompanante[data-acomp="0"]');
  if (btnCero) btnCero.classList.add('active');
}

async function confirmarAsistencia() {
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const acompanantesInput = document.getElementById("acompanantes");
  
  if (!nombreInput) return;
  
  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput ? telefonoInput.value.trim() : '';
  const acompanantes = acompanantesInput ? parseInt(acompanantesInput.value || 0) : 0;
  
  if (!nombre) {
    alert("Por favor, escribe tu nombre completo");
    return;
  }

  if (nombre.replace(/\s+/g, "").length > 30) {
    alert("Tu nombre es muy largo. Usa máximo 30 caracteres.");
    return;
  }

  if (contieneMalasPalabras(nombre)) {
    alert("Por favor, sé respetuoso con tu nombre 🙏");
    return;
  }

  const totalPersonas = 1 + acompanantes;
  const nombreNormalizado = nombre.toLowerCase();

  try {
    const snapshot = await db.ref("asistentes").once("value");
    const datos = snapshot.val();
    let idExistente = null;
    let telefonoExistente = null;
    
    if (datos) {
      for (let id in datos) {
        const asistente = datos[id];
        if (asistente.nombre && asistente.nombre.toLowerCase().trim() === nombreNormalizado) {
          idExistente = id;
          telefonoExistente = asistente.telefono;
          break;
        }
      }
    }
    
    if (idExistente && telefono === telefonoExistente) {
      const pregunta = confirm(`⚠️ Ya existe una confirmación con el nombre "${nombre}".\n\n¿Quieres ACTUALIZAR tus datos?\n- "Aceptar" → Ve al apartado "¿Ya tienes un código?" y usa tu código\n- "Cancelar" → No se harán cambios`);
      if (pregunta) {
        alert("🔐 Usa el apartado de abajo con tu código para actualizar.");
      }
      return;
    }
    
    if (idExistente && telefono !== telefonoExistente) {
      const pregunta = confirm(`⚠️ Ya existe "${nombre}" con otro teléfono.\n\n¿Es otra persona?\n- "Aceptar" → Crear nuevo registro\n- "Cancelar" → No hacer nada`);
      if (!pregunta) return;
    }
    
    // NUEVO REGISTRO
    const nuevoRef = db.ref("asistentes").push();
    const idAsistente = nuevoRef.key;
    
    // Generar código
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    let existe = true;
    let codigoFinal = codigo;
    while (existe) {
      const snap = await db.ref(`codigos/${codigoFinal}`).once('value');
      if (!snap.exists()) {
        existe = false;
      } else {
        codigoFinal = '';
        for (let i = 0; i < 6; i++) {
          codigoFinal += letras.charAt(Math.floor(Math.random() * letras.length));
        }
      }
    }
    
    await nuevoRef.set({
      nombre: nombre,
      telefono: telefono,
      acompanantes: acompanantes,
      total: totalPersonas,
      fechaConfirmacion: new Date().toISOString(),
      codigo: codigoFinal
    });
    
    await db.ref(`codigos/${codigoFinal}`).set({
      idAsistente: idAsistente,
      nombre: nombre,
      activo: true,
      fecha: new Date().toISOString()
    });
    
    // Guardar datos para el modal
    window.codigoGenerado = codigoFinal;
    window.nombreGenerado = nombre;
    window.totalGenerado = totalPersonas;
    window.acompanantesGenerados = acompanantes;
    
    // Mostrar modal
    document.getElementById("codigo-mostrado").textContent = codigoFinal;
    document.getElementById("codigo-texto").textContent = codigoFinal;
    document.getElementById("nombre-mostrado-modal").textContent = nombre;
    document.getElementById("modal-codigo").style.display = "flex";
    
    resetearFormulario();
    
  } catch(error) {
    console.error("Error:", error);
    alert("Error: " + error.message);
  }
}

// Evento del botón aceptar en el modal
document.getElementById("btn-aceptar-codigo")?.addEventListener("click", () => {
  // Cerrar modal
  document.getElementById("modal-codigo").style.display = "none";
  
  // Enviar WhatsApp a tu número
  const msg = `¡Hola, soy! ${window.nombreGenerado}\n Gracias por invitarme seremos un Total de ${window.totalGenerado} personas nos vemos pronto`;
  const link = `https://wa.me/522214150544?text=${encodeURIComponent(msg)}`;
  window.open(link, "_blank");
  
  // Limpiar variables
  window.codigoGenerado = null;
  window.nombreGenerado = null;
  window.totalGenerado = null;
  window.acompanantesGenerados = null;
});

function resetearFormulario() {
  const nombreInput = document.getElementById("nombre");
  const inputAcomp = document.getElementById("acompanantes");
  
  if (nombreInput) nombreInput.value = "";
  if (inputAcomp) inputAcomp.value = "0";
  
  const botones = document.querySelectorAll('.btn-acompanante');
  botones.forEach(b => b.classList.remove('active'));
  
  const btnCero = document.querySelector('.btn-acompanante[data-acomp="0"]');
  if (btnCero) btnCero.classList.add('active');
  
  acompananteSeleccionado = 0;
}

function enviarWhatsApp(nombre, acompanantes) {
  const total = acompanantes + 1;
  const msg = `Hola, soy ${nombre}. ¡Confirmo mi asistencia a tus XV años! %0ATotal de personas: ${total}`;
  const link = `https://wa.me/522214150544?text=${msg}`;
  window.open(link, "_blank");
}

// ========== PANEL ADMIN CON CONTRASEÑA ==========
let contadorToques = 0;
let timeoutToque;
const CONTRASENA_CORRECTA = "MifiestaXV2026AAG";

function iniciarPanelSecreto() {
  const tituloConfirmacion = document.querySelector('.confirmacion h3');
  if (!tituloConfirmacion) return;
  
  tituloConfirmacion.addEventListener('click', () => {
    contadorToques++;
    clearTimeout(timeoutToque);
    
    if (contadorToques === 5) {
      contadorToques = 0;
      abrirPanelAdmin();
    }
    
    timeoutToque = setTimeout(() => {
      contadorToques = 0;
    }, 2000);
  });
}

function abrirPanelAdmin() {
  const panel = document.getElementById('panel-admin');
  if (panel) {
    panel.classList.remove('oculto');
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) passwordInput.value = '';
    const errorMsg = document.getElementById('password-error');
    if (errorMsg) errorMsg.style.display = 'none';
    const contenido = document.getElementById('admin-contenido');
    if (contenido) contenido.style.display = 'none';
  }
}

function verificarPassword() {
  const passwordInput = document.getElementById('admin-password');
  const password = passwordInput?.value || '';
  const errorMsg = document.getElementById('password-error');
  const contenido = document.getElementById('admin-contenido');
  
  if (password === CONTRASENA_CORRECTA) {
    if (errorMsg) errorMsg.style.display = 'none';
    if (contenido) {
      contenido.style.display = 'block';
      cargarTablaInvitados();
    }
    if (passwordInput) passwordInput.value = '';
  } else {
    if (errorMsg) errorMsg.style.display = 'block';
    if (contenido) contenido.style.display = 'none';
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
  }
}

function cerrarPanelAdmin() {
  const panel = document.getElementById('panel-admin');
  if (panel) panel.classList.add('oculto');
  const contenido = document.getElementById('admin-contenido');
  if (contenido) contenido.style.display = 'none';
  const errorMsg = document.getElementById('password-error');
  if (errorMsg) errorMsg.style.display = 'none';
  const passwordInput = document.getElementById('admin-password');
  if (passwordInput) passwordInput.value = '';
}

function cargarTablaInvitados() {
  db.ref("asistentes").once("value").then(snapshot => {
    const datos = snapshot.val();
    const tbody = document.querySelector('#tabla-invitados tbody');
    const totalPersonasSpan = document.getElementById('total-personas');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Contadores separados
    let totalPersonasActivas = 0;
    let totalPersonasCanceladas = 0;
    let totalConfirmacionesActivas = 0;
    let totalConfirmacionesCanceladas = 0;
    
    // Actualizar encabezado de la tabla (orden revisado)
    const thead = document.querySelector('#tabla-invitados thead');
    if (thead) {
      thead.innerHTML = `<tr>
        <th>Nombre</th>
        <th>Acompañantes</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Fecha Confirmación</th>
        <th>Código</th>
        <th>Teléfono</th>
      </tr>`;
    }
    
    if (datos) {
      const invitadosArray = Object.values(datos);
      invitadosArray.sort((a, b) => {
        if (!a.fechaConfirmacion) return 1;
        if (!b.fechaConfirmacion) return -1;
        return new Date(b.fechaConfirmacion) - new Date(a.fechaConfirmacion);
      });
      
      invitadosArray.forEach(invitado => {
        const activo = invitado.activo !== false;
        const nombre = invitado.nombre || 'Anónimo';
        const telefono = invitado.telefono || '—';
        const acompanantes = invitado.acompanantes || 0;
        const total = invitado.total || (1 + acompanantes);
        const codigo = invitado.codigo || '—';
        const fecha = invitado.fechaConfirmacion ? new Date(invitado.fechaConfirmacion).toLocaleString() : '';
        
        if (activo) {
          totalPersonasActivas += total;
          totalConfirmacionesActivas++;
        } else {
          totalPersonasCanceladas += total;
          totalConfirmacionesCanceladas++;
        }
        
        const row = tbody.insertRow();
        row.insertCell(0).textContent = nombre;
        row.insertCell(1).textContent = acompanantes;
        row.insertCell(2).textContent = total;
        row.insertCell(3).textContent = activo ? '✅ Activo' : '❌ Cancelado';
        row.insertCell(4).textContent = fecha;
        row.insertCell(5).textContent = codigo;
        row.insertCell(6).textContent = telefono;
        
       
        if (!activo) {
          row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
          row.style.textDecoration = 'line-through';
        }
      });
    }
    
// Mostrar resumen claro en COLUMNAS (horizontal) con números en la misma línea
if (totalPersonasSpan) {
  totalPersonasSpan.innerHTML = `
    <div style="display: flex; justify-content: space-around; text-align: center; gap: 1rem; flex-wrap: wrap;">
      <div style="background: rgba(76, 175, 80, 0.2); padding: 0.5rem 1rem; border-radius: 10px;">
        <strong>🟢 ACTIVOS</strong><br>
        ${totalConfirmacionesActivas} / <strong>${totalPersonasActivas}</strong>
      </div>
      <div style="background: rgba(244, 67, 54, 0.2); padding: 0.5rem 1rem; border-radius: 10px;">
        <strong>🔴 CANCELADOS</strong><br>
        ${totalConfirmacionesCanceladas} / <strong>${totalPersonasCanceladas}</strong>
      </div>
      <div style="background: rgba(33, 150, 243, 0.2); padding: 0.5rem 1rem; border-radius: 10px;">
        <strong>🎯 TOTAL GENERAL</strong><br>
        ${totalConfirmacionesActivas + totalConfirmacionesCanceladas} / <strong>${totalPersonasActivas + totalPersonasCanceladas}</strong>
      </div>
    </div>
  `;
}
  });
}

function descargarCSV() {
  db.ref("asistentes").once("value").then(snapshot => {
    const datos = snapshot.val();
    if (!datos) {
      alert('No hay datos para descargar');
      return;
    }
    
    // Encabezados actualizados con ESTADO
    let csvContent = "Nombre,Teléfono,Acompañantes,Total,Estado (Activo/Cancelado),Código,Fecha Confirmación,Fecha Cancelación,Fecha Actualización\n";
    
    Object.values(datos).forEach(invitado => {
      const activo = invitado.activo !== false;
      const nombre = invitado.nombre || 'Anónimo';
      const telefono = invitado.telefono || '';
      const acompanantes = invitado.acompanantes || 0;
      const total = invitado.total || (1 + acompanantes);
      const estado = activo ? 'ACTIVO ✅' : 'CANCELADO ❌';
      const codigo = invitado.codigo || '';
      const fechaConfirmacion = invitado.fechaConfirmacion ? new Date(invitado.fechaConfirmacion).toLocaleString() : '';
      const fechaCancelacion = invitado.fechaCancelacion ? new Date(invitado.fechaCancelacion).toLocaleString() : '';
      const fechaActualizacion = invitado.fechaActualizacion ? new Date(invitado.fechaActualizacion).toLocaleString() : '';
      
      csvContent += `"${nombre}","${telefono}",${acompanantes},${total},"${estado}","${codigo}","${fechaConfirmacion}","${fechaCancelacion}","${fechaActualizacion}"\n`;
    });
    
    // Calcular totales separados
    const totalActivos = Object.values(datos).filter(inv => inv.activo !== false).reduce((sum, inv) => sum + (inv.total || (1 + (inv.acompanantes || 0))), 0);
    const totalCancelados = Object.values(datos).filter(inv => inv.activo === false).reduce((sum, inv) => sum + (inv.total || (1 + (inv.acompanantes || 0))), 0);
    const totalGeneral = totalActivos + totalCancelados;
    
    csvContent += `\n"RESUMEN","","","","","","","",""\n`;
    csvContent += `"Total Activos","${totalActivos}","personas","","","","","",""\n`;
    csvContent += `"Total Cancelados","${totalCancelados}","personas","","","","","",""\n`;
    csvContent += `"TOTAL GENERAL","${totalGeneral}","personas","","","","","",""\n`;
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `invitados_xv_alondra_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📊 Archivo CSV descargado con estado actualizado');
  });
}

function iniciarEventosPanel() {
  const btnVerificar = document.getElementById('btn-verificar-password');
  if (btnVerificar) {
    const nuevoBtn = btnVerificar.cloneNode(true);
    btnVerificar.parentNode.replaceChild(nuevoBtn, btnVerificar);
    nuevoBtn.addEventListener('click', verificarPassword);
  }
  
  const btnDescargar = document.getElementById('btn-descargar-tabla');
  if (btnDescargar) {
    const nuevoDescargar = btnDescargar.cloneNode(true);
    btnDescargar.parentNode.replaceChild(nuevoDescargar, btnDescargar);
    nuevoDescargar.addEventListener('click', descargarCSV);
  }
  
  const btnCerrarPanel = document.getElementById('btn-cerrar-panel');
  if (btnCerrarPanel) {
    const nuevoCerrar = btnCerrarPanel.cloneNode(true);
    btnCerrarPanel.parentNode.replaceChild(nuevoCerrar, btnCerrarPanel);
    nuevoCerrar.addEventListener('click', cerrarPanelAdmin);
  }
}

// ========== BUZÓN DE MENSAJES ==========
let mensajesArray = [];
let indiceActualMensaje = 0;

// Referencia a mensajes en la MISMA base de datos
const mensajesRef = db.ref('mensajes');

function cargarMensajes() {
  mensajesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    mensajesArray = [];
    
    if (data) {
      mensajesArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      
      console.log(`📨 Cargados ${mensajesArray.length} mensajes`);
    }
    
    actualizarDeckMensajes();
  });
}

function enviarMensaje(nombre, texto) {
  if (!nombre.trim() || !texto.trim()) {
    alert('💌 Por favor, escribe tu nombre y un mensaje 💌');
    return false;
  }
  
  if (contieneMalasPalabras(nombre) || contieneMalasPalabras(texto)) {
    alert('Por favor, sé respetuoso con tu mensaje 🙏');
    return false;
  }
  
  if (texto.length > 500) {
    alert('El mensaje no puede exceder los 500 caracteres');
    return false;
  }
  
  const btnEnviar = document.getElementById('btn-enviar-mensaje');
  const textoOriginal = btnEnviar ? btnEnviar.textContent : 'Enviar';
  if (btnEnviar) {
    btnEnviar.textContent = '📨 Enviando...';
    btnEnviar.disabled = true;
  }
  
  const nuevoMensaje = {
    nombre: nombre.trim(),
    texto: texto.trim(),
    timestamp: Date.now(),
    fecha: new Date().toLocaleDateString('es-MX'),
    hora: new Date().toLocaleTimeString('es-MX')
  };
  
  mensajesRef.push(nuevoMensaje)
    .then(() => {
      alert('✨ ¡Mensaje enviado con éxito! ✨');
      document.getElementById('nombre-mensaje').value = '';
      document.getElementById('texto-mensaje').value = '';
      actualizarContadorCaracteres();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al enviar: ' + error.message);
    })
    .finally(() => {
      if (btnEnviar) {
        btnEnviar.textContent = textoOriginal;
        btnEnviar.disabled = false;
      }
    });
  
  return true;
}

function mostrarMensaje(index) {
  const deck = document.getElementById('mensajes-deck');
  if (!deck) return;
  
  if (mensajesArray.length === 0) {
    deck.innerHTML = `
      <div class="mensaje-vacio">
        <p>✨ No hay mensajes aún. ¡Sé el primero en dejar uno! ✨</p>
        <p style="font-size: 0.8rem;">💝 Anímate y dedícale un mensaje a Alondra</p>
      </div>
    `;
    const btnAnt = document.getElementById('btn-anterior-mensajes');
    const btnSig = document.getElementById('btn-siguiente-mensajes');
    const cont = document.getElementById('contador-mensajes');
    if (btnAnt) btnAnt.disabled = true;
    if (btnSig) btnSig.disabled = true;
    if (cont) cont.textContent = '0 / 0';
    return;
  }
  
  if (index < 0) index = 0;
  if (index >= mensajesArray.length) index = mensajesArray.length - 1;
  indiceActualMensaje = index;
  
  const mensaje = mensajesArray[indiceActualMensaje];
  
  deck.innerHTML = `
    <div class="mensaje-card navegando">
      <div class="mensaje-header">
        <span class="nombre-autor">💜 ${escapeHtml(mensaje.nombre)}</span>
        <span class="fecha-mensaje">📅 ${mensaje.fecha || 'Reciente'} ${mensaje.hora ? '⏰ ' + mensaje.hora : ''}</span>
      </div>
      <div class="mensaje-texto">${escapeHtml(mensaje.texto)}</div>
    </div>
  `;
  
  const contadorSpan = document.getElementById('contador-mensajes');
  if (contadorSpan) {
    contadorSpan.textContent = `${indiceActualMensaje + 1} / ${mensajesArray.length}`;
  }
  
  const btnAnt = document.getElementById('btn-anterior-mensajes');
  const btnSig = document.getElementById('btn-siguiente-mensajes');
  if (btnAnt) btnAnt.disabled = indiceActualMensaje === 0;
  if (btnSig) btnSig.disabled = indiceActualMensaje === mensajesArray.length - 1;
}

function actualizarDeckMensajes() {
  mostrarMensaje(mensajesArray.length > 0 ? 0 : 0);
}

function mensajeAnterior() {
  if (indiceActualMensaje > 0) mostrarMensaje(indiceActualMensaje - 1);
}

function mensajeSiguiente() {
  if (indiceActualMensaje < mensajesArray.length - 1) mostrarMensaje(indiceActualMensaje + 1);
}

function actualizarContadorCaracteres() {
  const textarea = document.getElementById('texto-mensaje');
  const contador = document.getElementById('caracteres-restantes');
  if (textarea && contador) {
    const restantes = 500 - textarea.value.length;
    contador.textContent = restantes;
    contador.style.color = restantes < 50 ? '#ff6b6b' : restantes < 100 ? '#ffa500' : '#9ca3af';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function inicializarBuzon() {
  if (!document.querySelector('.buzon-mensajes')) return;
  
  const textarea = document.getElementById('texto-mensaje');
  if (textarea) {
    textarea.addEventListener('input', actualizarContadorCaracteres);
  }
  
  const btnEnviar = document.getElementById('btn-enviar-mensaje');
  if (btnEnviar) {
    const nuevoBtn = btnEnviar.cloneNode(true);
    btnEnviar.parentNode.replaceChild(nuevoBtn, btnEnviar);
    nuevoBtn.addEventListener('click', () => {
      const nombre = document.getElementById('nombre-mensaje')?.value || '';
      const texto = document.getElementById('texto-mensaje')?.value || '';
      enviarMensaje(nombre, texto);
    });
  }
  
  const btnAnt = document.getElementById('btn-anterior-mensajes');
  const btnSig = document.getElementById('btn-siguiente-mensajes');
  
  if (btnAnt) {
    const nuevoAnt = btnAnt.cloneNode(true);
    btnAnt.parentNode.replaceChild(nuevoAnt, btnAnt);
    nuevoAnt.addEventListener('click', mensajeAnterior);
  }
  
  if (btnSig) {
    const nuevoSig = btnSig.cloneNode(true);
    btnSig.parentNode.replaceChild(nuevoSig, btnSig);
    nuevoSig.addEventListener('click', mensajeSiguiente);
  }
  
  cargarMensajes();

  let touchStart = 0;
  const deck = document.querySelector('.mensajes-deck');
  if (deck) {
    deck.addEventListener('touchstart', (e) => {
      touchStart = e.changedTouches[0].screenX;
    });
    deck.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStart;
      if (Math.abs(diff) > 50) {
        diff > 0 ? mensajeAnterior() : mensajeSiguiente();
      }
    });
  }
}

// ========== INICIALIZACIÓN PRINCIPAL ==========
document.addEventListener("DOMContentLoaded", () => {
  // Botón ver invitación
  const btnVer = document.getElementById("btn-ver");
  if (btnVer) {
    const nuevoBtnVer = btnVer.cloneNode(true);
    btnVer.parentNode.replaceChild(nuevoBtnVer, btnVer);
    
    nuevoBtnVer.addEventListener("click", () => {
      if (musica) musica.play().catch(e => console.log("Audio:", e));
      
      const entrada = document.querySelector(".entrada");
      const contenido = document.querySelector(".contenido");
      if (entrada) entrada.style.display = "none";
      if (contenido) contenido.classList.add("visible");
      
      iniciarAmpliacionImagenes();
      iniciarCierreModales();
      iniciarSelectorAcompanantes();
      iniciarPanelSecreto();
      iniciarEventosPanel();
      inicializarBuzon();
      
      setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.utils.toArray(".scroll").forEach(section => {
            gsap.fromTo(section, { opacity: 0, y: 40 }, {
              opacity: 1, y: 0,
              scrollTrigger: { trigger: section, start: "top 80%" },
              duration: 1
            });
          });
        }
      }, 100);
    });
  }
  
  // Botón confirmar asistencia
  const btnConfirmar = document.getElementById("btn-confirmar");
  if (btnConfirmar) {
    const nuevoBtnConfirmar = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(nuevoBtnConfirmar, btnConfirmar);
    nuevoBtnConfirmar.addEventListener("click", confirmarAsistencia);
  }

// Buscar por código
document.getElementById("btn-buscar-codigo")?.addEventListener("click", async () => {
  const codigo = document.getElementById("codigo-buscar").value.trim().toUpperCase();
  if (!codigo) {
    alert("Ingresa tu código");
    return;
  }
  
  const snapshot = await db.ref(`codigos/${codigo}`).once("value");
  const data = snapshot.val();
  
  if (!data || !data.activo) {
    alert("Tu Codigo no es valido verifica que hayas ingresado bien tu codigo\no\n ¿cancelaste tu invitacion?\nsi fue la segunda opcion preciona aceptar para actualizar tu confirmacion");
    return;
  }
  
  const invitadoSnap = await db.ref(`asistentes/${data.idAsistente}`).once("value");
  const invitado = invitadoSnap.val();
  
  if (!invitado) {
    alert("Error: Datos no encontrados");
    return;
  }
  
  document.getElementById("datos-actualizacion").style.display = "block";
  document.getElementById("nombre-buscado").textContent = `✨ ${invitado.nombre} ✨`;
  document.getElementById("codigo-buscar").disabled = true;
  
  window.codigoActual = codigo;
  window.idAsistenteActual = data.idAsistente;
  window.acompanantesActuales = invitado.acompanantes || 0;
  
  document.querySelectorAll('.btn-acomp-update').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.acomp) === window.acompanantesActuales) {
      btn.classList.add('active');
    }
  });
});

// Actualizar por código
document.getElementById("btn-actualizar-codigo")?.addEventListener("click", async () => {
  if (!window.codigoActual || !window.idAsistenteActual) {
    alert("Primero busca tu código");
    return;
  }
  
  const btnActivo = document.querySelector('.btn-acomp-update.active');
  const nuevosAcompanantes = btnActivo ? parseInt(btnActivo.dataset.acomp) : 0;
  const nuevoTotal = 1 + nuevosAcompanantes;
  
  await db.ref(`asistentes/${window.idAsistenteActual}`).update({
    acompanantes: nuevosAcompanantes,
    total: nuevoTotal,
    fechaActualizacion: new Date().toISOString()
  });
  
  alert(`✅ ¡Actualizado! Ahora llevas ${nuevosAcompanantes} acompañante(s). Total: ${nuevoTotal} personas`);
  limpiarActualizacion();
  cargarConstelacion();
});

// Cancelar por código
document.getElementById("btn-cancelar-codigo")?.addEventListener("click", async () => {
  if (!window.codigoActual || !window.idAsistenteActual) {
    alert("Primero busca tu código");
    return;
  }
  
  if (!confirm("⚠️ ¿CANCELAR ASISTENCIA? Esta acción es irreversible.")) return;
  
  await db.ref(`asistentes/${window.idAsistenteActual}`).update({
    activo: false,
    fechaCancelacion: new Date().toISOString()
  });
  await db.ref(`codigos/${window.codigoActual}`).update({ activo: false });
  
  alert("❌ Tu asistencia ha sido cancelada.");
  limpiarActualizacion();
  cargarConstelacion();
  if (typeof cargarTablaInvitados === 'function') cargarTablaInvitados();
});

function limpiarActualizacion() {
  document.getElementById("datos-actualizacion").style.display = "none";
  document.getElementById("codigo-buscar").disabled = false;
  document.getElementById("codigo-buscar").value = "";
  window.codigoActual = null;
  window.idAsistenteActual = null;
  window.acompanantesActuales = 0;
}

// Selector de acompañantes para actualización
document.querySelectorAll('.btn-acomp-update').forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll('.btn-acomp-update').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});



});

console.log('🚀 App inicializada con Firebase unificado (invitados + mensajes) en proyecto vxAlondra');



