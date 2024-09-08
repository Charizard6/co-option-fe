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
        <select v-model="selectedRecipients" multiple>
          <option v-for="recipient in recipients" :key="recipient.email" :value="recipient.email">
            {{ recipient.name }}
          </option>
        </select>
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
        <button v-else @click="saveEvent">Save</button>
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

export default {
  name: 'CalendarPage',
  components: {
    FullCalendar,
    EventPopup
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
        eventDidMount: this.handleRightClickEvent // 우클릭 이벤트 추가
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
      recipients: [
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' },
        { name: 'Alice Johnson', email: 'alice.johnson@example.com' }
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
      const { startStr, endStr, view } = this.selectedDateRange
      let calendarApi = view.calendar

      if (eventData.title && eventData.description) {
        const event = {
          summary: eventData.title,
          description: eventData.description,
          start: {
            date: startStr
          },
          end: {
            date: endStr
          }
        }

        this.tokenClient.callback = async (tokenResponse) => {
          if (tokenResponse.error !== undefined) {
            console.error('Token error:', tokenResponse.error)
            return
          }

          const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/yyh6066@gmail.com/events',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(event)
            }
          )

          if (response.ok) {
            const eventData = await response.json()
            console.log('Event created:', eventData)
            alert('이벤트가 구글 캘린더에 생성되었습니다!')

            calendarApi.removeAllEvents()
            this.fetchEventsForCurrentMonth()
          } else {
            console.error('이벤트 생성 오류:', response.statusText, response.status)
            alert('이벤트 생성에 실패했습니다. 다시 시도해주세요.')
          }
        }

        this.tokenClient.requestAccessToken()
      }

      this.showEventForm = false
    },
    cancelEventForm() {
      this.showEventForm = false
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
    async saveEvent() {
      // 수정된 이벤트를 저장
      const calendarApi = this.$refs.fullCalendar.getApi()
      const updatedEvent = {
        summary: this.selectedEvent.title,
        description: this.selectedEvent.description,
        start: {
          date: this.selectedEvent.start
        },
        end: {
          date: addOneDay(this.selectedEvent.end)
        }
      }

      this.tokenClient.callback = async (tokenResponse) => {
        if (tokenResponse.error !== undefined) {
          console.error('Token error:', tokenResponse.error)
          return
        }

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/yyh6066@gmail.com/events/${this.selectedEvent.id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEvent)
          }
        )

        if (response.ok) {
          console.log('Event updated successfully')
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
        } else {
          console.error('Failed to update event:', response)
        }
      }

      this.tokenClient.requestAccessToken()
    },
    deleteEvent() {
      if (!this.selectedEvent.id) return

      const calendarApi = this.$refs.fullCalendar.getApi()

      this.tokenClient.callback = async (tokenResponse) => {
        if (tokenResponse.error !== undefined) {
          console.error('Token error:', tokenResponse.error)
          return
        }

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/yyh6066@gmail.com/events/${this.selectedEvent.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        )

        if (response.ok) {
          console.log('Event deleted successfully')
          calendarApi.getEventById(this.selectedEvent.id).remove()
          this.resetForm()
        } else {
          console.error('Failed to delete event:', response)
        }
      }

      this.tokenClient.requestAccessToken()
    },
    resetForm() {
      this.selectedEvent = {
        id: null,
        title: '',
        description: '',
        start: '',
        end: ''
      }
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log('현재 이벤트:', events)
    },
    fetchEventsForCurrentMonth() {
      const calendarApi = this.$refs.fullCalendar.getApi()
      const start = new Date(calendarApi.view.currentStart).toISOString()
      const end = new Date(calendarApi.view.currentEnd).toISOString()

      calendarApi.removeAllEvents()

      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/yyh6066@gmail.com/events?key=AIzaSyAuwZFHrGAIap_XuVWCy4OEtYxwJQSjfzo&timeMin=${start}&timeMax=${end}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('구글 캘린더에서 가져온 이벤트:', data.items)

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

          console.log('현재 캘린더의 모든 이벤트:', calendarApi.getEvents())
        })
        .catch((error) => console.error('이벤트 가져오기 오류:', error))
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

<style scoped>
.demo-app {
  display: flex;
  height: 100%;
  font-family:
    Arial,
    Helvetica Neue,
    Helvetica,
    sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 1em;
}

.event-details-sidebar {
  width: 300px;
  padding: 1em;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.event-details-sidebar h2 {
  margin-top: 0;
}

.event-details-sidebar label {
  display: block;
  margin-bottom: 10px;
}

.event-details-sidebar input,
.event-details-sidebar textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  margin-top: 5px;
}

.event-details-sidebar button {
  margin-right: 10px;
  margin-top: 10px;
}
</style>
