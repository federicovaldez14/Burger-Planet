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

    // Solo agrega eventos si hay botones (en la página principal)
    document.querySelectorAll(".agregarAlCarrito").forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.getAttribute("data-nombre");
            const precio = parseInt(boton.getAttribute("data-precio").replace('.', ''));
            agregarAlCarrito(nombre, precio);
        });
    });
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

function CompletarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("⚠️ No hay productos en el carrito");
        return;
    } else {
        mostrarMensaje("✅ Compra completada con éxito" + `, total a pagar: $${preciototal.toLocaleString()}`);
    }
    carrito = [];
    preciototal = 0;
    guardarCarrito();
    actualizarCarrito();
}

function mostrarMensaje(texto) {
    alert(texto);
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
