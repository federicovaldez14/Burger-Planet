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

async function CompletarCompra() {

    const nombre = document.getElementById("nombreCliente").value.trim();
    const telefono = document.getElementById("telefonoCliente").value.trim();
    const direccion = document.getElementById("direccionCliente").value.trim();

  if (!nombre || !telefono || !direccion) {
    alert("Por favor completa todos los campos del cliente antes de finalizar la compra.");
    return;
  }

  
  const Carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  if (Carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  
  const pedido = {
    nombre: nombre,
    telefono: telefono,
    direccion: direccion,
    productos: carrito.map(item => ({
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad
    })),
    total: total
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwVP_MMdB2QYc-xG2vZMDpmgOrU9CO16jK3sV1Ngx_ruR4sZjgoEp6v1g_daDt4XJZDdA/exec", {
      method: "POST",
      body: JSON.stringify(pedido),
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    if (data.result === "success") {
      alert(" Pedido enviado correctamente. ¡Gracias por tu compra! ");
      localStorage.removeItem("Carrito"); 
      document.getElementById("productosdecarrito").innerHTML = ""; 
    } else {
      alert(" Error al enviar el pedido. Intenta de nuevo.");
    }
  } catch (error) {
    console.error(" Error al enviar el pedido:", error);
    alert(" Error al conectar con el servidor.");
  }
}

function mostrarCarrito() {
    const Carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
    const lista = document.getElementById("productosdecarrito");
    lista.innerHTML = "";

    Carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;
    lista.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", mostrarCarrito);// lo llama al cargar la pagina para que se muestre el carrito 

