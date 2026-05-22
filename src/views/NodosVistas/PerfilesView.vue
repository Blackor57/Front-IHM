<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cargando = ref(true)
const editando = ref(false)
const errorApi = ref(false)

// Campos exactos de la entidad Ciudadano
const ciudadano = ref({
  id: null,
  dni: '',
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  contrase_a: ''
})

const copiaCiudadano = ref({})

const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel() // Limpia cualquier audio previo
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

const cargarPerfilCiudadano = async () => {
  cargando.value = true
  errorApi.value = false
  
  try {
    // Simulación de carga de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // PERSISTENCIA: Recuperamos lo guardado localmente en el navegador
    const nombreGuardado = localStorage.getItem('nombreCiudadano') || 'LADY'
    const correoGuardado = localStorage.getItem('correoCiudadano') || 'lady@gmail.com'
    const passGuardada = localStorage.getItem('passCiudadana') || '********'
    
    ciudadano.value = {
      id: 1,
      dni: '74589632',
      nombre: nombreGuardado,
      apellido: 'QUISPE MENDOZA',
      telefono: '987654321',
      correo: correoGuardado,
      contrase_a: passGuardada
    }
    
    copiaCiudadano.value = { ...ciudadano.value }
    hablarTexto(`Perfil cargado. Bienvenido ${ciudadano.value.nombre}.`)
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al conectar con el servidor.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarPerfilCiudadano()
})

const habilitarEdicion = () => {
  editando.value = true
  if (ciudadano.value.contrase_a === '********') {
    ciudadano.value.contrase_a = ''
  }
  hablarTexto('Modo de edición activado. Puede modificar su correo y contraseña.')
}

const cancelarEdicion = () => {
  editando.value = false
  ciudadano.value = { ...copiaCiudadano.value }
  hablarTexto('Edición cancelada.')
}

const guardarCambios = () => {
  if (!ciudadano.value.correo.includes('@')) {
    hablarTexto('Por favor, ingrese un correo válido.')
    return
  }

  cargando.value = true
  editando.value = false
  
  setTimeout(() => {
    cargando.value = false
    
    // Guardamos los datos en el localStorage para que no se borren al regresar
    localStorage.setItem('correoCiudadano', ciudadano.value.correo)
    if (ciudadano.value.contrase_a.trim() !== '') {
      localStorage.setItem('passCiudadana', ciudadano.value.contrase_a)
    }
    
    ciudadano.value.contrase_a = '********'
    copiaCiudadano.value = { ...ciudadano.value }
    hablarTexto('Datos de acceso actualizados correctamente.')
  }, 800)
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
              <span class="tile-lbl">Nombres</span>
              <p class="tile-val">{{ ciudadano.nombre }}</p>
            </div>

            <div class="info-tile disabled-field">
              <span class="tile-lbl">Apellidos</span>
              <p class="tile-val">{{ ciudadano.apellido }}</p>
            </div>

            <div class="info-tile disabled-field">
              <span class="tile-lbl">Teléfono de Contacto</span>
              <p class="tile-val">{{ ciudadano.telefono }}</p>
            </div>

            <div class="info-tile" :class="{ 'editable-field': editando }">
              <label class="tile-lbl" for="correo-input">Correo Electrónico</label>
              <input 
                id="correo-input"
                type="email" 
                v-model="ciudadano.correo" 
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
                v-model="ciudadano.contrase_a" 
                :disabled="!editando"
                :placeholder="editando ? 'Escriba la nueva contraseña' : ''"
                class="perfil-input"
                required
              />
            </div>

          </div>

          <footer class="perfil-actions">
            <div v-if="!editando" class="row-normal-actions">
              <button type="button" class="btn-edit-data" @click="habilitarEdicion">
                ✏️ Modificar Correo y Contraseña
              </button>
              
              <button 
                type="button" 
                class="btn-audio-report"
                @click="hablarTexto(`Ciudadano: ${ciudadano.nombre}. Correo: ${ciudadano.correo}`)"
              >
                🔊 Escuchar Mis Datos
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
/* Importación limpia que jala los estilos del archivo externo */
@import "@/assets/css/perfiles.css";
</style>