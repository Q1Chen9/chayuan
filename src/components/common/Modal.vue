<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div class="modal-backdrop" v-if="show" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <slot name="header">
              <h3>{{ title }}</h3>
            </slot>
            <button class="modal-close-btn" @click="close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="btn-primary" @click="close">确认</button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '通知'
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background: rgba(6, 30, 65, 0.95);
  border: 1px solid rgba(71, 200, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
  width: 500px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(71, 200, 255, 0.3);

  h3 {
    margin: 0;
    font-size: 18px;
    color: #23fdc0;
  }
}

.modal-close-btn {
  background: none;
  border: none;
  color: #aaccdd;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  color: #d5f1f8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid rgba(71, 200, 255, 0.3);

  .btn-primary {
    background-color: rgba(35, 253, 192, 0.2);
    border: 1px solid rgba(35, 253, 192, 0.5);
    color: #23fdc0;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(35, 253, 192, 0.3);
    }
  }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style> 