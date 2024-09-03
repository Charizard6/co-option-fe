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
            <tr>
              <td>- 체중모임 작담모임</td>
              <td>Choi</td>
            </tr>
            <tr>
              <td>- 프로젝트 관리 포토타입 제작</td>
              <td>Choi</td>
            </tr>
            <tr>
              <td>- 업무 보안지침서 검토 Task 추가 의 건</td>
              <td>Choi</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="request-detail">
        <h2>요청 상세</h2>
        <div>
          <label for="recipient">수신자</label>
          <textarea id="recipient" rows="4"></textarea>
        </div>
        <div>
          <label for="request-content">요청 내용</label>
          <textarea id="request-content" rows="8"></textarea>
        </div>
        <div class="buttons">
          <button class="modify">거절</button>
          <button class="approve">승인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestedBox'
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
