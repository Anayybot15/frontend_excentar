<template>
  <div class="producto-lista">
    <h2>Productos Disponibles</h2>

    <!-- Mostrar mensaje de carga mientras los productos están cargando -->
    <p v-if="loading">Cargando productos...</p>

    <!-- Mostrar mensaje de error si ocurre un problema con la carga -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Botón para abrir el formulario -->
    <button @click="mostrarFormulario = true" class="boton-agregar">
      Añadir Producto
    </button>

    <!-- Formulario para añadir productos -->
    <div v-if="mostrarFormulario" class="formulario-agregar">
      <h3>Añadir Producto</h3>
      <form @submit.prevent="agregarProducto">
        <div class="form-group">
          <label for="name">Nombre:</label>
          <input v-model="nuevoProducto.name" type="text" id="name" required />
        </div>
        <div class="form-group">
          <label for="description">Descripción:</label>
          <input v-model="nuevoProducto.description" type="text" id="description" required />
        </div>
        <div class="form-group">
          <label for="price">Precio:</label>
          <input v-model="nuevoProducto.price" type="number" id="price" required />
        </div>
        <div class="form-group">
          <label for="stock">Stock:</label>
          <input v-model="nuevoProducto.stock" type="number" id="stock" required />
        </div>
        <div class="form-buttons">
          <button type="submit" class="boton-guardar">Guardar</button>
          <button type="button" @click="mostrarFormulario = false" class="boton-cancelar">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Formulario para eliminar producto -->
    <div class="formulario-eliminar">
      <h3>Eliminar Producto</h3>
      <div class="form-group">
        <input v-model="nombreEliminar" type="text" placeholder="Ingresa el nombre del producto" />
      </div>
      <button @click="eliminarProducto" class="boton-eliminar">Eliminar Producto</button>
    </div>

    <!-- Mostrar la lista de productos -->
    <ul v-if="!loading && !error">
      <li 
        v-for="producto in productos" 
        :key="producto.id" 
        @click="seleccionarProducto(producto)"
        class="producto-item"
      >
        {{ producto.name }}
      </li>
    </ul>

    <!-- Mostrar detalles del producto seleccionado -->
    <div v-if="productoSeleccionado" class="producto-detalle">
      <h3>Detalles del Producto</h3>
      <p>Nombre: {{ productoSeleccionado.name }}</p>
      <p>Precio: ${{ productoSeleccionado.price }}</p>
      <p>Stock: {{ productoSeleccionado.stock }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const productos = ref([]); // Almacena la lista de productos
    const productoSeleccionado = ref(null); // Producto seleccionado
    const loading = ref(true); // Manejo de estado de carga
    const error = ref(null); // Manejo de errores
    const mostrarFormulario = ref(false); // Mostrar u ocultar el formulario
    const nuevoProducto = ref({
      name: '',
      description: '',
      price: '',
      stock: '',
    }); // Datos del nuevo producto
    const nombreEliminar = ref(''); // Nombre del producto a eliminar

    // Función para obtener los productos desde el API
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        if (!response.ok) throw new Error('Error al cargar productos');
        productos.value = await response.json(); // Guardamos la lista de productos
      } catch (err) {
        error.value = err.message; // Manejamos errores
      } finally {
        loading.value = false; // Finalizamos la carga
      }
    };

    // Función para seleccionar un producto y mostrar sus detalles
    const seleccionarProducto = (producto) => {
      productoSeleccionado.value = producto; // Guardamos el producto seleccionado
    };

    // Función para añadir un producto a la lista y al API
    const agregarProducto = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoProducto.value),
        });

        if (!response.ok) throw new Error('Error al agregar producto');
        const productoCreado = await response.json();

        // Agregar el producto creado a la lista local
        productos.value.push(productoCreado);

        // Resetear el formulario
        nuevoProducto.value = { name: '', description: '', price: '', stock: '' };
        mostrarFormulario.value = false;
      } catch (err) {
        console.error('Error al agregar producto:', err);
        error.value = 'Error al agregar producto';
      }
    };

    // Función para eliminar un producto por nombre
    const eliminarProducto = async () => {
      try {
        const productoAEliminar = productos.value.find(
          (producto) => producto.name.toLowerCase() === nombreEliminar.value.toLowerCase()
        );

        if (!productoAEliminar) {
          error.value = 'Producto no encontrado';
          return;
        }

        const response = await fetch(`http://localhost:8000/api/product/${productoAEliminar.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar producto');
        
        // Eliminar el producto localmente
        productos.value = productos.value.filter(
          (producto) => producto.id !== productoAEliminar.id
        );

        // Limpiar el campo de nombre
        nombreEliminar.value = '';
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        error.value = 'Error al eliminar producto';
      }
    };

    onMounted(fetchProductos); // Llamamos a fetchProductos al montar el componente

    return {
      productos,
      productoSeleccionado,
      loading,
      error,
      mostrarFormulario,
      nuevoProducto,
      seleccionarProducto,
      agregarProducto,
      nombreEliminar,
      eliminarProducto,
    };
  },
};
</script>

<style scoped>
/* Estilos básicos */
.producto-lista {
  padding: 16px;
}

.producto-lista ul {
  list-style-type: none;
  padding: 0;
}

.producto-lista li {
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: background-color 0.3s;
}

.producto-lista li:hover {
  background-color: #e3f2fd;
}

.producto-detalle {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f1f8e9;
}

.formulario-agregar, .formulario-eliminar {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #e3f2fd;
}

.formulario-agregar form div,
.formulario-eliminar div {
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 8px;
  font-size: 16px;
}

.form-buttons {
  display: flex;
  gap: 15px;
}

.boton-agregar,
.boton-guardar,
.boton-eliminar,
.boton-cancelar {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.boton-agregar {
  background-color: #4caf50;
  color: white;
}

.boton-agregar:hover {
  background-color: #45a049;
}

.boton-guardar {
  background-color: #2196f3;
  color: white;
}

.boton-guardar:hover {
  background-color: #1976d2;
}

.boton-eliminar {
  background-color: #f44336;
  color: white;
}

.boton-eliminar:hover {
  background-color: #d32f2f;
}

.boton-cancelar {
  background-color: #9e9e9e;
  color: white;
}

.boton-cancelar:hover {
  background-color: #757575;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
