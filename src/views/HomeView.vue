<template>
  <div class="home-hero">
    <div class="backdrop-circle circle-1"></div>
    <div class="backdrop-circle circle-2"></div>

    <div class="welcome-card animate-fade-in">
      <div class="logo-container">
        <span class="portal-icon">🏢</span>
      </div>
      <p class="subtitulo-plataforma">PLATAFORMA DIGITAL DE ATENCIÓN</p>
      <h1>Bienvenido al Sistema de Consultas</h1>
      <p class="descripcion">
        Acceda a sus trámites de forma rápida, segura y con herramientas de accesibilidad integradas para una mejor experiencia.
      </p>
      
      <div class="actions">
        <router-link to="/login" class="btn btn-primary">
          <span>Iniciar Sesión</span>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/registro" class="btn btn-secondary">
          <span>Crear Cuenta</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/CSS/home.css"></style>