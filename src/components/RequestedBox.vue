<template>
  <div class="requested-box">
    <div class="content">
      <div class="task-list">
        <h2>요청받은 일정 및 Task</h2>
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>상신자</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.reqeustSeq" @click="selectTask(task)">
              <td>{{ task.requestNm }}</td>
              <td>{{ task.regId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="request-detail">
        <h2>요청 상세</h2>
        <div>
          <label for="request-content">요청 내용</label>
          <textarea id="request-content" rows="8" v-model="requestDesc"></textarea>
        </div>
        <div class="buttons">
          <button class="modify" @click="rejectRequest">거절</button>
          <button class="approve" @click="approveRequest">승인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'RequestedBox',
  data() {
    return {
      tasks: [],
      recipient: '',
      requestDesc: '',
      requestId: '',
      selectedTaskId: null // 선택된 요청의 ID를 저장하기 위한 변수
    }
  },
  methods: {
    fetchRequestData() {
      axios
        .post('http://localhost:9004/coOption/selectRequestList', { userId: this.getUser })
        .then((response) => {
          this.tasks = response.data
        })
        .catch(() => {})
      if (this.tasks.length > 0) {
        this.selectTask(this.tasks[0])
      }
    },
    selectTask(task) {
      this.selectedTaskId = task.reqeustSeq
      this.requestDesc = task.requestDesc
      this.requestType = task.requestType
    },
    rejectRequest() {
      const urlVal = this.requestType == 'task' ? 'Task' : 'Event'
      axios
        .post(`http://localhost:9004/coOption/request${urlVal}Reject`, {
          userSeq: this.getUserSeq,
          requestSeq: this.selectedTaskId
        })
        .then((response) => {
          if (response.ok) alert('요청 거절 완료되었습니다.')
        })
        .catch(() => alert('요청 거절 실패하였습니다.'))
    },
    approveRequest() {
      const urlVal = this.requestType == 'task' ? 'Task' : 'Event'
      axios
        .post(`http://localhost:9004/coOption/request${urlVal}Approval`, {
          userSeq: this.getUserSeq,
          requestSeq: this.selectedTaskId
        })
        .then((response) => {
          if (response.ok) alert('요청 승인 완료되었습니다.')
        })
        .catch(() => alert('요청 승인 실패하였습니다.'))
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getUserSeq'])
  },
  created() {
    this.fetchRequestData()
  }
}
</script>

<style>
.requested-box {
  background-color: #fff;
  padding: 20px;
  max-width: 1200px;
  margin: 50px auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
}

.content {
  margin-top: 5%;
  display: flex;
  justify-content: space-between;
}

.task-list {
  flex: 1;
  margin-right: 20px;
}

.task-list h2 {
  text-align: left;
  margin-bottom: 10px;
  color: #333;
}

.task-list table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
}

.task-list th,
.task-list td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.task-list th {
  background-color: #f2f2f2;
}

.request-detail {
  flex: 0.5;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.request-detail h2 {
  margin-bottom: 10px;
  color: #333;
}

.request-detail label {
  margin-top: 10px;
  margin-bottom: 5px;
  color: #666;
}

.request-detail textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  resize: none;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modify {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}

.approve {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
