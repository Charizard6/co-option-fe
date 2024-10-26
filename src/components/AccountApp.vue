<template>
  <div class="info-container">
    <div class="info-section">
      <h2>내 정보</h2>
      <div class="info-item">
        <label>이름:</label>
        <span>{{ userInfo.userName }}</span>
      </div>
      <div class="info-item">
        <label>ID:</label>
        <span>{{ userInfo.userId }}</span>
      </div>
    </div>

    <div class="info-section">
      <h2>구글 구독 정보</h2>
      <div class="info-item">
        <a :href="googleCalendarUrl" target="_blank" class="long-link">
          {{ googleCalendarUrl }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      userInfo: {
        userName: '',
        userId: ''
      },
      googleCalendarUrl:
        'https://calendar.google.com/calendar/u/0?cid=MmI3ODVmMTUwNzY3ZTAzOTVmZGRmOTAzMzBjYmRhMTUxYWU3ZTJiZDRkOTM2ODg2NmQ0NTNiZjVmM2MxNjc2MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'
    }
  },
  mounted() {
    this.userInfo.userName = this.getUserName
    this.userInfo.userId = this.getUser
  },
  computed: {
    ...mapGetters(['getUser', 'getUserSeq', 'getUserName'])
  }
}
</script>

<style scoped>
.info-container {
  display: flex;
  gap: 20px;
  margin-top: 10%;
}

.info-section {
  width: 100%;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item label {
  font-weight: bold;
  margin-right: 10px;
}

.description p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}
.info-item .long-link {
  display: inline-block; /* 줄바꿈이 적용될 수 있도록 설정 */
  overflow-wrap: break-word; /* 긴 단어(또는 URL)를 줄바꿈 */
  word-break: break-all; /* 단어가 길 경우 어디서든 줄바꿈 */
  white-space: normal; /* 기본적으로 여러 줄로 표시 */
}
</style>
