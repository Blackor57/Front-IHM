import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import PanelConsultas from '../views/PanelConsultas.vue'

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
      component: LoginView
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegistroView
    },
    {
      path: '/panel-consultas',
      name: 'panel-consultas',
      component: PanelConsultas
    },
    {
      path: '/panel-consultas/mi-salud',
      name: 'mi-salud',
      component: () => import('../views/NodosVistas/MiSaludView.vue')
    },
    {
      path: '/panel-consultas/consultar-bonos',
      name: 'consultar-bonos',
      component: () => import('../views/NodosVistas/ConsultarBonosView.vue')
    },
    {
      path: '/panel-consultas/noticias',
      name: 'noticias',
      component: () => import('../views/NodosVistas/NoticiasView.vue')
    },
    {
      path: '/panel-consultas/perfiles',
      name: 'perfiles',
      component: () => import('../views/NodosVistas/PerfilesView.vue')
    },
    {
      path: '/panel-consultas/alertas',
      name: 'alertas',
      component: () => import('../views/NodosVistas/AlertasView.vue')
    },
    {
      path: '/panel-consultas/tramites-curso',
      name: 'tramites-curso',
      component: () => import('../views/NodosVistas/TramitesCurso.vue')
    }
  ]
})

export default router