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
    carrito.push({ nombre, precio });
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
        li.textContent = `${producto.nombre} - $${producto.precio.toLocaleString()}`;

        let bEliminar = document.createElement("button");
        bEliminar.textContent = "❌";
        bEliminar.addEventListener("click", () => eliminarProducto(index));

        li.appendChild(bEliminar);
        listaCarrito.appendChild(li);
    });

    // Muestra el total
    let totalLi = document.createElement("li");
    totalLi.style.fontWeight = "bold";
    totalLi.textContent = `Total: $${preciototal.toLocaleString()}`;
    listaCarrito.appendChild(totalLi);
}

function eliminarProducto(index) {
    const eliminado = carrito[index];
    preciototal -= eliminado.precio;
    carrito = carrito.filter((_, i) => i !== index);
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje(`Producto 🗑️ ${eliminado.nombre} eliminado correctamente`);
}

function VaciarCarritodeCompra() {
    carrito = [];
    preciototal = 0;
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje("🗑️ Todos los productos eliminados");
}

async function CompletarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("⚠️ No hay productos en el carrito");
        return;
    }

    // Solicitar datos del cliente
    const nombre = prompt("Ingrese su nombre:");
    const telefono = prompt("Ingrese su teléfono:");
    const direccion = prompt("Ingrese su dirección:");

    if (!nombre || !telefono || !direccion) {
        mostrarMensaje("⚠️ Debe ingresar todos los datos del cliente.");
        return;
    }

    // Agrupar productos por nombre para obtener cantidad
    const productosAgrupados = {};
    carrito.forEach(prod => {
        if (!productosAgrupados[prod.nombre]) {
            productosAgrupados[prod.nombre] = { ...prod, cantidad: 1 };
        } else {
            productosAgrupados[prod.nombre].cantidad += 1;
        }
    });

    // Construir arreglo de productos con id, precio y cantidad
    const productosPedido = Object.values(productosAgrupados).map(prod => ({
        id: prod.nombre, // Usa el nombre como id si no tienes un id real
        precio: prod.precio,
        cantidad: prod.cantidad
    }));

    const pedido = {
        nombreCliente: nombre,
        telefonoCliente: telefono,
        direccionCliente: direccion,
        productos: productosPedido,
        valorTotal: preciototal
    };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxKwLI0lNOqRabsZrpIwcnSzvHhuPpLS0BAl3i6nE9KtadhD-Ox6bjRbfII8fOVVGV3ig/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });
        if (response.ok) {  
            mostrarMensaje("✅ Pedido enviado con éxito, total a pagar: $" + preciototal.toLocaleString());
            carrito = [];
            preciototal = 0;
            guardarCarrito();
            actualizarCarrito();
        } else {
            mostrarMensaje("❌ Error al enviar el pedido.");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión al enviar el pedido.");
    }
}

function mostrarMensaje(texto) {
    alert(texto);
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
