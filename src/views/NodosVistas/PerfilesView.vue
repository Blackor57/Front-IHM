<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/api' // <- Conexión real

const router = useRouter()
const cargando = ref(true)
const editando = ref(false)
const errorApi = ref(false)

const ciudadano = ref({ id: null, dni: '', name: '', phone: '', email: '', password: '' })
const copiaCiudadano = ref({})

const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

const cargarPerfilCiudadano = async () => {
  cargando.value = true
  errorApi.value = false

  try {
    const data = await userService.getProfile()
    ciudadano.value = { ...data, password: '********' }
    copiaCiudadano.value = { ...ciudadano.value }

    localStorage.setItem('nombreCiudadano', data.name)
    hablarTexto(`Perfil cargado correctamente.`)
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al conectar con el servidor.')
  } finally { //  ¡Corregido a finally!
    cargando.value = false
  }
}

onMounted(() => {
  cargarPerfilCiudadano()
})

const habilitarEdicion = () => {
  editando.value = true
  ciudadano.value.password = ''
  hablarTexto('Modo de edición activado. Puede modificar su correo, teléfono y contraseña.')
}

const cancelarEdicion = () => {
  editando.value = false
  ciudadano.value = { ...copiaCiudadano.value }
  hablarTexto('Edición cancelada.')
}

const guardarCambios = async () => {
  cargando.value = true
  editando.value = false

  try {
    const cambios = {
      phone: ciudadano.value.phone,
      email: ciudadano.value.email
    }
    if (ciudadano.value.password.trim() !== '') {
      cambios.password = ciudadano.value.password
    }

    await userService.updateProfile(cambios)
    ciudadano.value.password = '********'
    copiaCiudadano.value = { ...ciudadano.value }
    hablarTexto('Datos de acceso actualizados correctamente.')
  } catch (error) {
    hablarTexto('Error al intentar guardar los cambios.')
    cancelarEdicion()
  } finally {
    cargando.value = false
  }
}

const volverAlPanel = () => {
  hablarTexto('Regresando al menú de selección.')
  router.push('/panel-consultas')
}
</script>

<template>
  <div class="perfil-main-wrapper">
    <div class="perfil-card">

      <button type="button" class="btn-back-panel" @click="volverAlPanel">
        ← Volver al Panel
      </button>

      <header class="perfil-header">
        <div class="title-row">
          <span class="user-avatar-icon">👤</span>
          <h2>Mi Perfil Ciudadano</h2>
        </div>
        <p class="subtitle">Información de identidad y credenciales oficiales del usuario</p>
      </header>

      <div v-if="cargando" class="loading-box">
        <div class="circle-spinner"></div>
        <p>Sincronizando datos de la plataforma...</p>
      </div>

      <div v-else-if="errorApi" class="error-box">
        <p>⚠️ No se pudo establecer conexión con el módulo de usuarios.</p>
        <button type="button" class="btn-retry" @click="cargarPerfilCiudadano">Reintentar</button>
      </div>

      <div class="perfil-content" v-else>
        <form @submit.prevent="guardarCambios">

          <div class="info-card-grid">

            <div class="info-tile disabled-field">
              <span class="tile-lbl">Documento de Identidad (DNI)</span>
              <p class="tile-val">{{ ciudadano.dni }}</p>
            </div>

            <div class="info-tile disabled-field">
              <span class="tile-lbl">Nombre Completo</span>
              <p class="tile-val">{{ ciudadano.name }}</p>
            </div>

            <div class="info-tile" :class="{ 'editable-field': editando }">
              <label class="tile-lbl" for="telefono-input">Teléfono de Contacto</label>
              <input
                  id="telefono-input"
                  type="text"
                  v-model="ciudadano.phone"
                  :disabled="!editando"
                  class="perfil-input"
                  required
              />
            </div>

            <div class="info-tile" :class="{ 'editable-field': editando }">
              <label class="tile-lbl" for="correo-input">Correo Electrónico</label>
              <input
                  id="correo-input"
                  type="email"
                  v-model="ciudadano.email"
                  :disabled="!editando"
                  class="perfil-input"
                  required
              />
            </div>

            <div class="info-tile" :class="{ 'editable-field': editando }">
              <label class="tile-lbl" for="pass-input">Contraseña de Acceso</label>
              <input
                  id="pass-input"
                  :type="editando ? 'text' : 'password'"
                  v-model="ciudadano.password"
                  :disabled="!editando"
                  :placeholder="editando ? 'Escriba la nueva contraseña' : '••••••••'"
                  class="perfil-input"
                  required
              />
            </div>

          </div>

          <footer class="perfil-actions">
            <div v-if="!editando" class="row-normal-actions">
              <button type="button" class="btn-edit-data" @click="habilitarEdicion">
                ✏️ Modificar Correo, Teléfono y Contraseña
              </button>
            </div>

            <div v-else class="row-editing-actions">
              <button type="submit" class="btn-save-data">
                💾 Guardar Cambios
              </button>
              <button type="button" class="btn-cancel-data" @click="cancelarEdicion">
                ❌ Cancelar
              </button>
            </div>
          </footer>

        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/perfiles.css";
</style>