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
        <div class="participants">
          <div v-for="participant in participants" :key="participant.id">
            {{ participant.name }} - {{ participant.role }}
          </div>
        </div>

        <h2>내용</h2>
        <div class="content-details">
          <p>{{ content }}</p>
        </div>
      </div>

      <!-- 중간: 공유 태스크 -->
      <div class="center-section">
        <h2>Share Task</h2>
        <div class="task-list-scroll">
          <ul>
            <li v-for="task in sharedTasks" :key="task.id">
              <p>{{ task.name }}</p>
              <small>{{ task.deadline }} 완료: {{ task.completed_at }}</small>
            </li>
          </ul>
        </div>
      </div>

      <!-- 우측: 개인 태스크 -->
      <div class="right-section">
        <h2>Task List</h2>
        <div class="task-list-scroll">
          <ul>
            <li v-for="task in personalTasks" :key="task.id">
              <p>{{ task.name }}</p>
              <small>{{ task.deadline }} 완료: {{ task.completed_at }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 태스크 추가 버튼 -->
    <div class="task-actions">
      <button @click="addTask('shared')">공유 Task 추가</button>
      <button @click="addTask('personal')">개인 Task 추가</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 78,
      participants: [],
      content: '',
      sharedTasks: [],
      personalTasks: []
    }
  },
  methods: {
    fetchData() {
      this.participants = [
        { id: 1, name: '문익점(moon_lckSpot)', role: 'Master' },
        { id: 2, name: '블라드미르푸틴(sibak)', role: '' }
      ]

      this.content = 'Co-Option 중간보고 발표자료 프로토타입 제작.'

      this.sharedTasks = [
        { id: 1, name: '64p', deadline: '2022.10.18', completed_at: '2022.10.18 오후 11:07' },
        { id: 2, name: '여행병법', deadline: '2022.8.10', completed_at: '2022.10.18 오후 11:07' }
      ]

      this.personalTasks = [
        {
          id: 1,
          name: '무신사 둘러보기',
          deadline: '2023.2.9',
          completed_at: '2023.2.9 오후 10:34'
        },
        { id: 2, name: '미용실 예약', deadline: '2023.2.5', completed_at: '2023.2.5 오전 2:13' }
      ]
    },
    addTask(type) {
      const newTask = {
        id: Date.now(),
        name: '새로운 태스크',
        deadline: '미리 알림',
        completed_at: '추가 완료'
      }

      if (type === 'shared') {
        this.sharedTasks.push(newTask)
      } else if (type === 'personal') {
        this.personalTasks.push(newTask)
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="css" src="/src/css/TaskManagerVue.css"></style>
