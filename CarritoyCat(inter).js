const API_URL = "http://localhost:8080/api";

let carrito = [];
let preciototal = 0;

// ==============================================
//         CARGAR CARRITO DESDE LOCALSTORAGE
// ==============================================
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

// ========================================================
//           AGREGAR PRODUCTO AL CARRITO
// ========================================================
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

    showToast(`🍔 ${nombre} añadido al carrito`, "success");
}

// ========================================================
//                    ACTUALIZAR CARRITO
// ========================================================
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

    let totalLi = document.createElement("li");
    totalLi.style.fontWeight = "bold";
    totalLi.textContent = `Total: $${preciototal.toLocaleString()}`;
    lista.appendChild(totalLi);

    const totalSpan = document.getElementById("totalCarrito");
    if (totalSpan) totalSpan.innerText = "$" + preciototal.toLocaleString();
}

// ========================================================
//                ELIMINAR PRODUCTO
// ========================================================
function eliminarProducto(i) {
    const eliminado = carrito[i];
    preciototal -= eliminado.precio * eliminado.cantidad;

    carrito.splice(i, 1);

    guardarCarrito();
    actualizarCarrito();

    showToast(`🗑️ ${eliminado.nombre} eliminado`, "info");
}

// ========================================================
//                VACIAR TODO EL CARRITO
// ========================================================
function VaciarCarritodeCompra() {
    carrito = [];
    preciototal = 0;

    guardarCarrito();
    actualizarCarrito();

    showToast("🗑️ Carrito vaciado", "info");
}

// ========================================================
//                GUARDAR CARRITO
// ========================================================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ========================================================
//            ENVIAR PEDIDO AL BACKEND
// ========================================================
async function CompletarCompra() {
    const nombre = document.getElementById("nombreCliente")?.value?.trim();
    const telefono = document.getElementById("telefonoCliente")?.value?.trim();
    const direccion = document.getElementById("direccionCliente")?.value?.trim();

    if (!nombre || !telefono || !direccion) {
        showToast("⚠️ Completa todos los datos del cliente", "error");
        return;
    }

    if (carrito.length === 0) {
        showToast("⚠️ El carrito está vacío", "error");
        return;
    }

    const pedido = {
        cliente: nombre,
        telefono: telefono,
        direccion: direccion,
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
            showToast("❌ Error enviando pedido", "error");
            return;
        }

        showToast(`🛸 Pedido enviado correctamente. Total: $${preciototal.toLocaleString()}`, "success");

        VaciarCarritodeCompra();

    } catch (error) {
        console.error("Error:", error);
        showToast("❌ Error de conexión al servidor", "error");
    }
}

// ========================================================
//                 FUNCIÓN PARA TOASTS
// ========================================================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast", type);

    let icon = "✔";
    if (type === "error") icon = "✖";
    if (type === "info") icon = "ℹ";

    toast.innerHTML = `
        <span class="icon">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}
