<template>
  <div class="requested-box">
    <h1>Co-Option</h1>
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
            <tr v-for="task in tasks" :key="task.id" @click="selectTask(task)">
              <td>{{ task.title }}</td>
              <td>{{ task.sender }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="request-detail">
        <h2>요청 상세</h2>
        <div>
          <label for="recipient">수신자</label>
          <textarea id="recipient" rows="4" v-model="recipient"></textarea>
        </div>
        <div>
          <label for="request-content">요청 내용</label>
          <textarea id="request-content" rows="8" v-model="requestContent"></textarea>
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
export default {
  name: 'RequestedBox',
  data() {
    return {
      tasks: [],
      recipient: '',
      requestContent: '',
      requestId: '',
      selectedTaskId: null // 선택된 요청의 ID를 저장하기 위한 변수
    }
  },
  methods: {
    fetchRequestData() {
      // URL의 쿼리 파라미터에서 id 값을 추출합니다.
      const urlParams = new URLSearchParams(window.location.search)
      this.requestId = urlParams?.get('id')

      // if (!this.requestId) {
      //   console.error('URL에서 id를 찾을 수 없습니다.')
      //   return
      // }
      // axios
      //   .post('/api/request', JSON.stringify({ id: this.requestId }))
      //   .then((response) => {
      //   })
      //   .catch(() => {})
      // 예시 데이터 사용
      // 실제 API가 준비되면 이 부분을 axios 요청으로 대체하세요.
      this.tasks = [
        {
          id: 1,
          title: '- 체중모임 작담모임',
          sender: 'Choi',
          recipient: '홍길동',
          requestContent: '요청 상세 내용 1이 여기에 표시됩니다.'
        },
        {
          id: 2,
          title: '- 프로젝트 관리 포토타입 제작',
          sender: 'Choi',
          recipient: '김철수',
          requestContent: '요청 상세 내용 2이 여기에 표시됩니다.'
        },
        {
          id: 3,
          title: '- 업무 보안지침서 검토 Task 추가 의 건',
          sender: 'Choi',
          recipient: '이영희',
          requestContent: '요청 상세 내용 3이 여기에 표시됩니다.'
        }
      ]
      // 첫 번째 태스크를 기본으로 선택
      if (this.tasks.length > 0) {
        this.selectTask(this.tasks[0])
      }
    },
    selectTask(task) {
      // 선택된 태스크의 ID와 상세 내용을 설정합니다.
      this.selectedTaskId = task.id
      this.recipient = task.recipient
      this.requestContent = task.requestContent
    },
    rejectRequest() {
      // 거절 버튼 클릭 시 실행될 로직
      if (this.selectedTaskId) {
        alert(`요청을 거절하였습니다. 요청 ID: ${this.selectedTaskId}`)
        // 필요한 추가 로직을 구현하세요.
      } else {
        alert('선택된 요청이 없습니다.')
      }
    },
    approveRequest() {
      // 승인 버튼 클릭 시 실행될 로직
      if (this.selectedTaskId) {
        alert(`요청을 승인하였습니다. 요청 ID: ${this.selectedTaskId}`)
        // 필요한 추가 로직을 구현하세요.
      } else {
        alert('선택된 요청이 없습니다.')
      }
    }
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
