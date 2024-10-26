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
            {{ participant.userName }} - {{ participant.userMail }}
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
            <li v-for="task in sharedTasks" :key="task.taskSeq" class="task-item">
              <div class="task-body">
                <input
                  type="checkbox"
                  :checked="task.completeYn == 'Y'"
                  @change="toggleTaskCompletion(task, 'shared')"
                />
                <div class="task-info">
                  <p class="task-title">{{ task.taskNm }}</p>
                  <p class="task-status">{{ task.taskDate.substring(0, 10) }}</p>
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
                  :checked="task.completeYn == 'Y'"
                  @change="toggleTaskCompletion(task, 'personal')"
                />
                <div class="task-info">
                  <p class="task-title">{{ task.taskNm }}</p>
                  <p class="task-status">{{ task.taskDate.substring(0, 10) }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 태스크 추가 버튼 -->
    <div class="task-actions">
      <button @click="addTask('Y')">공유 Task 추가</button>
      <button @click="addTask('N')">개인 Task 추가</button>
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
import { mapGetters } from 'vuex'

export default {
  components: {
    taskPopup
  },
  data() {
    return {
      eventSeq: null,
      progress: 30,
      participants: [],
      content: '',
      sharedTasks: [],
      personalTasks: [],
      eventId: '',
      showEventPopup: false,
      currentTaskType: '' // 'shared' =Y 또는 'personal' =N 값을 가짐
    }
  },
  methods: {
    fetchData() {
      const url = new URL(window.location.href)
      this.eventId = url.searchParams.get('eid')
      // 서버에서 참가자 데이터를 가져오는 비동기 통신 (예시로 실제 통신 대신 임시 데이터 추가)

      axios
        .post('http://localhost:9002/coOption/getEvent', { eid: this.eventId })
        .then(async (response) => {
          this.eventSeq = response.data.eventSeq
          this.content = response.data.eventDesc
          getTaskList()
          getUserList()
        })
      const getUserList = () => {
        axios
          .post('http://localhost:9002/coOption/getEventUser', { eventSeq: this.eventSeq })
          .then((response) => {
            // this.participants = parsedData
            //const parsedData = JSON.parse(response.data);
            // 임의의 데이터를 사용
            this.participants = response.data
          })
          .catch(() => {})
      }
      const getTaskList = () => {
        axios
          .post('http://localhost:9003/coOption/selectTaskList', { eventSeq: this.eventSeq })
          .then((response) => {
            this.personalTasks = response.data.filter((task) => task.taskType === 'N')
            this.sharedTasks = response.data.filter((task) => task.taskType === 'Y')
          })
          .catch(() => {})
      }
    },
    addTask(type) {
      this.showEventPopup = true
      this.currentTaskType = type
    },
    handleEventPopupSubmit(data) {
      const newTask = {
        //이벤트 아이디 가데이터
        eventSeq: this.eventSeq,
        taskNm: data.title,
        taskDate: data.desc,
        taskType: this.currentTaskType
      }

      axios
        .post(`http://localhost:9003/coOption/addTask`, newTask)
        .then(() => {
          this.fetchData()
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.showEventPopup = false
          this.fetchData()
        })
    },
    handleEventPopupCancel() {
      this.showEventPopup = false
    },
    requestTask(type) {
      this.showEventPopup = true
      this.currentTaskType = type
    },
    toggleTaskCompletion(task) {
      // 완료 상태에 따라 완료 혹은 미완료 처리 (서버로 비동기 전송)
      axios
        .post(`http://localhost:9003/coOption/completeYNChange`, {
          taskSeq: task.taskSeq,
          // eslint-disable-next-line no-constant-condition
          completeYn: task.completeYn == 'Y' ? 'N' : 'Y'
        })
        .then((response) => {
          if (response.ok) {
            this.fetchData()
            return false
          }
        })
    },
    getNextDay(dateString) {
      // 문자열을 Date 객체로 변환
      const date = new Date(dateString)

      // 하루(밀리초 기준으로 86400000) 추가
      date.setDate(date.getDate() + 1)

      // YYYY-MM-DD 형식으로 포맷
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getUserSeq'])
  },
  created() {
    // 화면 로드 전에 하드코딩된 데이터를 불러옴
    this.fetchData()
  }
}
</script>

<style lang="css" src="/src/css/TaskManagerVue.css"></style>
