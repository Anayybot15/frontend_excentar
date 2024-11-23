<template>
  <div class="producto-detalle">
    <h2>Detalle del Producto</h2>

    <!-- Mensaje de carga -->
    <p v-if="loading">Cargando producto...</p>

    <!-- Mensaje de error -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Mostrar el producto si está disponible -->
    <div v-if="!loading && !error && producto">
      <h3>{{ producto.name }}</h3>
      <p>Precio: ${{ producto.price }}</p>
      <p>Stock: {{ producto.stock }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute(); // Para obtener el parámetro `id` de la URL
    const producto = ref(null); // Almacena el producto
    const loading = ref(true); // Manejo de estado de carga
    const error = ref(null); // Manejo de errores

    const fetchProducto = async () => {
      try {
        const id = route.params.id; // Obtenemos el ID del producto desde la URL
        const response = await fetch(`http://localhost:8000/api/product/${id}`);
        if (!response.ok) throw new Error('Error al cargar el producto');
        producto.value = await response.json(); // Guardamos el producto en la referencia
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchProducto); // Llamamos al fetch al montar el componente

    return {
      producto,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
.producto-detalle {
  padding: 16px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
