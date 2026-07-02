// ===== DATOS =====
const productos = [
    { id: 1, nombre: "Minecraft", precio: 100, categoria: "indies", imagen: "img/minecraft.jpg" },
    { id: 2, nombre: "Valorant", precio: 0, categoria: "gratis", imagen: "img/valorant.webp" },
    { id: 3, nombre: "DLC Mario", precio: 50, categoria: "dlc", imagen: "img/dlc-mario.avif" },
    { id: 4, nombre: "Man Adventure", precio: 240, categoria: "indies", imagen: "img/ManAdventure.webp" },
    { id: 5, nombre: "Super Mario Ballin", precio: 300, categoria: "indies", imagen: "img/SuperMarioBallin.jpg" },
    { id: 6, nombre: "Hollow Knight", precio: 150, categoria: "indies", imagen: "img/Hollow Knight.jpg" },
    { id: 7, nombre: "Fortnite", precio: 0, categoria: "gratis", imagen: "img/Fornite.jpg" },
    { id: 8, nombre: "DLC Skyrim", precio: 80, categoria: "dlc", imagen: "img/DLC Skyrim.jpg" },
    { id: 9, nombre: "God of War", precio: 200, categoria: "accion", imagen: "img/God of War.jpg" },
    { id: 10, nombre: "Zelda TOTK", precio: 350, categoria: "aventura", imagen: "img/Zelda TOTK.avif" },
];

const carrito = JSON.parse(localStorage.getItem("carrito_ducksnipe")) || []; // Recuperar carrito del localStorage
let descuento = false;

// ===== FILTRADO =====
function filtrar() {
    const cat = document.getElementById("filtro-cat").value;
    const busq = document.getElementById("filtro-busqueda").value.toLowerCase().trim();
    const ord = document.getElementById("orden").value;
    
    let datos = productos.filter(p => (cat === "" || p.categoria === cat) && p.nombre.toLowerCase().includes(busq));
    
    if (ord === "nombre") datos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (ord === "precio-asc") datos.sort((a, b) => a.precio - b.precio);
    if (ord === "precio-desc") datos.sort((a, b) => b.precio - a.precio);
    
    return datos;
}

// ===== MOSTRAR CATÁLOGO =====
function mostrarCatalogo() {
    const cont = document.getElementById("catalogo");
    const datos = filtrar();
    
    if (!datos.length) {
        cont.innerHTML = `<div class="col-12 text-center py-4"><p class="vacio">No hay productos</p></div>`;
        return;
    }
    
    cont.innerHTML = datos.map(p => `
        <div class="col">
            <div class="card-producto">
                <img src="${p.imagen || 'img/placeholder.jpeg'}" class="game-img" alt="${p.nombre}">
                <div class="card-body">
                    <h6 class="card-title">${p.nombre}</h6>
                    <small class="text-secondary">${p.categoria}</small>
                    <p class="precio">S/${p.precio.toFixed(2)}</p>
                    <button class="btn-agregar" onclick="agregar(${p.id})"><i class="bi bi-cart-plus"></i> Agregar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== CARRITO =====
function agregar(id) {
    const p = productos.find(x => x.id === id);
    const existe = carrito.find(x => x.id === id);
    existe ? existe.cantidad++ : carrito.push({ ...p, cantidad: 1 });
    actualizarCarrito();
}

function sumar(id) { const p = carrito.find(x => x.id === id); if(p) p.cantidad++; actualizarCarrito(); }
function restar(id) {
    const p = carrito.find(x => x.id === id);
    if(p) { p.cantidad--; if(p.cantidad===0) carrito.splice(carrito.indexOf(p),1); actualizarCarrito(); }
}
function eliminar(id) {
    const idx = carrito.findIndex(x => x.id === id);
    if(idx !== -1) { carrito.splice(idx, 1); actualizarCarrito(); }
}

function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    if(!carrito.length) {
        lista.innerHTML = `<li class="text-center text-secondary py-3"><i class="bi bi-cart-x"></i> Vacío</li>`;
        return;
    }
    lista.innerHTML = carrito.map(p => `
        <li class="item-carrito">
            <div><strong>${p.nombre}</strong><br><small>S/${p.precio.toFixed(2)}</small></div>
            <div class="d-flex align-items-center gap-1">
                <button class="btn-cantidad" onclick="restar(${p.id})">−</button>
                <span style="min-width:20px;text-align:center;">${p.cantidad}</span>
                <button class="btn-cantidad" onclick="sumar(${p.id})">+</button>
                <button class="btn-cantidad eliminar" onclick="eliminar(${p.id})">✕</button>
            </div>
            <span class="text-primary fw-bold">S/${(p.precio*p.cantidad).toFixed(2)}</span>
        </li>
    `).join('');
}

function calcularTotal() {
    let total = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0);
    return descuento && total > 0 ? total * 0.9 : total;
}

function actualizarTotal() {
    let totalBase = calcularTotal();
    let subtotal = totalBase / 1.18; // Subtotal sin IGV
    let igv = totalBase - subtotal; // IGV (18%)

    document.getElementById("subtotal-display").textContent = `S/${subtotal.toFixed(2)}`;
    document.getElementById("igv-display").textContent = `S/${igv.toFixed(2)}`;
    document.getElementById("total-final").textContent = `S/${calcularTotal().toFixed(2)}`;
    const items = carrito.reduce((a, p) => a + p.cantidad, 0);
    document.getElementById("contador-carrito").textContent = items;
    document.getElementById("contador-items").textContent = items;
}

function actualizarCarrito() {
    mostrarCarrito();
    actualizarTotal();
    localStorage.setItem("carrito_ducksnipe", JSON.stringify(carrito)); // Guardar carrito en localStorage
}

// ===== PANTALLA DE COMPRA =====
function verCarrito() {
    document.getElementById("seccion-catalogo").style.display = "none";
    document.getElementById("seccion-carrito").style.display = "none";
    document.getElementById("pantalla-compra").style.display = "block";
    
    const cont = document.getElementById("productos-compra");
    if(!carrito.length) {
        cont.innerHTML = `<div class="col-12 text-center py-4"><p class="vacio">Carrito vacío</p></div>`;
        document.getElementById("total-compra").textContent = "Total: S/0.00";
        return;
    }
    cont.innerHTML = carrito.map(p => `
        <div class="col">
            <div class="card-producto">
                <img src="${p.imagen || 'img/placeholder.jpeg'}" class="game-img" alt="${p.nombre}">
                <div class="card-body">
                    <h6>${p.nombre}</h6>
                    <p>Cantidad: ${p.cantidad}</p>
                    <p class="precio">S/${(p.precio*p.cantidad).toFixed(2)}</p>
                </div>
            </div>
        </div>
    `).join('');
    const totalBase = calcularTotal();
    const subtotal = totalBase / 1.18;
    const igv = totalBase - subtotal;
    document.getElementById("subtotal-compra").textContent = `S/${subtotal.toFixed(2)}`;
    document.getElementById("igv-compra").textContent = `S/${igv.toFixed(2)}`;
    document.getElementById("total-compra").textContent = `Total: S/${calcularTotal().toFixed(2)}`;
}

function volver() {
    document.getElementById("seccion-catalogo").style.display = "block";
    document.getElementById("seccion-carrito").style.display = "block";
    document.getElementById("pantalla-compra").style.display = "none";
}

function comprar() {
    if(!carrito.length) return alert("Carrito vacío");
    mostrarToast(`✅ Compra realizada con éxito. Total: S/${calcularTotal().toFixed(2)}`);    carrito.length = 0;
    descuento = false;
    localStorage.removeItem("carrito_ducksnipe"); // Limpiar carrito del localStorage
    actualizarCarrito();
    volver();
}

// ===== DESCUENTO =====
function toggleDescuento() {
    descuento = !descuento;
    actualizarCarrito();
    document.getElementById("btn-descuento").textContent = descuento ? '❌ Quitar descuento' : '💸 Descuento 10%';
    if(descuento) mostrarToast('✅ Descuento del 10% aplicado');
}

// ===== LIMPIAR FILTROS =====
function limpiarFiltros() {
    document.getElementById("filtro-cat").value = "";
    document.getElementById("filtro-busqueda").value = "";
    document.getElementById("orden").value = "nombre";
    mostrarCatalogo();
}

// ===== PANTALLA DE LOGIN =====
function mostrarPantallaLogin() {
    document.getElementById("seccion-catalogo").style.display = "none";
    document.getElementById("seccion-carrito").style.display = "none";
    document.getElementById("pantalla-compra").style.display = "none";
    document.getElementById("pantalla-login").style.display = "block";
}

//===== VOLVER DE LOGIN =====
function volverDeLogin() {
    document.getElementById("seccion-catalogo").style.display = "block";
    document.getElementById("seccion-carrito").style.display = "block";
    document.getElementById("pantalla-login").style.display = "none";
}

// ===== ALERTA DE MENSAJE DE PRÓXIMAMENTE =====
function mensajeProximamente(opcion) {
    alert(`ℹ️ La opción de iniciar con ${opcion} estará disponible en próximas actualizaciones.`);
}
// Función que evalúa y autocompleta el correo
function procesarIngreso(event) {
    // Si event existe, prevenimos cualquier comportamiento automático del navegador
    if (event) event.preventDefault();

    const inputCorreo = document.getElementById("usuario-email");
    const inputPass = document.getElementById("usuario-pass");
    
    let textoCorreo = inputCorreo.value.replace(/\s+/g, '');
    let textoPass = inputPass.value.trim();

    // AQUÍ ESTÁ EL TRUCO: 
    // Solo validamos si los campos están realmente vacíos al momento de presionar el botón.
    // Si el usuario simplemente está navegando por la página, esta función ni siquiera se dispara.
    if (textoCorreo === "" || textoPass === "") {
        alert("❌ Faltan campos por completar.");
        return;
    }

    // Autocompletado
    if (!textoCorreo.includes("@")) {
        textoCorreo = textoCorreo + "@gmail.com";
        inputCorreo.value = textoCorreo;
    }

    let nombreLimpio = textoCorreo.split("@")[0];
    
    mostrarToast(`👋 ¡Bienvenido, ${nombreLimpio}!`);
    volverDeLogin();
}

function mostrarToast(mensaje) {
    const toastElement = document.getElementById('liveToast');
    const toastBody = document.getElementById('toast-mensaje');
    
    // Cambiamos el texto y mostramos el toast
    toastBody.textContent = mensaje;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// ===== EVENTOS =====
document.getElementById("filtro-cat").addEventListener("change", mostrarCatalogo);
document.getElementById("filtro-busqueda").addEventListener("input", mostrarCatalogo);
document.getElementById("orden").addEventListener("change", mostrarCatalogo);
document.getElementById("btn-ir-carrito").addEventListener("click", verCarrito);
document.getElementById("btn-comprar").addEventListener("click", comprar);
document.getElementById("btn-volver").addEventListener("click", volver);
document.getElementById("btn-descuento").addEventListener("click", toggleDescuento);
document.getElementById("btn-limpiar").addEventListener("click", limpiarFiltros);

// ===== INICIO =====
mostrarCatalogo();
actualizarCarrito();