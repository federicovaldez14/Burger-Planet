document.addEventListener("DOMContentLoaded", () => {
    fetch("https://script.google.com/macros/s/AKfycbxKwLI0lNOqRabsZrpIwcnSzvHhuPpLS0BAl3i6nE9KtadhD-Ox6bjRbfII8fOVVGV3ig/exec")
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