const url = "/productos.json";

let carrito = [];
let productos = [];

fetch (url)
    .then (res => res.json())
    .then (data => {
        productos = data
        cargarProductos(productos)
    })

const contenedor = document.querySelector ("#contenedor");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector ("#precioTotal");
const carritoContenedor = document.querySelector("#carritoContenedor");
const finalizarCompra = document.querySelector ("#finalizarCompra");



function cargarProductos (productos) {
    console.log (productos);

    productos.forEach(prod => {
        let card = document.createElement ("div");

        card.innerHTML = `
            <div class="card h-100">
            <div class="card h-100">
            <img src="${prod.imagen}" class="card-img-top"
                alt="cupcake de chocolate con buttercream de chocolate">
                <div class="card-body">
                    <h5 class="card-title">${prod.tipoDeProducto} de ${prod.sabor}</h5>
                    <p class="card-text text-wrap text-center"> ${prod.descripcion
                    } Precio por unidad $ <b> ${prod.precio}</b></p>
                    <a onclick="agregarProducto(${prod.id})" class="btn btn-primary">Comprar</a>
                </div>
            </div>
        </div>
        `
        contenedor.appendChild(card);
    });
}


document.addEventListener ("DOMContentLoaded", ()=> {
    carrito = JSON.parse (localStorage.getItem("carrito")) || [];
    mostrarCarrito ();
})


vaciarCarrito.addEventListener ("click", () => {
    carrito.length = [];
    mostrarCarrito ();
})

finalizarCompra.addEventListener ("click", () => {
          if (carrito.length === 0) {
            Swal.fire({
            title: "¡Tu carrito está vacio!",
            text: "Agrega los productos que mas te tienten!",
            icon: "warning",
            confirmButtonText: "Aceptar"
        }
        )} else {
            Swal.fire({
                title: 'Cerramos el pedido?',
                text: "Asegurate de no olvidarte nada!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, ya tengo todo!'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Perfecto!',
                    'Te vamos a redirigir al pago para que terminemos la compra. Gracias!',
                    'success'
                  )
                }
              })
        }
})

const agregarProducto = (id) => {
    const productoExistente = carrito.filter(prod => prod.id === id)[0];

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        const producto = productos.find(prod => prod.id === id);
        carrito.push({...producto, cantidad: 1});
    }
    
    mostrarCarrito();
}


const mostrarCarrito = () => {
    const modalBody = document.querySelector (".modal .modal-body");
    console.log (modalBody)

    if (modalBody) {
        modalBody.innerHTML = "";
        carrito.forEach((prod) => {
            
            modalBody.innerHTML += `
                <div class="modal-contenedor">
                    <div> 
                        <p>Tipo de Producto: ${prod.tipoDeProducto}</p>
                        <p>Sabor: ${prod.sabor}</p>
                        <p>Cantidad: ${prod.cantidad}</p>
                        <p>Precio por unidad: $ ${prod.precio}</p>
                        <button class="btn btn-danger"  onclick="eliminarProducto(${prod.id})">Eliminar producto</button>
                    </div>
                </div>
            `;
        });
    }

    if (carrito.length === 0) {
        modalBody.innerHTML = `
        <p class="parrafo">Aun no agregaste nada al carrito</p>
        `;
      } else {
        console.log("Algo");
    }
    carritoContenedor.textContent = carrito.length;
    
      if (precioTotal) {
        precioTotal.innerText = carrito.reduce(
          (acc, prod) => acc + prod.cantidad * prod.precio,
          0
        );
      }

    guardarStorage ();

}

function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(id) {
    const itemId = id;
    carrito = carrito.filter((productos) => productos.id !== itemId);
    mostrarCarrito();
}








