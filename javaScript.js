const listaProductos = [];
async function cargarProducto() {
  try {
    const respuesta = await fetch(`/productos.json`);
    const datos = await respuesta.json();
    MostrarProducto(datos);
    MostrarProducto(datos);
    FiltrarProducto(datos);
    agregarproducto(datos);
  } catch (error) {
    console.error("error al mostrar productos", error);
  }
}
function MostrarProducto(listaProducto) {
  let galeriaProductos = document.querySelector(".comprar-producto");

  galeriaProductos.innerHTML = "";

  listaProducto.forEach((producto) => {
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
    boton.classList.add("añadir-carrito", "btn", "btn-primary");
    boton.href = "#";

    cuerpoTarjeta.append(nombre, precio, boton);
    tarjeta.append(imagen, cuerpoTarjeta);
    galeriaProductos.appendChild(tarjeta);
  });
}
mostrarCarrito(listaProductos);
let carritovacio = JSON.parse(localStorage.getItem("carrito")) || [];
let carritoAbierto = false;

function FiltrarProducto(listaProductos) {
  let galeriaProductos = document.querySelector(".comprar-producto");
  let seleccionarFiltro = document.querySelectorAll(".categoria-item");

  seleccionarFiltro.forEach((categoriaItem) => {
    categoriaItem.addEventListener("click", function () {
      let resultadoFiltro;

      if (this.textContent === "todos") {
        resultadoFiltro = listaProductos;
      } else {
        resultadoFiltro = listaProductos.filter(
          (producto) => producto.tipo === this.textContent
        );
      }

      galeriaProductos.innerHTML = "";
      MostrarProducto(resultadoFiltro);
      agregarproducto();
      console.log(resultadoFiltro);
    });
  });
}

FiltrarProducto(listaProductos);

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
      Swal.fire({
        title: "¿Estás seguro que querés agregar este producto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "mi-popup-rosa", // opcional
          confirmButton: "mi-boton-rosa", // opcional
          cancelButton: "mi-boton-cancelar", // opcional
        },
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          let tarjetaProducto = boton.parentElement.parentElement;

          let nombre = tarjetaProducto.querySelector("h5").textContent;
          let precioTexto = tarjetaProducto.querySelector("p").textContent;
          let precio = parseFloat(precioTexto.replace("$", ""));
          let rutaImagen = tarjetaProducto
            .querySelector("img")
            .getAttribute("src");

          let producto = {
            nombre: nombre,
            precio: precio,
            imagen: rutaImagen,
          };

          carritovacio.push(producto);
          localStorage.setItem("carrito", JSON.stringify(carritovacio));

          Toastify({
            text: "Producto agregado al carrito",
            duration: 1000,
            position: "right",
            style: {
              background: "white",
              color: "black",
              textAlign: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontWeight: "bold",
              width: "20%",
            },
          }).showToast();

          cargarCarrito();
        }
      });
    });
  });
}

function cargarCarrito() {
  const contenedorModal = document.getElementById("carrito-modal");

  contenedorModal.innerHTML = "";

  let carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    const carrito = JSON.parse(carritoGuardado);
    let totalcarrito = 0;
    carrito.forEach((producto) => {
      const img = document.createElement("img");
      img.src = producto.imagen;
      img.style.width = "50px";
      contenedorModal.appendChild(img);

      const p = document.createElement("p");
      p.textContent = `${producto.nombre} - $${producto.precio}`;
      totalcarrito += producto.precio;
      let btnEliminardelcarrito = document.createElement("button");
      btnEliminardelcarrito.textContent = "eliminar del carrito";
      btnEliminardelcarrito.classList.add("btn-eliminarProducto");
      btnEliminardelcarrito.addEventListener("click", function () {
        EliminarProducto(producto);
      });
      contenedorModal.appendChild(p);
      contenedorModal.appendChild(btnEliminardelcarrito);
    });
    if (!document.querySelector(".btn-limpiar")) {
      const btnLimpiar = document.createElement("button");
      btnLimpiar.textContent = "Limpiar carrito";
      btnLimpiar.className = "btn-limpiar";
      let btnconfimarProducto = document.createElement("button");
      btnconfimarProducto.textContent = "confirmar compra";
      btnconfimarProducto.classList.add("btn-confirmar");
      btnLimpiar.onclick = () => {
        localStorage.removeItem("carrito");
        carritovacio = [];
        contenedorModal.innerHTML = "";
      };
      btnconfimarProducto.onclick = () => {
        Swal.fire({
          title: "¿Deseás confirmar la compra?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, confirmar",
          cancelButtonText: "Cancelar",
          customClass: {
                popup: "mi-popup-rosa",
                title: "mi-titulo-rosa",
                confirmButton: "mi-boton-rosa",
              },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `usted compro por $${totalcarrito}`,
              icon: "success",
              customClass: {
                popup: "mi-popup-rosa",
                title: "mi-titulo-rosa",
                confirmButton: "mi-boton-rosa",
              },
            });
          }
        });
      };
      console.log(totalcarrito);
      let muestraTotal = document.createElement("p");
      muestraTotal.textContent =
        "EL TOTAL DE SU COMPRA ES:" + " " + totalcarrito;
      contenedorModal.appendChild(muestraTotal);

      contenedorModal.appendChild(btnLimpiar);
      contenedorModal.appendChild(btnconfimarProducto);
    }
  }
}
function EliminarProducto(producto) {
  // Buscamos el índice (posición) en el array "carritovacio" del primer elemento cuyo 'id' coincida con el 'id' del producto que quiero eliminar
  let indice = carritovacio.findIndex((item) => item.id === producto.id);

  // Si encontramos ese producto en el array (es decir, el índice no es -1)
  if (indice !== -1) {
    // Eliminamos 1 elemento en la posición 'indice' del array, que es el producto que queremos quitar
    carritovacio.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carritovacio));
    cargarCarrito(); // Actualizar la vista
  }
}
agregarproducto();
cargarCarrito();
window.addEventListener("DOMContentLoaded", () => {
  cargarProducto();
  mostrarCarrito();
  cargarCarrito();
});
