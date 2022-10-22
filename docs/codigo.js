const txtNombreProducto = document.getElementById('produName');
const txtDescripcion = document.getElementById('descrip');
const txtCategoria = document.getElementById('cat');
const txtRutaImagen = document.getElementById('imgPath');
const txtPrecio = document.getElementById('pri');
const tabla = document.getElementById('tabla');
const btnCrear = document.getElementById('btnCrear');

var fila = "<tr>" +
	"<td class='id'></td>" +
	"<td class='foto'></td>" +
	"<td class='price'></td>" +
	"<td class='title'></td>" +
	"<td class='description'></td>" +
	"<td class='category'></td>" +
	"<td class='delOption'> <a href='#' class='del btn btn-danger btn-sm '>Eliminar</a></td> " + //
	"</tr>";


var productos = null;

function codigoCat(catstr) {
	var code = "null";
	switch (catstr) {
		case "electronicos":
			code = "c1";
			break;
		case "joyeria":
			code = "c2";
			break;
		case "caballeros":
			code = "c3";
			break;
		case "damas":
			code = "c4";
			break;
		case "eliminar":
			code = "del";
			break;
	}
	return code;
}
var orden = 0;


function listarProductos(productos) {
	var precio = document.getElementById("price");
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	var num = productos.length;
	var listado = document.getElementById("listado");
	var ids, titles, prices, descriptions, categories, fotos;
	var tbody = document.getElementById("tbody"),
		nfila = 0;
	tbody.innerHTML = "";
	var catcode;
	for (i = 0; i < num; i++) tbody.innerHTML += fila;
	var tr;
	ids = document.getElementsByClassName("id");
	titles = document.getElementsByClassName("title");
	descriptions = document.getElementsByClassName("description");
	categories = document.getElementsByClassName("category");
	fotos = document.getElementsByClassName("foto");
	prices = document.getElementsByClassName("price");
	if (orden === 0) {
		orden = -1;
		precio.innerHTML = "Precio"
	} else
	if (orden == 1) {
		ordenarAsc(productos, "price");
		precio.innerHTML = "Precio A";
		precio.style.color = "darkgreen"
	} else
	if (orden == -1) {
		ordenarDesc(productos, "price");
		precio.innerHTML = "Precio D";
		precio.style.color = "blue"
	}


	listado.style.display = "block";
	for (nfila = 0; nfila < num; nfila++) {
		ids[nfila].innerHTML = productos[nfila].id;
		titles[nfila].innerHTML = productos[nfila].title;
		descriptions[nfila].innerHTML = productos[nfila].description;
		categories[nfila].innerHTML = productos[nfila].category;
		catcode = codigoCat(productos[nfila].category);
		tr = categories[nfila].parentElement;
		tr.setAttribute("class", catcode);
		prices[nfila].innerHTML = "$" + productos[nfila].price;
		fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
		fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
	}
}

function obtenerProductos() {
	fetch('https://retoolapi.dev/72lInd/productos')
		.then(res => res.json())
		.then(data => {
			productos = data;
			listarProductos(data)
		})
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return -1;
		if (a[p_key] < b[p_key]) return 1;
		return 0;
	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return 1;
		if (a[p_key] < b[p_key]) return -1;
		return 0;
	});
}

function createProduct(data) {

	fetch('https://retoolapi.dev/72lInd/productos', {
			method: 'POST', // or 'PUT'
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		.then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		txtNombreProducto.value = " ";
		txtDescripcion.value = " ";
		txtCategoria.value = " ";
		txtRutaImagen.value = " ";
		txtPrecio.value = "";
}

function deleteProductApi(id) {
	fetch(`https://retoolapi.dev/72lInd/productos${id}`, {
			method: "DELETE"
		})
		.then(response => response.json())
		.then(data => delresult = data);
}
//Borrar
document.querySelector("#tbody").addEventListener("click", (e) => {
	let target = e.target;
	console.log(target.parentElement.parentElement.firstChild.innerHTML);
	 if(target.classList.contains("del")){
	 	target.parentElement.parentElement.remove();
		deleteProductApi(target.parentElement.parentElement.firstChild.innerHTML);
	}
});

btnCrear.addEventListener("click",function () {
	let data = {
		image: `${txtRutaImagen.value}`,
		price: `${txtPrecio.value}`,
		title: `${txtNombreProducto.value}`,
		category: `${txtCategoria.value}`,
		description: `${txtDescripcion.value}`,
	};
	console.log(data);
    createProduct(data);
	obtenerProductos();
});

