// URL de tu backend
const BACKEND_URL = "https://burger-planet-backend.onrender.com/api";
const catalogoUL = document.getElementById("catalogo-lista");

let productosGlobal = []; // almacena la lista completa

// ==============================
// CARGAR PRODUCTOS DEL BACKEND
// ==============================
async function cargarProductos() {
    try {
        const respuesta = await fetch(`${BACKEND_URL}/productos`);
        if (!respuesta.ok) throw new Error("Error al cargar productos");
        const productos = await respuesta.json();

        // guardamos globalmente y renderizamos
        productosGlobal = Array.isArray(productos) ? productos : [];
        renderizarCatalogo(productosGlobal);
        activarFiltros(); // preparar listeners de filtros
    } catch (error) {
        console.error(error);
        showToast("No se pudieron cargar los productos", "error");
    }
}

// ==============================
// MOSTRAR LOS PRODUCTOS EN EL DOM
// ==============================
function renderizarCatalogo(productos = productosGlobal) {
    catalogoUL.innerHTML = "";

    productos.forEach(prod => {
        const li = document.createElement("li");
        li.className = "catalogo-item";

        // normalizamos precio si viene string con puntos
        const precio = Number(String(prod.precio || 0).replace(/\./g, "").replace(",", "."));

        li.innerHTML = `
            <div class="img-wrap">
                <img src="${prod.imagenUrl || 'placeholder.png'}" alt="${prod.nombre}" loading="lazy">
            </div>
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion || ''}</p>
            <div class="precio">Precio: $${precio.toLocaleString()}</div>
            <button class="agregarAlCarrito"
                data-id="${prod.id}"
                data-nombre="${prod.nombre}"
                data-precio="${precio}">
                +🛒
            </button>
        `;

        catalogoUL.appendChild(li);
    });

    activarBotonesCarrito(); // reactivar listeners después de render
}

// Normaliza strings para comparar (quita tildes/diacríticos y lower-case)
function normalizeString(s) {
    if (!s) return "";
    return s.toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // elimina diacríticos
            .toLowerCase()
            .trim();
}

// ==============================
// ACTIVAR BOTONES DEL CARRITO
// ==============================
function activarBotonesCarrito() {
    const botones = document.querySelectorAll(".agregarAlCarrito");

    botones.forEach(boton => {
        boton.removeEventListener("click", () => {}); // evita duplicados
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            agregarProductoAlCarrito(id, nombre, precio);
        });
    });
}

// ==============================
// ACTIVAR FILTROS
// ==============================
function activarFiltros() {
    const filtros = document.querySelectorAll(".filter-btn");
    if (!filtros.length) return;

    filtros.forEach(btn => {
        btn.addEventListener("click", () => {
            filtros.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const categoriaRaw = btn.dataset.category || "todos";
            const filtroNorm = normalizeString(categoriaRaw);

            const filtrados = filtroNorm === "todos"
                ? productosGlobal
                : productosGlobal.filter(p => {
                    const catProd = normalizeString(p.categoria || "");
                    // compara igualdad o contención para evitar singular/plural
                    return catProd === filtroNorm || catProd.includes(filtroNorm) || filtroNorm.includes(catProd);
                });

            renderizarCatalogo(filtrados);
        });
    });
}

document.addEventListener("DOMContentLoaded", cargarProductos);
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast", type);

    // Íconos
    let icon = "✔";
    if (type === "error") icon = "✖";
    if (type === "info") icon = "ℹ";

    toast.innerHTML = `
        <span class="icon">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Eliminar después de la animación
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

