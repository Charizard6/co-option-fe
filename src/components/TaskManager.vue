<template>
  <div class="app-container">
    <div class="header">
      <h1>프로젝트관리 프로토타입 제작. <span class="status">[진행중]</span></h1>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
        <span>{{ progress }}%</span>
      </div>
    </div>

    <div class="main-layout">
      <!-- 좌측: 참가자와 내용 -->
      <div class="left-section">
        <h2>참가자</h2>
        <div class="participants-scrollable">
          <div class="participant" v-for="participant in participants" :key="participant.id">
            {{ participant.name }} - {{ participant.role }}
          </div>
        </div>

        <h2>내용</h2>
        <div class="content-details-scrollable">
          <p>{{ content }}</p>
        </div>
      </div>

      <!-- 중간: 공유 태스크 -->
      <div class="center-section">
        <h2>Share Task</h2>
        <div class="task-list-scroll">
          <ul>
            <li v-for="task in sharedTasks" :key="task.id" class="task-item">
              <div class="task-body">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  @change="toggleTaskCompletion(task, 'shared')"
                />
                <div class="task-info">
                  <p class="task-title">{{ task.name }}</p>
                  <p class="task-status">미리 알림</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="right-section">
        <h2>Task List</h2>
        <div class="task-list-scroll">
          <ul>
            <li v-for="task in personalTasks" :key="task.taskSeq" class="task-item">
              <div class="task-body">
                <input
                  type="checkbox"
                  :checked="task.completeYn"
                  @change="toggleTaskCompletion(task, 'personal')"
                />
                <div class="task-info">
                  <p class="task-title">{{ task.taskNm }}</p>
                  <p class="task-status">미리 알림</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 태스크 추가 버튼 -->
    <div class="task-actions">
      <button @click="addTask('shared')">공유 Task 추가</button>
      <button @click="addTask('personal')">개인 Task 추가</button>
      <button @click="requestTask('personal')">개인 Task 요청</button>
    </div>
    <taskPopup
      v-if="showEventPopup"
      :visible="showEventPopup"
      :isReadOnly="false"
      @submit="handleEventPopupSubmit"
      @cancel="handleEventPopupCancel"
    />
  </div>
</template>

<script>
import axios from 'axios'
import taskPopup from './taskPopup.vue'

export default {
  components: {
    taskPopup
  },
  data() {
    return {
      progress: 30,
      participants: [],
      content: '',
      sharedTasks: [],
      personalTasks: [],
      eventId: '',
      showEventPopup: false,
      currentTaskType: '' // 'shared' 또는 'personal' 값을 가짐
    }
  },
  methods: {
    fetchData() {
      const url = new URL(window.location.href)
      this.eventId = url.searchParams.get('eid')
      // 서버에서 참가자 데이터를 가져오는 비동기 통신 (예시로 실제 통신 대신 임시 데이터 추가)
      axios
        .post('/api/participants', { eventSeq: this.eventId })
        .then((response) => {
          // this.participants = parsedData
          //const parsedData = JSON.parse(response.data);
          // 임의의 데이터를 사용
          this.participants = [
            { id: 1, name: '문익점', role: 'Master' },
            { id: 2, name: '블라드미르푸틴', role: 'Developer' },
            { id: 3, name: '문익점', role: 'Master' },
            { id: 4, name: '문익점', role: 'Master' },
            { id: 5, name: '문익점', role: 'Master' },
            { id: 6, name: '문익점', role: 'Master' }
          ]
        })
        .catch(() => {})

      // 서버에서 내용을 가져오는 비동기 통신 (예시로 실제 통신 대신 임시 데이터 추가)
      axios
        .get('/api/content', { eventSeq: this.eventId })
        .then((response) => {
          // this.content = parsedData
          //const parsedData = JSON.parse(response.data);
          this.content =
            'Co-Option 중간보고 발표자료 프로토타입 제작.Co-Option 중간보고 발표자료 프로토타입 제작.Co-Option 중간보고 발표자료 프로토타입 제작.Co-Option 중간보고 발표자료 프로토타입 제작.Co-Option 중간보고 발표자료 프로토타입 제작.Co-Option 중간보고 발표자료 프로토타입 제작.Co-Option 중간보고 발표자료 프로토타입 제작.'
        })
        .catch(() => {})

      // 서버에서 공유 태스크 데이터를 가져오는 비동기 통신 (예시로 실제 통신 대신 임시 데이터 추가)
      axios
        .get('/api/tasks/shared', { eventSeq: this.eventId })
        .then((response) => {
          // this.sharedTasks = parsedData
          //const parsedData = JSON.parse(response.data);
          this.sharedTasks = [
            {
              id: 1,
              name: '64p',
              deadline: '2022.10.18',
              completed: false
            },
            {
              id: 2,
              name: '여행병법',
              deadline: '2022.8.10',
              completed: true
            }
          ]
        })
        .catch(() => {})

      // 서버에서 개인 태스크 데이터를 가져오는 비동기 통신 (예시로 실제 통신 대신 임시 데이터 추가)
      axios
        .post('http://localhost:9003/coOption/selectTaskList', { eventSeq: 1 })
        .then((response) => {
          this.personalTasks = response.data
          //const parsedData = JSON.parse(response.data);
          // this.personalTasks = [
          //   {
          //     id: 1,
          //     name: '무신사 둘러보기',
          //     deadline: '2023.2.9',
          //     completed: false,
          //   },
          //   {
          //     id: 2,
          //     name: '미용실 예약',
          //     deadline: '2023.2.5',
          //     completed: true,
          //   }
          // ]
        })
        .catch(() => {})
    },
    addTask(type) {
      this.showEventPopup = true
      this.currentTaskType = type
    },
    handleEventPopupSubmit(data) {
      const newTask = {
        id: this.eventId,
        name: data.title,
        deadline: data.completedDate,
        completed: false,
        type: this.currentTaskType
      }

      axios
        .post(`/api/tasks`, newTask)
        .then((response) => {
          if (this.currentTaskType === 'shared') {
            this.sharedTasks.push(response.data)
          } else if (this.currentTaskType === 'personal') {
            this.personalTasks.push(response.data)
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.showEventPopup = false
        })
    },
    handleEventPopupCancel() {
      this.showEventPopup = false
    },
    requestTask(type) {
      this.showEventPopup = true
      this.currentTaskType = type
    },
    toggleTaskCompletion(task, type) {
      const updatedTask = { ...task, completed: !task.completed }

      // 완료 상태에 따라 완료 혹은 미완료 처리 (서버로 비동기 전송)
      if (type === 'shared') {
        axios.put(`/api/tasks/shared/${task.id}/completion`, updatedTask).then(() => {
          task.completed = updatedTask.completed
        })
      } else if (type === 'personal') {
        axios.put(`/api/tasks/personal/${task.id}/completion`, updatedTask).then(() => {
          task.completed = updatedTask.completed
        })
      }
    }
  },
  created() {
    // 화면 로드 전에 하드코딩된 데이터를 불러옴
    this.fetchData()
  }
}
</script>

<style lang="css" src="/src/css/TaskManagerVue.css"></style>
