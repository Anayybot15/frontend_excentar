import { createRouter, createWebHistory } from 'vue-router';
import ProductoLista from '../components/ProductoLista.vue';
import ProductoDetalle from '../components/ProductoDetalle.vue';

const routes = [
  {
    path: '/',
    name: 'ProductoLista',
    component: ProductoLista,
  },
  {
    path: '/producto',
    name: 'ProductoDetalle',
    component: ProductoDetalle,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
