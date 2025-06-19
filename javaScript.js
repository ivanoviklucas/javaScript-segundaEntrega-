const listaProductos = [
  {
    tipo: "auriculares",
    marca: "NOBLEX",
    nombre: "Hp350btw Blanco",
    precio: 5000,
    id: "A1",
    imagen: "imagenes/imagen-auricular1.jpg",
  },
  {
    tipo: "auriculares",
    marca: "GENÉRICO",
    nombre: "Bluetooth Vincha Micro SD Inalámbrico",
    precio: 15000,
    id: "A2",
    imagen: "imagenes/imagen-auricular2.jpg",
  },
  {
    tipo: "auriculares",
    marca: "GORSUN",
    nombre: "Wireless E66 para Niños 5.0",
    precio: 25000,
    id: "A3",
    imagen: "imagenes/imagen-auricular3.jpg",
  },
  {
    tipo: "parlante",
    marca: "PHILIPS",
    nombre: "Portátil a Batería BT60BK/77",
    precio: 25000,
    id: "P1",
    imagen: "imagenes/imagen-cargador3.jpg",
  },
  {
    tipo: "parlante",
    marca: "JBL",
    nombre: "Flip 6 Bluetooth 20W",
    precio: 148000,
    id: "P2",
    imagen: "imagenes/imagen-cargador2.jpg",
  },
  {
    tipo: "parlante",
    marca: "XION",
    nombre: "XI-XT880 Recargable 18000W",
    precio: 125000,
    id: "P3",
    imagen: "imagenes/imagen-parlante1.jpg",
  },
  {
    tipo: "mouse",
    marca: "XION",
    nombre: "Óptico LED Recargable Silencioso Bluetooth",
    precio: 22000,
    id: "M1",
    imagen: "imagenes/imagen-mouse1.jpg",
  },
  {
    tipo: "mouse",
    marca: "GENÉRICO",
    nombre: "Mouse Inalámbrico LED Silencioso USB",
    precio: 18000,
    id: "M2",
    imagen: "imagenes/imagen-mouse2.jpg",
  },
  {
    tipo: "mouse",
    marca: "LOGITECH",
    nombre: "M170 Azul Inalámbrico",
    precio: 26000,
    id: "M3",
    imagen: "imagenes/imagen-mouse3.jpg",
  },
];

let galeriaProductos = document.querySelector(".comprar-producto");

listaProductos.forEach((producto) => {
  let tarjeta = document.createElement("div");
  tarjeta.classList.add("card");

  let imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.classList.add("card-img-top");

  let cuerpoTarjeta = document.createElement("div");

  let nombre = document.createElement("h5");
  nombre.textContent = producto.nombre;

  let precio = document.createElement("p");
  precio.textContent = `$${producto.precio}`;

  let boton = document.createElement("a");
  boton.textContent = "Agregar al carrito";
  boton.classList.add("añadir-carrito");
  boton.href = "#";
  boton.classList.add("btn", "btn-primary");

  cuerpoTarjeta.append(nombre, precio, boton);
  tarjeta.append(imagen, cuerpoTarjeta);
  galeriaProductos.appendChild(tarjeta);
});

// ✅ CAMBIO CLAVE: Inicializar el carrito con datos del localStorage si existen
let carritovacio = JSON.parse(localStorage.getItem("carrito")) || [];
let carritoAbierto = false;

function mostrarCarrito() {
  const contenedorcarrito = document.getElementById("carrito-modal");
  const BotonCarrito = document.getElementById("icono-carrito");

  BotonCarrito.addEventListener("click", () => {
    if (!contenedorcarrito.classList.contains("visible")) {
      contenedorcarrito.classList.add("visible");
      carritoAbierto = true;
    } else {
      contenedorcarrito.classList.remove("visible");
      carritoAbierto = false;
    }

    console.log("Clic en carrito");
    console.log("Carrito abierto:", carritoAbierto);
  });
}

mostrarCarrito();
function agregarproducto() {
  let botones = document.querySelectorAll(".añadir-carrito");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      let tarjetaProducto = boton.parentElement.parentElement;

      let nombre = tarjetaProducto.querySelector("h5").textContent;
      let precioTexto = tarjetaProducto.querySelector("p").textContent;
      let precio = parseFloat(precioTexto.replace("$", ""));
      let rutaImagen = tarjetaProducto.querySelector("img").getAttribute("src");

      let producto = {
        nombre: nombre,
        precio: precio,
        imagen: rutaImagen,
      };

      carritovacio.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carritovacio));

      // 🔁 Volvemos a cargar todo el carrito para que se vea ordenado
      cargarCarrito();
    });
  });
}

function cargarCarrito() {
  const contenedorModal = document.getElementById("carrito-modal");

  contenedorModal.innerHTML = "";

  let carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    const carrito = JSON.parse(carritoGuardado);

    carrito.forEach((producto) => {
      const img = document.createElement("img");
      img.src = producto.imagen;
      img.style.width = "50px";
      contenedorModal.appendChild(img);

      const p = document.createElement("p");
      p.textContent = `${producto.nombre} - $${producto.precio}`;
      contenedorModal.appendChild(p);
    });

    if (!document.querySelector(".btn-limpiar")) {
      const btnLimpiar = document.createElement("button");
      btnLimpiar.textContent = "Limpiar carrito";
      btnLimpiar.className = "btn-limpiar";

      btnLimpiar.onclick = () => {
        localStorage.removeItem("carrito");
        carritovacio = [];
        contenedorModal.innerHTML = "";
      };

      contenedorModal.appendChild(btnLimpiar);
    }
  }
}
agregarproducto();
cargarCarrito();
