const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxF_eZ079VEJndMU67DFCDSLuRAojse1iTJXKpTjGBw-dQ6GJR7-kQc12YINqMtw3VAvQ/exec";
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
    carrito.push({ nombre, precio });
    preciototal += precio;
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje(`✅ ${nombre} añadido correctamente`);

    let Carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
    const productoExistente = Carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
    productoExistente.cantidad++;
    } else {
    Carrito.push({ nombre, precio, cantidad: 1 });
    }

    localStorage.setItem("Carrito", JSON.stringify(Carrito));
    mostrarCarrito();
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

// ----- enviar pedido -----
async function CompletarCompra() {
  const nombre = document.getElementById("nombreCliente")?.value?.trim();
  const telefono = document.getElementById("telefonoCliente")?.value?.trim();
  const direccion = document.getElementById("direccionCliente")?.value?.trim();

  if (!nombre || !telefono || !direccion) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const productos = carrito.map(it => ({
    id: it.id || it.nombre,
    precio: it.precio,
    cantidad: it.cantidad
  }));
  const total = productos.reduce((s, it) => s + it.precio * it.cantidad, 0);

  const pedido = { nombre, telefono, direccion, productos, total };

  try {
    const res = await fetch(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido)
    });
    const json = await res.json();
    if (json.result === "success" || res.ok) {
      alert("✅ Pedido enviado correctamente.");
      VaciarCarritodeCompra();
    } else {
      console.error("Respuesta del servidor:", json);
      alert("❌ Error al enviar el pedido.");
    }
  } catch (err) {
    console.error("Error de red:", err);
    alert("⚠️ No se pudo conectar con el servidor.");
  }
}

// ----- inicio -----
document.addEventListener("DOMContentLoaded", () => {
  cargarDesdeStorage();
  mostrarCarrito();
});
document.addEventListener("DOMContentLoaded", mostrarCarrito);// lo llama al cargar la pagina para que se muestre el carrito 

