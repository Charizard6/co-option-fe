<template>
  <div class="demo-app calendar-page">
    <div class="demo-app-sidebar">
      <!-- <div class="demo-app-sidebar-section">
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div> -->
      <!-- <div class="demo-app-sidebar-section">
        <label>
          <input
            type="checkbox"
            :checked="calendarOptions.weekends"
            @change="handleWeekendsToggle"
          />
          toggle weekends
        </label>
      </div> -->
      <!-- <div class="demo-app-sidebar-section">
        <h2>All Events ({{ currentEvents.length }})</h2>
        <ul>
          <li v-for="event in currentEvents" :key="event.id">
            <b>{{ event.startStr }}</b>
            <i>{{ event.title }}</i>
          </li>
        </ul>
      </div> -->
    </div>
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" :options="calendarOptions" ref="fullCalendar">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
    <EventPopup
      :visible="showEventForm"
      :isReadOnly="isReadOnly"
      :initialTitle="initialTitle"
      :initialDescription="initialDescription"
      :initialStartDate="initialStartDate"
      :initialEndDate="initialEndDate"
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
import EventPopup from './eventPopup.vue' // eventPopup.vue 파일을 가져옵니다.

export default {
  name: 'CalendarPage',
  components: {
    FullCalendar,
    EventPopup // 등록
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
        initialEvents: [], // 화면에 표시할 초기 이벤트를 비워둠
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        // events 옵션을 주석 처리하여 `fetchEventsForCurrentMonth` 함수에서만 이벤트를 관리
        // events: {
        //   googleCalendarId: 'yyh6066@gmail.com'
        // },
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
      },
      currentEvents: [],
      showEventForm: false, // 팝업 창을 제어하는 변수
      selectedDateRange: null
    }
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends
    },
    handleDateSelect(selectInfo) {
      this.selectedDateRange = selectInfo
      this.showEventForm = true
      this.isReadOnly = false // 작성 모드로 설정
      this.initialTitle = '' // 빈 값으로 초기화
      this.initialDescription = '' // 빈 값으로 초기화
      this.initialStartDate = '' // 빈 값으로 초기화
      this.initialEndDate = '' // 빈 값으로 초기화
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

            calendarApi.removeAllEvents() // 기존 이벤트 제거
            this.fetchEventsForCurrentMonth() // 등록 후 구글 캘린더와 동기화
          } else {
            console.error('이벤트 생성 오류:', response.statusText, response.status)
            alert('이벤트 생성에 실패했습니다. 다시 시도해주세요.')
          }
        }

        this.tokenClient.requestAccessToken() // 액세스 토큰 요청
      }

      this.showEventForm = false // 폼을 숨깁니다.
    },
    cancelEventForm() {
      this.showEventForm = false // 폼을 숨깁니다.
    },
    handleEventClick(clickInfo) {
      const event = clickInfo.event
      this.showEventForm = true
      this.isReadOnly = true // 읽기 전용 모드로 설정
      this.initialTitle = event.title
      this.initialDescription = event.extendedProps.description || ''
      this.initialStartDate = event.start.toISOString().split('T')[0]
      this.initialEndDate = event.end
        ? event.end.toISOString().split('T')[0]
        : this.initialStartDate
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log('현재 이벤트:', events) // 이벤트를 콘솔에 출력
      //let eventTitles = events.map((event) => event.title).join('\n')
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
                description: event.description, // 설명 추가
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

      this.fetchEventsForCurrentMonth() // 구글 캘린더 이벤트를 불러옵니다.
    }

    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
      initializeTokenClient()
    } else {
      window.addEventListener('load', initializeTokenClient)
    }
  }
}
</script>

<style lang="css">
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family:
    Arial,
    Helvetica Neue,
    Helvetica,
    sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
