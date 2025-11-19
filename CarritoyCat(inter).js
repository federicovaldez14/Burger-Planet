// URL del backend REAL
const API_URL = "http://localhost:8080/api";

let carrito = [];
let preciototal = 0;

// ===================================================
//          CARGAR CARRITO DESDE LOCALSTORAGE
// ===================================================
window.addEventListener("DOMContentLoaded", () => {
    const guardado = localStorage.getItem("carrito");

    if (guardado) {
        carrito = JSON.parse(guardado);

        carrito.forEach(item => {
            preciototal += item.precio * item.cantidad;
        });

        actualizarCarrito();
    }
});

// ===================================================
//      AGREGAR PRODUCTO (usado por asincronismo.js)
// ===================================================
function agregarProductoAlCarrito(id, nombre, precio) {
    precio = parseFloat(precio);

    let existente = carrito.find(p => p.id == id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    preciototal = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    guardarCarrito();
    actualizarCarrito();
    alert(`✅ ${nombre} añadido al carrito`);
}

// ===================================================
//                   ACTUALIZAR CARRITO
// ===================================================
function actualizarCarrito() {
    const lista = document.getElementById("productosdecarrito");
    if (!lista) return;

    lista.innerHTML = "";

    carrito.forEach((producto, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            ${producto.nombre} - $${producto.precio.toLocaleString()} (x${producto.cantidad})
            <button class="btnEliminar">❌</button>
        `;

        li.querySelector(".btnEliminar")
          .addEventListener("click", () => eliminarProducto(index));

        lista.appendChild(li);
    });

    // Agregar total
    let totalLi = document.createElement("li");
    totalLi.style.fontWeight = "bold";
    totalLi.textContent = `Total: $${preciototal.toLocaleString()}`;
    lista.appendChild(totalLi);

    // También actualizar total del HTML si existe
    const totalSpan = document.getElementById("totalCarrito");
    if (totalSpan) totalSpan.innerText = "$" + preciototal.toLocaleString();
}

// ===================================================
//                    ELIMINAR PRODUCTO
// ===================================================
function eliminarProducto(i) {
    const eliminado = carrito[i];
    preciototal -= eliminado.precio * eliminado.cantidad;

    carrito.splice(i, 1);

    guardarCarrito();
    actualizarCarrito();

    alert(`🗑️ ${eliminado.nombre} eliminado`);
}

// ===================================================
//                      VACIAR TODO
// ===================================================
function VaciarCarritodeCompra() {
    carrito = [];
    preciototal = 0;

    guardarCarrito();
    actualizarCarrito();

    alert("🗑️ Carrito vaciado");
}

// ===================================================
//              GUARDAR EN LOCALSTORAGE
// ===================================================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ===================================================
//             ENVIAR PEDIDO AL BACKEND REAL
// ===================================================
async function CompletarCompra() {
    const nombre = document.getElementById("nombreCliente")?.value?.trim();
    const telefono = document.getElementById("telefonoCliente")?.value?.trim();
    const direccion = document.getElementById("direccionCliente")?.value?.trim();

    if (!nombre || !telefono || !direccion) {
        alert("⚠️ Completa todos los datos del cliente.");
        return;
    }

    if (carrito.length === 0) {
        alert("⚠️ El carrito está vacío.");
        return;
    }

    const pedido = {
        cliente: nombre,       // <<< CORREGIDO
        telefono: telefono,    // <<< OK
        direccion: direccion,  // <<< OK
        items: carrito.map(item => ({
            productoId: item.id,
            cantidad: item.cantidad
        }))
    };

    try {
        const res = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        if (!res.ok) {
            alert("⚠️ Error enviando pedido.");
            return;
        }

        alert(`✅ Pedido enviado correctamente. Total: $${preciototal.toLocaleString()}`);

        VaciarCarritodeCompra();

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con el servidor.");
    }
}
