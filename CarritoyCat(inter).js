
let carrito = [];
let preciototal=0;

const listaCarrito = document.getElementById("productosdecarrito");
const informacionHamburguesa = document.getElementById("informacionHamburguesa");

document.querySelectorAll("agregarAlCarrito").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.getAttribute("data-nombre");
        const precio = parseInt(boton.getAttribute("data-precio"));

        agregarAlCarrito(nombre, precio);
    });
});

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
    mostrarMensaje(`✅ ${nombre} añadido correctamente`);
    preciototal += precio;
}


function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    carrito.forEach((producto, index) => {
        let li = document.createElement("li");
        li.textContent = `${producto.nombre} - $${producto.precio}`;

        let bEliminar = document.createElement("button");
        bEliminar.textContent = "❌";
        bEliminar.addEventListener("click", () => eliminarProducto(index));

        li.appendChild(bEliminar);
        listaCarrito.appendChild(li);
    });
}

function eliminarProducto(index) {
    const eliminado = carrito[index];
    preciototal -= eliminado.precio;
    carrito=carrito.filter((_, i) => i !== index);
    actualizarCarrito();
    mostrarMensaje(`Producto 🗑️ ${eliminado} eliminado correctamente`);
}

function VaciarCarritodeCompra() {
    carrito = [];
    preciototal = 0;
    actualizarCarrito();
    mostrarMensaje("🗑️ Todos los productos eliminados");
}

function CompletarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("⚠️ No hay productos en el carrito");
        return;
    }else{
        mostrarMensaje("✅ Compra completada con éxito"+ `, total a pagar: $${preciototal}`);
    }
    carrito = [];
    preciototal = 0;
    actualizarCarrito();
}

function mostrarMensaje(texto) {
    console.log(texto)
}
function MostrarPrecio(){
    console.log(`"Precio total: $"${preciototal}`); 
}
function Mouseporencima(){
  informacionHamburguesa.addEventListener("mouseover", (e) => {
  informacionHamburguesa.style.display = "block";
  informacionHamburguesa.style.left = e.pageX + "px";
  informacionHamburguesa.style.top = (e.pageY + 20) + "px"; 
});


    informacionHamburguesa.textContent = "¡Descubre los ingredientes secretos de la hamburguesa así como los de la cangri burguer quieres saber cual es el secreto? es tener el mejor est..........!shhh💡";
}
