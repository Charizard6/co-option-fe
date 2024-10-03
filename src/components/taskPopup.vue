<template>
  <div v-if="visible" class="event-form-overlay" @click="handleOverlayClick">
    <div class="event-form" @click.stop>
      <h2 v-if="isReadOnly">Event Details</h2>
      <h2 v-else>Create Task</h2>
      <label>
        Title:
        <input v-model="title" type="text" :readonly="isReadOnly" placeholder="Enter event title" />
      </label>
      <label>
        Completed Date:
        <input v-model="completedDate" type="date" :readonly="isReadOnly" />
      </label>

      <div class="button-group">
        <button v-if="!isReadOnly" @click="submitForm">Confirm</button>
        <button @click="cancelForm">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    initialTitle: {
      type: String,
      default: ''
    },
    initialCompletedDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: this.initialTitle,
      completedDate: this.initialCompletedDate
    }
  },
  watch: {
    initialTitle(val) {
      this.title = val
    },
    initialCompletedDate(val) {
      this.completedDate = val
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { title: this.title, completedDate: this.completedDate })
      this.title = ''
      this.completedDate = ''
    },
    cancelForm() {
      this.$emit('cancel')
      this.title = ''
    },
    handleOverlayClick() {
      this.cancelForm() // 오버레이를 클릭하면 팝업이 닫히도록 처리 (필요하지 않으면 이 줄을 삭제)
    }
  }
}
</script>

<style scoped>
.event-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 팝업이 최상단에 위치하도록 설정 */
}

.event-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 10000; /* 팝업 내용이 최상단에 위치하도록 설정 */
}

.event-form h2 {
  margin-top: 0;
}

.event-form label {
  display: block;
  margin-bottom: 10px;
}

.event-form input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.button-group button {
  margin-right: 10px;
}
</style>
