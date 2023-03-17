class Productos {
    constructor (id, imagen, tipoDeProducto, sabor, descripcion, precio, cantidad) {
        this.id = id;
        this.imagen = imagen;
        this.tipoDeProducto = tipoDeProducto;
        this.sabor = sabor;
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
    }
}


function obtenerProductosDelJSON () {
    fetch("./js/productos.json")
        .then((response)=> {
            return response.json ();
        })
        .then((productosJSON) => {

            for (const productoJSON of productosJSON) {
                productos.push(new Productos(
                    productoJSON.id,
                    productoJSON.imagen,
                    productoJSON.tipoDeProducto,
                    productoJSON.sabor,
                    productoJSON.descripcion,
                    productoJSON.precio,
                    productoJSON.cantidad,
                ));
                }

            cargarProductos(productos);
        });
}

const productos = [];
let carrito = [];

obtenerProductosDelJSON ();

const contenedor = document.querySelector ("#contenedor");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector ("#precioTotal");
const carritoContenedor = document.querySelector("#carritoContenedor");
const finalizarCompra = document.querySelector ("#finalizarCompra");



document.addEventListener ("DOMContentLoaded", ()=> {
    carrito = JSON.parse (localStorage.getItem("carrito")) || [];
    mostrarCarrito ();
})

function cargarProductos () {
  
    productos.forEach(producto => {

        const div = document.createElement("div");
        div.innerHTML += `
		    <div class="card h-100">
            <div class="card h-100">
            <img src="${producto.imagen}" class="card-img-top"
                alt="cupcake de chocolate con buttercream de chocolate">
                <div class="card-body">
                    <h5 class="card-title">${producto.tipoDeProducto} de ${producto.sabor}</h5>
                    <p class="card-text text-wrap text-center"> ${producto.descripcion
                    } Precio por unidad $ <b> ${producto.precio}</b></p>
                    <a onclick="agregarProducto(${producto.id})" class="btn btn-primary">Comprar</a>
                </div>
            </div>
            </div>
            `
    
        contenedor.append(div);
})
}

//cargarProductos ();


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
    const existe = carrito.some (prod => prod.id === id)

    if (existe) {
        const prod = carrito.map (prod => {
            if (prod.id === id) {
                prod.cantidad++
            }
        })
    } else {
        const item = productos.find((prod) => prod.id === id);
        carrito.push(item);
        console.log (carrito);
    }
    
    mostrarCarrito ();
}


const mostrarCarrito = () => {
    const modalBody = document.querySelector (".modal .modal-body");
    console.log (modalBody)

    if (modalBody) {
        modalBody.innerHTML = "";
        carrito.forEach((prod) => {
            const {id, tipoDeProducto, sabor, precio, cantidad} = prod;
            modalBody.innerHTML += `
                <div class="modal-contenedor">
                    <div> 
                        <p>Tipo de Producto: ${tipoDeProducto}</p>
                        <p>Sabor: ${sabor}</p>
                        <p>Cantidad: ${cantidad}</p>
                        <p>Precio por unidad: $ ${precio}</p>
                        <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
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








