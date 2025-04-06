<template>
    <div>
      <h2>Historial de Entrenamientos</h2>
      <div class="card-container">
        <div v-for="item in entrenamientos" :key="item.id" class="card">
          <div class="card-header">
            <span>{{ item.fecha }}</span>
            <div class="actions">
              <button @click="emitEdit(item)" class="edit-btn">✏️</button>
              <button @click="eliminarEntrenamiento(item.id!)" class="delete-btn">X</button>
            </div>
          </div>
          <div class="card-body">
            <p><strong>Duración:</strong> {{ item.duracion }} min</p>
            <p><strong>Distancia:</strong> {{ item.distancia }} km</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { db } from '../firebase'
  import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
  import type { Entrenamiento } from '../types'
  
  const emit = defineEmits<{
    (e: 'editTraining', training: Entrenamiento): void
  }>()
  
  const entrenamientos = ref<Entrenamiento[]>([])
  const q = query(collection(db, 'entrenamientos'), orderBy('fecha', 'desc'))
  
  // Listener en tiempo real para actualizar el historial
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    entrenamientos.value = querySnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data() as Omit<Entrenamiento, 'id'>
    }))
  })
  
  const eliminarEntrenamiento = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'entrenamientos', id))
      alert('Entrenamiento eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar entrenamiento:', error)
    }
  }
  
  const emitEdit = (training: Entrenamiento) => {
    emit('editTraining', training)
  }
  
  onUnmounted(() => {
    unsubscribe()
  })
  </script>
  
  <style scoped>
  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    width: 300px;
    position: relative;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .actions {
    display: flex;
    gap: 0.5px;
  }
  .edit-btn {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .delete-btn {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: red;
  }
  .delete-btn:hover {
    color: darkred;
  }
  </style>
  