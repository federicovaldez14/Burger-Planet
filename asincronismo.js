// URL de tu backend
const BACKEND_URL = "http://localhost:8080/api";

// Elemento donde se mostrarán los productos
const catalogoUL = document.getElementById("catalogo-lista");

// ==============================
// CARGAR PRODUCTOS DEL BACKEND
// ==============================
async function cargarProductos() {
    try {
        const respuesta = await fetch(`${BACKEND_URL}/productos`);
        const productos = await respuesta.json();

        renderizarCatalogo(productos);

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// ==============================
// MOSTRAR LOS PRODUCTOS EN EL DOM
// ==============================
function renderizarCatalogo(productos) {
    catalogoUL.innerHTML = "";

    productos.forEach(prod => {
        const li = document.createElement("li");
        li.className = "catalogo-item";

        li.innerHTML = `
            <div class="img-wrap">
                <img src="${prod.imagenUrl || 'placeholder.png'}" alt="${prod.nombre}" loading="lazy">
            </div>
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion || ''}</p>
            <div class="precio">Precio: $${Number(prod.precio).toLocaleString()}</div>
            <button class="agregarAlCarrito"
                data-id="${prod.id}"
                data-nombre="${prod.nombre}"
                data-precio="${prod.precio}">
                +🛒
            </button>
        `;

        catalogoUL.appendChild(li);
    });

    activarBotonesCarrito();
}

// ==============================
// ACTIVAR BOTONES DEL CARRITO
// ==============================
function activarBotonesCarrito() {
    const botones = document.querySelectorAll(".agregarAlCarrito");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            agregarProductoAlCarrito(id, nombre, precio);
        });
    });
}

document.addEventListener("DOMContentLoaded", cargarProductos);
