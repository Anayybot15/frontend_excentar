import { defineStore } from 'pinia'

// export const useProductsStore = defineStore('products', () => {
    
// })

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
     }),
    getters: {
        getProducts: (state) => state.products
    },
    actions: {
         fetchData() {
            fetch('http://localhost:8000/api/product')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar productos');
                return response.json();
            })
            .then(data => {
                console.log(data); 
            })
            .catch(error => {
                console.error(error);
            });
        },
        
    },
  })