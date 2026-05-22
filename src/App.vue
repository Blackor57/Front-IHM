<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main-app">
    <RouterView />
  </div>
</template>

<style>
/* Estilos globales rápidos */
body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f6f9;
  color: #333;
}
.main-app {
  min-height: 100vh;
}
</style>