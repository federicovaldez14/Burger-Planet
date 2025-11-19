const API_URL = "http://localhost:8080/api";

/* =========================================================
                    LOGIN DEL ADMIN
========================================================= */
async function loginAdmin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        window.location.href = "dashboard-admin.html"; 
    } else {
        document.getElementById("msgLogin").textContent =
            "Usuario o contraseña incorrectos";
    }
}

/* =========================================================
                PROTEGER EL DASHBOARD
========================================================= */
if (window.location.pathname.includes("dashboard-admin.html")) {
    verificarSesion();
}

async function verificarSesion() {
    const res = await fetch(`${API_URL}/pedidos`, {
        credentials: "include"
    });

    // Si no hay sesión → vuelve al login
    if (res.status === 401) {
        window.location.href = "login-admin.html";
    } else {
        cargarPedidos();
    }
}

/* =========================================================
                CARGAR PEDIDOS
========================================================= */
async function cargarPedidos(filtroEstado = "todos") {
    const res = await fetch(`${API_URL}/pedidos`, {
        credentials: "include"
    });

    if (res.status === 401) {
        window.location.href = "login-admin.html";
        return;
    }

    const pedidos = await res.json();

    let filtrados = pedidos;

    if (filtroEstado !== "todos") {
        filtrados = pedidos.filter(p => p.estado === filtroEstado.toUpperCase());
    }

    renderPedidos(filtrados);
}

/* =========================================================
             MOSTRAR TABLA DE PEDIDOS
========================================================= */
function renderPedidos(lista) {
    const tbody = document.querySelector("#tablaPedidos tbody");
    tbody.innerHTML = "";

    lista.forEach(p => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.telefono}</td>
            <td>${p.direccion}</td>
            <td>${p.estado}</td>
            <td>
                ${p.items.map(i => `${i.nombreProducto} (x${i.cantidad})`).join("<br>")}
            </td>
            <td>
                ${
                    p.estado === "PENDIENTE"
                        ? `<button onclick="marcarAtendido(${p.id})">Marcar atendido</button>`
                        : "✔ Atendido"
                }
            </td>
        `;

        tbody.appendChild(fila);
    });
}

/* =========================================================
            CAMBIAR ESTADO DEL PEDIDO A ATENDIDO
========================================================= */
async function marcarAtendido(id) {
    await fetch(`${API_URL}/pedidos/${id}/estado?estado=ATENDIDO`, {
        method: "PUT",
        credentials: "include"
    });

    cargarPedidos();
}

/* =========================================================
              BUSCAR PEDIDOS POR CLIENTE
========================================================= */
async function buscarPorCliente() {
    const nombre = document.getElementById("buscarCliente").value.trim().toLowerCase();

    const res = await fetch(`${API_URL}/pedidos`, {
        credentials: "include"
    });

    const pedidos = await res.json();

    const filtrados = pedidos.filter(p =>
        p.cliente.toLowerCase().includes(nombre)
    );

    renderPedidos(filtrados);
}

/* =========================================================
                        LOGOUT REAL
========================================================= */
async function logoutAdmin() {
    await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    window.location.href = "login-admin.html";
}

