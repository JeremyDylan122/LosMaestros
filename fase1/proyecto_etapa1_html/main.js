
/**
 * ====================================================================
 * FERRETERÍA LOS MAESTROS - LÓGICA DE APLICACIÓN (VANILLA JAVASCRIPT)
 * Single Page Application (SPA)
 * ====================================================================
 */

/* ====================================================================
   1. DATOS BASE (CATÁLOGO, BLOGS Y UBICACIONES)
   ==================================================================== */

// Selección de seis productos del Excel del caso: precios de venta en CLP.
// Las fotografías son referenciales; marca, unidad y existencias provienen del catálogo.
const productos = [
    {
        id: 1,
        nombre: 'Cemento Polpaico gris 25 kg',
        codigo: 'MC001',
        precio: 5990,
        stock: 80,
        categoria: 'Mat. Construcción',
        subcategoria: 'Cementos',
        marca: 'Polpaico',
        unidad: 'Saco',
        descripcion: 'Cemento gris Polpaico, presentado en saco de 25 kg.',
        imagen: './assets/img/productos/cemento.jpg',
        imagenAlt: 'Sacos de cemento apilados (imagen referencial)'
    },
    {
        id: 2,
        nombre: 'Pintura látex interior 1 galón blanco',
        codigo: 'PT001',
        precio: 9990,
        stock: 40,
        categoria: 'Pinturas',
        subcategoria: 'Látex',
        marca: 'Sipa',
        unidad: 'Galón',
        descripcion: 'Pintura látex Sipa para interior, color blanco, en envase de un galón.',
        imagen: './assets/img/productos/pintura.jpg',
        imagenAlt: 'Envase de pintura con brocha (imagen referencial)'
    },
    {
        id: 3,
        nombre: 'Martillo carpintero 500g',
        codigo: 'HM001',
        precio: 7990,
        stock: 20,
        categoria: 'Herramientas',
        subcategoria: 'Manuales',
        marca: 'Stanley',
        unidad: 'Unidad',
        descripcion: 'Martillo carpintero Stanley de 500 g, vendido por unidad.',
        imagen: './assets/img/productos/martillo.jpg',
        imagenAlt: 'Martillo de carpintero (imagen referencial)'
    },
    {
        id: 4,
        nombre: 'Taladro percutor 650W 13mm',
        codigo: 'HE001',
        precio: 79990,
        stock: 8,
        categoria: 'Herramientas',
        subcategoria: 'Eléctricas',
        marca: 'Makita',
        unidad: 'Unidad',
        descripcion: 'Taladro percutor Makita de 650 W y 13 mm, vendido por unidad.',
        imagen: './assets/img/productos/taladro.jpg',
        imagenAlt: 'Taladro eléctrico de referencia (imagen referencial)'
    },
    {
        id: 5,
        nombre: 'Cañería PVC 1/2" x 6m',
        codigo: 'GS001',
        precio: 5490,
        stock: 30,
        categoria: 'Gasfitería',
        subcategoria: 'Tuberías',
        marca: 'Tigre',
        unidad: 'Unidad',
        descripcion: 'Cañería PVC Tigre de 1/2 pulgada y 6 metros de largo.',
        imagen: './assets/img/productos/tuberia-pvc.jpg',
        imagenAlt: 'Tubos de PVC (imagen referencial)'
    },
    {
        id: 6,
        nombre: 'Casco seguridad blanco',
        codigo: 'SE001',
        precio: 6990,
        stock: 15,
        categoria: 'Seguridad',
        subcategoria: 'EPP',
        marca: '3M',
        unidad: 'Unidad',
        descripcion: 'Casco de seguridad 3M de color blanco, vendido por unidad.',
        imagen: './assets/img/productos/casco.jpg',
        imagenAlt: 'Casco de seguridad blanco (imagen referencial)'
    }
];

// Noticias de blog especializadas
const blogs = [
    {
        id: 1,
        titulo: 'Consejos para preparar mezclas de concreto de alta resistencia',
        fecha: '05 de Septiembre, 2026',
        autor: 'Don Carlos Vega (Maestro Constructor)',
        resumen: 'Aprende las proporciones ideales de cemento, arena y agua para lograr cimientos firmes y duraderos.',
        contenido: `El concreto es la base estructural de toda edificación. Lograr una mezcla con la resistencia adecuada depende directamente de la dosificación y la calidad de los materiales:

1. Proporción clásica (1:2:3): Para cimientos y sobrecimientos estándar se suele utilizar 1 parte de cemento, 2 de arena limpia de río y 3 de grava o gravilla.
2. Control estricto del agua: Uno de los errores más comunes es añadir exceso de agua para que sea más fácil trabajarlo. El exceso de agua debilita la resistencia mecánica final y provoca fisuras al fraguar. La mezcla debe quedar plástica y homogénea, nunca líquida.
3. El curado es vital: Mantén húmedo el concreto durante al menos los primeros 7 días posteriores al vaciado. El agua favorece la reacción química de hidratación del cemento.`
    },
    {
        id: 2,
        titulo: 'Guía de mantenimiento preventivo para herramientas eléctricas',
        fecha: '01 de Septiembre, 2026',
        autor: 'Ricardo Valdés (Servicio Técnico)',
        resumen: 'Prolonga la vida útil de tus taladros, esmeriles y sierras con sencillos cuidados diarios.',
        contenido: `Las herramientas eléctricas son la mayor inversión de un maestro o contratista. Con un mantenimiento preventivo periódico puedes triplicar su durabilidad:

1. Limpieza tras cada jornada: El polvo del cemento y yeso es altamente abrasivo para los rodamientos y el inducido. Utiliza aire comprimido o una brocha seca para despejar las ranuras de ventilación del motor.
2. Inspección de carbones: Cuando notes chispas excesivas o pérdida repentina de potencia, revisa el desgaste de las escobillas de carbón. Reemplázalas antes de que dañen el colector del motor.
3. Cuidado de cables y enchufes: Jamás desconectes jalando el cable. Revisa periódicamente que no existan cortes o desgastes en el aislante para prevenir cortocircuitos en obra.`
    }
];

// Regiones y comunas para el registro
const regionesYComunas = {
    'Región de Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña', 'Salamanca'],
    'Región Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'Puente Alto', 'San Bernardo'],
    'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota'],
    'Región de Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones']
};

/* ====================================================================
   2. NAVEGACIÓN SIMPLE (SPA)
   ==================================================================== */

/**
 * Oculta todas las secciones de la vista principal y muestra la solicitada
 * @param {string} sectionId - ID de la sección a mostrar
 */
function showSection(sectionId) {
    // 1. Ocultar todas las secciones
    const sections = document.querySelectorAll('main > section');
    sections.forEach(sec => sec.classList.remove('active'));

    // 2. Mostrar la sección activa
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 3. Actualizar el estilo activo en el navbar
    const navLinks = document.querySelectorAll('.navbar-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Si la vista es el carrito, renderizar su estado actual
    if (sectionId === 'carrito') {
        renderCarrito();
    }

    // 5. Desplazar suavemente arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hacer showSection accesible globalmente para eventos onclick en HTML
window.showSection = showSection;

/* ====================================================================
   3. GESTIÓN DEL CARRITO CON LOCALSTORAGE
   ==================================================================== */

// La versión evita mezclar los productos anteriores con el catálogo del caso.
// El carrito anterior se conserva en su clave original.
const CLAVE_CARRITO = 'los_maestros_carrito_v2';

/**
 * Obtiene el carrito almacenado en localStorage
 * @returns {Array} Arreglo con los ítems del carrito
 */
function obtenerCarrito() {
    try {
        const datos = localStorage.getItem(CLAVE_CARRITO);
        return datos ? JSON.parse(datos) : [];
    } catch (e) {
        console.error('Error al recuperar carrito de localStorage:', e);
        return [];
    }
}

/**
 * Guarda el carrito en localStorage y refresca el contador del navbar
 * @param {Array} carrito - Arreglo con los ítems a persistir
 */
function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (e) {
        console.error('Error al guardar carrito en localStorage:', e);
    }
    actualizarContadorCarrito();
}

/**
 * Actualiza el badge numérico en el enlace del Carrito en el navbar
 */
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contadorEl = document.getElementById('cart-counter');
    if (contadorEl) {
        contadorEl.textContent = totalCantidad;
    }
}

/**
 * Agrega un producto al carrito respetando el stock disponible
 * @param {number} idProducto - ID del producto a añadir
 */
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;

    // Comprobar disponibilidad también al incorporar el producto por primera vez.
    if (producto.stock <= 0) {
        alert(`No hay stock disponible para ${producto.nombre}.`);
        return;
    }

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad += 1;
        } else {
            alert(`Stock máximo alcanzado para ${producto.nombre} (${producto.stock} unidades).`);
            return;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            codigo: producto.codigo,
            precio: producto.precio,
            stock: producto.stock,
            unidad: producto.unidad,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    alert(`"${producto.nombre}" fue agregado al carrito.`);
}
window.agregarAlCarrito = agregarAlCarrito;

/**
 * Modifica la cantidad de un ítem en el carrito (+1 o -1)
 * @param {number} idProducto
 * @param {number} delta - Variación (+1 o -1)
 */
function modificarCantidad(idProducto, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(p => p.id === idProducto);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(idProducto);
        return;
    }

    if (item.cantidad > item.stock) {
        alert(`No es posible agregar más. Stock disponible: ${item.stock} unidades.`);
        item.cantidad = item.stock;
    }

    guardarCarrito(carrito);
    renderCarrito();
}
window.modificarCantidad = modificarCantidad;

/**
 * Elimina completamente un producto del carrito
 * @param {number} idProducto
 */
function eliminarDelCarrito(idProducto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarCarrito(carrito);
    renderCarrito();
}
window.eliminarDelCarrito = eliminarDelCarrito;

/**
 * Vacía todos los elementos del carrito tras confirmación
 */
function vaciarCarrito() {
    if (confirm('¿Deseas vaciar todos los productos del carrito?')) {
        guardarCarrito([]);
        renderCarrito();
    }
}
window.vaciarCarrito = vaciarCarrito;

/**
 * Simula la finalización de compra, muestra mensaje de éxito y limpia el carrito
 */
function finalizarCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    const alerta = document.getElementById('alerta-carrito');
    if (alerta) {
        alerta.style.display = 'block';
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 4000);
    }

    guardarCarrito([]);
    renderCarrito();
}
window.finalizarCompra = finalizarCompra;

/* ====================================================================
   4. RENDERIZADO DINÁMICO (PRODUCTOS, BLOGS Y CARRITO)
   ==================================================================== */

/**
 * Renderiza dinámicamente las tarjetas de productos en la sección Catálogo
 */
function renderProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = productos.map(prod => `
        <article class="card">
            <img class="product-image" src="${prod.imagen}" alt="${prod.imagenAlt}"
                width="640" height="400" loading="lazy" decoding="async">
            <span class="product-category">${prod.categoria} / ${prod.subcategoria}</span>
            <h3 class="card-title">${prod.nombre}</h3>
            <p class="product-description">${prod.descripcion}</p>
            <p class="product-meta">Marca: <strong>${prod.marca}</strong> | Código: <strong>${prod.codigo}</strong></p>
            <p class="product-meta">Stock: <strong>${prod.stock}</strong> | Unidad de venta: <strong>${prod.unidad}</strong></p>
            <span class="card-price">$${prod.precio.toLocaleString('es-CL')}</span>
            <button class="btn btn-primary" onclick="agregarAlCarrito(${prod.id})">
                Agregar al Carrito
            </button>
        </article>
    `).join('');
}

/**
 * Renderiza la lista de blogs (noticias)
 */
function renderBlogs() {
    const contenedor = document.getElementById('contenedor-blogs');
    if (!contenedor) return;

    contenedor.innerHTML = blogs.map(blog => `
        <article class="card">
            <span class="blog-date">Publicado: ${blog.fecha}</span>
            <h3 class="card-title">${blog.titulo}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">
                ${blog.resumen}
            </p>
            <button class="btn btn-secondary" onclick="verDetalleBlog(${blog.id})" style="align-self: flex-start;">
                Leer Noticia Completa
            </button>
        </article>
    `).join('');
}

/**
 * Muestra el artículo completo en la vista Detalle Blog
 * @param {number} id - ID del blog a leer
 */
function verDetalleBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const tituloEl = document.getElementById('detalle-blog-titulo');
    const metaEl = document.getElementById('detalle-blog-meta');
    const cuerpoEl = document.getElementById('detalle-blog-cuerpo');

    if (tituloEl && metaEl && cuerpoEl) {
        tituloEl.textContent = blog.titulo;
        metaEl.textContent = `Fecha: ${blog.fecha} | Autor: ${blog.autor}`;
        cuerpoEl.textContent = blog.contenido;
    }

    showSection('detalle-blog');
}
window.verDetalleBlog = verDetalleBlog;

/**
 * Renderiza la tabla de productos y el total a pagar en la vista Carrito
 */
function renderCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) return;

    const carrito = obtenerCarrito();

    // Si no hay productos en el carrito
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div style="background: var(--bg-surface); padding: 3rem; text-align: center; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                <h3 style="color: var(--color-secondary); margin-bottom: 1rem;">Tu carrito está actualmente vacío</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Explora nuestro catálogo y agrega los materiales que necesitas para tu obra.</p>
                <button class="btn btn-primary" onclick="showSection('productos')">Ver Catálogo de Productos</button>
            </div>
        `;
        return;
    }

    // Calcular totales y generar filas
    let totalPagar = 0;
    const filasHtml = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;
        return `
            <tr>
                <td>
                    <strong>${item.nombre}</strong><br>
                    <small style="color: var(--text-muted);">Cód: ${item.codigo} | Unidad de venta: ${item.unidad}</small>
                </td>
                <td>$${item.precio.toLocaleString('es-CL')}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button class="btn btn-secondary btn-sm" onclick="modificarCantidad(${item.id}, -1)">-</button>
                        <span style="font-weight: 600; min-width: 1.5rem; text-align: center;">${item.cantidad}</span>
                        <button class="btn btn-secondary btn-sm" onclick="modificarCantidad(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight: 600; color: var(--color-secondary);">$${subtotal.toLocaleString('es-CL')}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');

    contenedor.innerHTML = `
        <div class="table-responsive">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasHtml}
                </tbody>
            </table>
        </div>

        <div class="cart-total-box">
            <button class="btn btn-secondary" onclick="vaciarCarrito()">
                Vaciar Carrito
            </button>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
                <span style="font-size: 1.25rem; font-weight: bold; color: var(--color-secondary);">
                    Total a Pagar: <span style="color: var(--color-primary); font-size: 1.6rem;">$${totalPagar.toLocaleString('es-CL')}</span>
                </span>
                <button class="btn btn-primary" onclick="finalizarCompra()">
                    Finalizar Compra
                </button>
            </div>
        </div>
    `;
}

/* ====================================================================
   5. VALIDACIONES DE FORMULARIOS (REGLAS DE NEGOCIO)
   ==================================================================== */

/**
 * Valida un correo según la regla: obligatorio, max 100 caracteres
 * y dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com
 * @param {string} email
 * @returns {boolean}
 */
function esEmailValido(email) {
    if (!email) return false;
    const valor = email.trim().toLowerCase();
    if (valor.length === 0 || valor.length > 100) return false;

    // Formato general de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(valor)) return false;

    // Verificar dominios permitidos
    const partes = valor.split('@');
    if (partes.length !== 2) return false;

    const dominio = '@' + partes[1];
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

    return dominiosPermitidos.includes(dominio);
}

/**
 * Muestra u oculta mensaje de error
 * @param {string} idElementoError - ID del elemento span con clase error-message
 * @param {boolean} mostrar - true para mostrar error, false para ocultar
 */
function setMensajeError(idElementoError, mostrar) {
    const errorEl = document.getElementById(idElementoError);
    if (!errorEl) return;
    if (mostrar) {
        errorEl.classList.add('show-error');
    } else {
        errorEl.classList.remove('show-error');
    }
}

/**
 * Inicializa la validación del formulario de Contacto
 */
function initFormContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let esValido = true;

        const nombre = document.getElementById('contacto-nombre').value.trim();
        const email = document.getElementById('contacto-email').value.trim();
        const comentario = document.getElementById('contacto-comentario').value.trim();

        // Regla: Nombre obligatorio (max 100)
        if (nombre === '' || nombre.length > 100) {
            setMensajeError('error-contacto-nombre', true);
            esValido = false;
        } else {
            setMensajeError('error-contacto-nombre', false);
        }

        // Regla: Correo obligatorio con dominios permitidos (max 100)
        if (!esEmailValido(email)) {
            setMensajeError('error-contacto-email', true);
            esValido = false;
        } else {
            setMensajeError('error-contacto-email', false);
        }

        // Regla: Comentario obligatorio (max 500)
        if (comentario === '' || comentario.length > 500) {
            setMensajeError('error-contacto-comentario', true);
            esValido = false;
        } else {
            setMensajeError('error-contacto-comentario', false);
        }

        if (esValido) {
            const alerta = document.getElementById('alerta-contacto');
            if (alerta) {
                alerta.style.display = 'block';
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 4000);
            }
            form.reset();
        }
    });
}

/**
 * Inicializa la validación del formulario de Login (Iniciar Sesión)
 */
function initFormLogin() {
    const form = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let esValido = true;

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Regla: Correo obligatorio (solo @duoc.cl, @profesor.duoc.cl, @gmail.com, max 100)
        if (!esEmailValido(email)) {
            setMensajeError('error-login-email', true);
            esValido = false;
        } else {
            setMensajeError('error-login-email', false);
        }

        // Regla: Contraseña obligatoria, entre 4 y 10 caracteres
        if (!password || password.length < 4 || password.length > 10) {
            setMensajeError('error-login-password', true);
            esValido = false;
        } else {
            setMensajeError('error-login-password', false);
        }

        if (esValido) {
            const alerta = document.getElementById('alerta-login');
            if (alerta) {
                alerta.style.display = 'block';
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 4000);
            }
            form.reset();
        }
    });
}

/**
 * Inicializa selector dinámico de Región / Comuna y validación del Registro
 */
function initFormRegistro() {
    const form = document.getElementById('form-registro');
    const selectRegion = document.getElementById('registro-region');
    const selectComuna = document.getElementById('registro-comuna');

    if (!form || !selectRegion || !selectComuna) return;

    // 1. Cargar opciones de Región
    selectRegion.innerHTML = '<option value="">-- Selecciona una región --</option>';
    Object.keys(regionesYComunas).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        selectRegion.appendChild(option);
    });

    // 2. Evento para poblar Comunas según Región elegida
    selectRegion.addEventListener('change', () => {
        const regionElegida = selectRegion.value;
        selectComuna.innerHTML = '';

        if (regionElegida && regionesYComunas[regionElegida]) {
            selectComuna.disabled = false;
            selectComuna.innerHTML = '<option value="">-- Selecciona una comuna --</option>';
            regionesYComunas[regionElegida].forEach(comuna => {
                const opt = document.createElement('option');
                opt.value = comuna;
                opt.textContent = comuna;
                selectComuna.appendChild(opt);
            });
            setMensajeError('error-registro-region', false);
        } else {
            selectComuna.disabled = true;
            selectComuna.innerHTML = '<option value="">-- Primero selecciona una región --</option>';
        }
    });

    // 3. Validación al enviar el formulario
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let esValido = true;

        const nombre = document.getElementById('registro-nombre').value.trim();
        const email = document.getElementById('registro-email').value.trim();
        const password = document.getElementById('registro-password').value;
        const region = selectRegion.value;
        const comuna = selectComuna.value;

        // Nombre (obligatorio, max 100)
        if (nombre === '' || nombre.length > 100) {
            setMensajeError('error-registro-nombre', true);
            esValido = false;
        } else {
            setMensajeError('error-registro-nombre', false);
        }

        // Email (obligatorio, dominios permitidos, max 100)
        if (!esEmailValido(email)) {
            setMensajeError('error-registro-email', true);
            esValido = false;
        } else {
            setMensajeError('error-registro-email', false);
        }

        // Contraseña (obligatoria, entre 4 y 10 caracteres)
        if (!password || password.length < 4 || password.length > 10) {
            setMensajeError('error-registro-password', true);
            esValido = false;
        } else {
            setMensajeError('error-registro-password', false);
        }

        // Región obligatoria
        if (!region) {
            setMensajeError('error-registro-region', true);
            esValido = false;
        } else {
            setMensajeError('error-registro-region', false);
        }

        // Comuna obligatoria
        if (!comuna) {
            setMensajeError('error-registro-comuna', true);
            esValido = false;
        } else {
            setMensajeError('error-registro-comuna', false);
        }

        if (esValido) {
            const alerta = document.getElementById('alerta-registro');
            if (alerta) {
                alerta.style.display = 'block';
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 4000);
            }
            form.reset();
            selectComuna.disabled = true;
            selectComuna.innerHTML = '<option value="">-- Primero selecciona una región --</option>';
        }
    });
}

/* ====================================================================
   6. INICIALIZACIÓN GENERAL AL CARGAR EL DOM
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Vincular enlaces del navbar con navegación SPA
    document.querySelectorAll('.navbar-links a[data-section], .navbar-brand[data-section]').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = enlace.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Renderizar datos iniciales
    renderProductos();
    renderBlogs();
    actualizarContadorCarrito();

    // Inicializar validaciones de formularios
    initFormContacto();
    initFormLogin();
    initFormRegistro();
});