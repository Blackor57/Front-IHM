import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/RegistroView.vue')
    },
    {
      path: '/panel-consultas',
      name: 'panel-consultas',
      component: () => import('../views/PanelConsultas.vue'),
      children: [
        {
          path: 'mi-salud',
          name: 'mi-salud',
          component: () => import('../views/NodosVistas/MiSaludView.vue')
        },
        {
          path: 'consultar-bonos',
          name: 'consultar-bonos',
          component: () => import('../views/NodosVistas/ConsultarBonosView.vue')
        },
        {
          path: 'noticias',
          name: 'noticias',
          component: () => import('../views/NodosVistas/NoticiasView.vue')
        },
        {
          path: 'perfiles',
          name: 'perfiles',
          component: () => import('../views/NodosVistas/PerfilesView.vue')
        },
        {
          path: 'alertas',
          name: 'alertas',
          component: () => import('../views/NodosVistas/AlertasView.vue')
        },
        {
          path: 'tramites-curso',
          name: 'tramites-curso',
          component: () => import('../views/NodosVistas/TramitesCurso.vue')
        }
      ]
    }
  ]
})

export default router
