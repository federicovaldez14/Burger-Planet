document.addEventListener("DOMContentLoaded", () => {
    fetch("https://script.google.com/macros/s/AKfycby89fvtVY3e3-xg6bPrEajrxU5JTp-mX6GxjD4wq9ph12vkKxFnj0oR4PTCKT2nXq7FRQ/exec")
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