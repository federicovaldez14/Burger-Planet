const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbysTDJglp8qscqpJ2yshvuPbnsGcF5mrrIaPU6XvdLJxJnd2_P6XDCOyrRI5hU30Sjn/exec";
let carrito = [];
let preciototal = 0;

window.addEventListener("DOMContentLoaded", () => {
    const listaCarrito = document.getElementById("productosdecarrito");
    const guardado = localStorage.getItem("carrito");
    if (guardado) {
        carrito = JSON.parse(guardado);
        preciototal = carrito.reduce((acc, prod) => acc + prod.precio, 0);
        if (listaCarrito) actualizarCarrito();
    }
});

function agregarAlCarrito(nombre, precio) {
    precio = parseFloat(precio);
    carrito.push({ nombre, precio, cantidad: 1 });
    preciototal += precio;
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje(`✅ ${nombre} añadido correctamente`);
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById("productosdecarrito");
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";

    carrito.forEach((producto, index) => {
        let li = document.createElement("li");
        li.textContent = `${producto.nombre} - $${producto.precio.toLocaleString()} (x${producto.cantidad || 1})`;

        let bEliminar = document.createElement("button");
        bEliminar.textContent = "❌";
        bEliminar.addEventListener("click", () => eliminarProducto(index));

        li.appendChild(bEliminar);
        listaCarrito.appendChild(li);
    });

    // total
    let totalLi = document.createElement("li");
    totalLi.style.fontWeight = "bold";
    totalLi.textContent = `Total: $${preciototal.toLocaleString()}`;
    listaCarrito.appendChild(totalLi);
}

function eliminarProducto(index) {
    const eliminado = carrito[index];
    preciototal -= eliminado.precio;
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje(`🗑️ ${eliminado.nombre} eliminado correctamente`);
}

function VaciarCarritodeCompra() {
    carrito = [];
    preciototal = 0;
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje("🗑️ Todos los productos eliminados");
}

function mostrarMensaje(texto) {
    alert(texto);
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ----- ✅ MÉTODO POST FUNCIONAL -----
async function CompletarCompra() {
    const nombre = document.getElementById('nombreCliente')?.value?.trim();
    const telefono = document.getElementById('telefonoCliente')?.value?.trim();
    const direccion = document.getElementById('direccionCliente')?.value?.trim();

    if (!nombre || !telefono || !direccion) {
        alert("Por favor completa todos los campos.");
        return;
    }

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const productosPedido = carrito.map(item => ({
        id: item.id || item.nombre,
        precio: item.precio,
        cantidad: item.cantidad || 1
    }));

    const valorTotal = productosPedido.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // número único de pedido
    const numeroPedido = Math.random().toString(36).substring(2, 9).toUpperCase();

    const pedidoPOST = {
        numero_pedido: numeroPedido,
        fecha: new Date().toISOString(),
        nombre_cliente: nombre,
        telefono_cliente: telefono,
        direccion_cliente: direccion,
        productos: JSON.stringify(productosPedido),
        valor_total: valorTotal
    };

    try {
        await fetch(ENDPOINT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(pedidoPOST)
        });

        mostrarMensaje(`✅ Pedido enviado correctamente.\nTotal: $${valorTotal.toLocaleString('es-CO')}`);

        VaciarCarritodeCompra();

        // Redirige a una página de confirmación (opcional)
        // window.location.href = `confirmacion.html?pedido=${numeroPedido}&total=${valorTotal}`;
    } catch (error) {
        console.error('Error al enviar el pedido:', error);
        alert("⚠️ Error al enviar el pedido. Intenta de nuevo.");
    }
}

// ----- inicio -----
document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
});
