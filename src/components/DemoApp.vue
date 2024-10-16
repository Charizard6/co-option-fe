<template>
  <div class="demo-app calendar-page">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" :options="calendarOptions" ref="fullCalendar">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
    <div class="event-details-sidebar" v-if="isRightClick">
      <!-- 우클릭한 경우 수신자 선택 폼과 요청 내용 폼 표시 -->
      <h2>일정 참가 요청</h2>
      <label>
        수신자:
        <div>
          <Multiselect
            v-model="selectedRecipients"
            :options="options"
            :searchable="true"
            :object="true"
            mode="multiple"
          />
        </div>
      </label>
      <label>
        요청내용:
        <textarea v-model="requestMessage" placeholder="요청 내용을 입력하세요"></textarea>
      </label>
      <button @click="sendRequest">상신</button>
    </div>

    <div class="event-details-sidebar" v-if="!isRightClick">
      <!-- 좌클릭한 경우 기존 Event Details 폼 표시 -->
      <h2 v-if="!isEditing">Event Details</h2>
      <h2 v-else>Edit Event</h2>
      <label>
        Title:
        <input v-model="selectedEvent.title" type="text" :readonly="!isEditing" />
      </label>
      <label>
        Description:
        <textarea v-model="selectedEvent.description" :readonly="!isEditing"></textarea>
      </label>
      <label>
        Start Date:
        <input v-model="selectedEvent.start" type="date" :readonly="!isEditing" />
      </label>
      <label>
        End Date:
        <input v-model="selectedEvent.end" type="date" :readonly="!isEditing" />
      </label>
      <div v-if="selectedEvent.id">
        <button v-if="!isEditing" @click="editEvent">Edit</button>
        <button v-else @click="updateEvent">Save</button>
        <button @click="deleteEvent">Delete</button>
        <button v-if="isEditing" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <EventPopup
      :visible="showEventForm"
      :isReadOnly="false"
      @submit="submitEventForm"
      @cancel="cancelEventForm"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import EventPopup from './eventPopup.vue'
import Multiselect from '@vueform/multiselect'

const addOneDay = (dateString, pm) => {
  // 날짜 문자열을 Date 객체로 변환
  const date = new Date(dateString)

  // 하루(밀리초로 24시간)를 더함
  pm ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1)

  // yyyy-mm-dd 형식으로 변환해서 반환
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
const url =
  'https://www.googleapis.com/calendar/v3/calendars/2b785f150767e0395fddf90330cbda151ae7e2bd4d9368866d453bf5f3c16761@group.calendar.google.com/events'

export default {
  name: 'CalendarPage',
  components: {
    FullCalendar,
    EventPopup,
    Multiselect
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialEvents: [],
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventDidMount: this.handleEventElementMount // 우클릭 이벤트 추가
      },
      currentEvents: [],
      showEventForm: false,
      selectedEvent: {
        id: null,
        title: '',
        description: '',
        start: '',
        end: ''
      },
      selectedDateRange: null,
      isEditing: false, // 수정 상태 여부를 나타내는 변수 추가
      isRightClick: false, // 우클릭 여부 플래그
      selectedRecipients: [],
      // recipients: [
      //   { name: 'John Doe', email: 'john.doe@example.com' },
      //   { name: 'Jane Smith', email: 'jane.smith@example.com' },
      //   { name: 'Alice Johnson', email: 'alice.johnson@example.com' }
      // ], 기본 멀티셀렉트는 객체 배열이되지만 지금 추가한거는 단일
      value: null,
      options: [
        { value: 'Java', label: 'Java' },
        { value: 'JavaScript', label: 'JavaScript' }
      ],
      requestMessage: '',
      selectedEventId: null // 선택된 이벤트 ID
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      this.selectedDateRange = selectInfo
      this.showEventForm = true
      this.resetForm()
    },
    async submitEventForm(eventData) {
      //일정 생성
      const { startStr, endStr, view } = this.selectedDateRange
      let calendarApi = view.calendar

      if (eventData.title && eventData.description) {
        const event = {
          eventNm: eventData.title,
          eventDesc: eventData.description,
          eventStartDate: startStr,
          eventEndDate: endStr
        }

        const response = await fetch('http://localhost:9002/coOption/createEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })

        if (!response.ok) {
          console.error('이벤트 생성 오류:', response.statusText, response.status)
          alert('이벤트 생성에 실패했습니다. 관리자에게 문의하세요.')
          return false
        }
        alert('이벤트가 구글 캘린더에 생성되었습니다!')
        calendarApi.removeAllEvents()
        this.fetchEventsForCurrentMonth()
      }
      this.showEventForm = false
    },
    cancelEventForm() {
      this.showEventForm = false
    },

    handleEventDblClick(clickInfo) {
      const event = clickInfo.event
      const path = `/task-manager/${event.id}`
      this.$router.push(path)
    },

    handleEventClick(clickInfo) {
      this.isRightClick = false //우클릭시 화면 비
      const event = clickInfo.event
      this.selectedEvent = {
        id: event.id,
        title: event.title,
        description: event.extendedProps.description || '',
        start: addOneDay(event.start.toISOString().split('T')[0]),
        end: event.end
          ? event.end.toISOString().split('T')[0]
          : addOneDay(event.start.toISOString().split('T')[0])
      }
      this.isEditing = false // 상세 보기 모드로 설정
    },
    editEvent() {
      // 수정 모드로 전환
      this.isEditing = true
    },
    async updateEvent() {
      // 수정된 이벤트를 저장
      const calendarApi = this.$refs.fullCalendar.getApi()
      const updatedEvent = {
        eventNm: this.selectedEvent.title,
        eventDesc: this.selectedEvent.description,
        eventStartDate: this.selectedEvent.start,
        eventEndDate: addOneDay(this.selectedEvent.end),
        eid: this.selectedEvent.id
      }

      const response = await fetch('http://localhost:9002/coOption/updateEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      })

      if (!response.ok) {
        console.error('Failed to update event:', response)
        return false
      }
      alert('이벤트가 수정되었습니다!')
      calendarApi.getEventById(this.selectedEvent.id).remove()
      calendarApi.addEvent({
        id: this.selectedEvent.id,
        title: this.selectedEvent.title,
        description: this.selectedEvent.description,
        start: this.selectedEvent.start,
        end: addOneDay(this.selectedEvent.end)
      })
      this.resetForm()
    },
    async deleteEvent() {
      //일정 삭제
      if (!this.selectedEvent.id) return
      const deleteEvent = {
        eid: this.selectedEvent.id
      }

      const calendarApi = this.$refs.fullCalendar.getApi()

      const response = await fetch('http://localhost:9002/coOption/deleteEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteEvent)
      })

      if (!response.ok) {
        console.error('Failed to delete event:', response)
        return false
      }
      alert('일정이 삭제되었습니다.')
      calendarApi.getEventById(this.selectedEvent.id).remove()
      this.resetForm()
    },
    cancelEdit() {
      // 수정 취소
      this.isEditing = false
    },
    resetForm() {
      this.selectedEvent = {
        id: null,
        title: '',
        description: '',
        start: '',
        end: ''
      }
      this.isEditing = false // 수정 모드를 초기화
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    fetchEventsForCurrentMonth() {
      //일정 가져오기
      const calendarApi = this.$refs.fullCalendar.getApi()
      const start = new Date(calendarApi.view.currentStart).toISOString()
      const end = new Date(calendarApi.view.currentEnd).toISOString()

      const calendarID = import.meta.env.VITE_GOOGLE_CALENDAR_ID
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
      calendarApi.removeAllEvents()

      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?key=${apiKey}&timeMin=${start}&timeMax=${end}`
      )
        .then((response) => response.json())
        .then((data) => {
          data.items.forEach((event) => {
            const existingEvent = calendarApi.getEventById(event.id)
            if (!existingEvent) {
              calendarApi.addEvent({
                id: event.id,
                title: event.summary,
                description: event.description,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                allDay: !event.start.dateTime
              })
            }
          })
        })
        .catch((error) => console.error('이벤트 가져오기 오류:', error))
    },
    handleEventElementMount(info) {
      // 함수명 변경 및 수정된 부분**
      const eventElement = info.el
      const event = info.event

      // **우클릭 이벤트 처리**
      eventElement.addEventListener('contextmenu', (e) => {
        e.preventDefault() // 기본 우클릭 메뉴 방지
        this.isRightClick = true // 우클릭 시 폼 활성화
        this.selectedEventId = event.id // 선택한 이벤트 ID 저장
      })

      // **더블클릭 이벤트 처리 추가**
      eventElement.addEventListener('dblclick', (e) => {
        e.preventDefault() // 기본 동작 방지
        const path = `/task-manager/?eid=${event.id}`
        this.$router.push(path)
      })
    },
    async sendRequest() {
      if (this.selectedRecipients.length === 0 || this.requestMessage.trim() === '') {
        alert('수신자와 요청 내용을 입력하세요.')
        return
      }
      const payload = {
        eid: this.selectedEventId,
        //recipients: this.selectedRecipients, 수신자 배열? 고민좀
        requestNm: this.requestMessage
      }
      const response = await fetch('http://localhost:9001/api/users/insertUserRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        console.error('오류:', response.statusText, response.status)
        alert('일정 참가 요청을 실패했습니다. 관리자에게 문의하세요.')
        return false
      }
      alert('일정 참가 요청을 전송하였습니다.')
      this.resetForm()
    }
  },
  mounted() {
    const initializeTokenClient = () => {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '876254035630-g62ieo374dtb0d1b72gbut51rn00o5gq.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.events'
      })

      this.fetchEventsForCurrentMonth()
    }

    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
      initializeTokenClient()
    } else {
      window.addEventListener('load', initializeTokenClient)
    }
  }
}
</script>

<style lang="css" src="/src/css/demoAppVue.css"></style>
<style src="@vueform/multiselect/themes/default.css"></style>
