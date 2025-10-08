document.addEventListener("DOMContentLoaded", () => {
    fetch("https://script.google.com/macros/s/AKfycbwVP_MMdB2QYc-xG2vZMDpmgOrU9CO16jK3sV1Ngx_ruR4sZjgoEp6v1g_daDt4XJZDdA/exec")
        .then(response => response.json())
        .then(json => {
            const productos = json.data;
            let menuUl = document.getElementById("Catalogo");
            productos.forEach(prod => {
                menuUl.innerHTML += `
                    <li>
                        <h3>${prod.Nombre}</h3>
                        <p>${prod.Descripcion}</p>
                        <span>Precio: $${prod.Precio}</span>
                        ${prod.Imagen ? `<img src="${prod.Imagen}" alt="${prod.Nombre}">` : ""}
                        <button class="agregarAlCarrito" data-nombre="${prod.Nombre}" data-precio="${prod.Precio}">+🛒</button>
                    </li>
                `;
            });
            // Asignar eventos a los nuevos botones
            document.querySelectorAll(".agregarAlCarrito").forEach(boton => {
                boton.addEventListener("click", () => {
                    const nombre = boton.getAttribute("data-nombre");
                    const precio = parseInt(boton.getAttribute("data-precio").replace('.', ''));
                    agregarAlCarrito(nombre, precio);
                });
            });
        })
        .catch(error => console.error("Error al cargar API:", error));
});