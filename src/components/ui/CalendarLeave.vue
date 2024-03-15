
<template>
  <div>
    <FullCalendar 
    ref="calendarRef" :options='calendarOptions' />
    <div class="flex justify-center">
      <div
        v-if="modalOpen"
        class="
          fixed
          inset-0
          z-10
          flex
          items-center
          justify-center
          bg-gray-700 bg-opacity-50
        "
      >
        <div class="max-w-2xl w-96 p-6 bg-white rounded-md shadow-xl">
          <div class="flex items-center justify-between">
            <h4 class="text-md">{{ formatDate(newLeave.start) }} - {{ formatDate(beforeDay(newLeave.end))  }} ({{ newLeave.number_of_days }} Gün) </h4>
            <svg
              @click="modalOpen = false"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-red-900 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mt-4">
            <div class="mb-4 text-sm grid gap-3">
              <div class="group">
                <label for="title" class="block mb-1 text-sm w-100">İzin Türü: </label>
                <!-- <select v-model="newLeave.type" id="leave_type" class="diji-input input-md" required>
                  <option :value="event.id" v-for="event in $globalVeriable.eventType" :disabled="event.disabled" class="disabled:bg-gray-500 disabled:text-white" :key="event.id">{{ event.name }}</option>
                </select> -->
                <div class="grid gap-2 grid-cols-3">
                  <button @click="newLeave.type=event.id" v-for="event in $globalVeriable.eventType" :disabled="event.disabled" :class="{'bg-blue-600 text-white' : newLeave.type==event.id}" class="border border-zinc p-1 rounded-sm disabled:bg-gray-500 disabled:text-white" :key="event.id">{{ event.name }}</button>
                </div>  
                  
              </div>
              <div class="flex w-full">
                <!-- Raporlu İse -->
                <div class="group grid gap-1" v-if="newLeave.type==2"> 
                  
                  <label for="title" class="block mb-1 text-sm w-100">Raporunuzu yükleyebilirsiniz. </label>
                  <input type="file" @change="handleFileChange"/>
                  <p>.pdf, .jpg, .png - (Max:600kB)</p>
                </div>
                <div class="group grid gap-3 w-1/2" v-if="newLeave.type==1">
                  <label>
                    <input type="radio" v-model="newLeave.leave_type" value="0">
                    Tam Gün 
                  </label>

                  <label>
                    <input type="radio" v-model="newLeave.leave_type" value="1" :disabled="newLeave.number_of_days>1">
                    Yarım Gün
                  </label>

                  <label>
                    <input type="radio" v-model="newLeave.leave_type" value="2" :disabled="newLeave.number_of_days>1">
                    Saatlik
                  </label>
                </div>
                <div class="group border grid gap-3 p-3 w-1/2 text-red-500 border-red-500"
                  v-if="newLeave.number_of_days>1 && newLeave.type==1">
                  1'den fazla gün seçildiği için Tam Gün zorunludur.
                </div>
                <div class="group border grid gap-3 p-3 w-full text-red-500 border-red-500" v-if="newLeave.type==3">
                  Uçuş modu öncesinde ve sonrasında yıllık izin kullanılamayacaktır.
                </div>
                <div class="group border grid gap-3 p-3 w-1/2" v-if="newLeave.leave_type==1">
                  <label>
                    <input type="radio" class="active:text-red-400" v-model="newLeave.half_type" value="0">
                    Öğleden Önce
                  </label>

                  <label>
                    <input type="radio" class="active:text-red-400" v-model="newLeave.half_type" value="1">
                    Öğleden Sonra
                  </label>
                </div>
                <div class="group border grid gap-3 p-3 w-1/2 grid-cols-2" v-if="newLeave.leave_type==2">
                    <div>
                      <label for="startHours" class="block mb-1 text-sm w-100">Başlangıç</label>
                      <select class="diji-input input-md" v-model="newLeave.startHours">
                        <option v-for="h in hoursList" :key="h" :value="h">
                          {{ h }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label for="startHours" class="block mb-1 text-sm w-100">Bitiş</label>
                      <select class="diji-input input-md" v-model="newLeave.endHours">
                        <option v-for="h in hoursList" :key="h" :value="h" :disabled="hoursControl(newLeave.startHours, h)" class="disabled:bg-gray-500 disabled:text-white">
                          {{ h }}
                        </option>
                      </select>
                    </div>
                </div>
              </div>
            </div>
            <button
              @click="modalOpen = false"
              class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
            >
              VAZGEÇ
            </button>
            <button class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded" @click="saveLeave">
              KAYDET
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//Takvim ile ilgili
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import trLocale from '@fullcalendar/core/locales/tr';

import { mapActions } from 'vuex';

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  props:[
    'filter_user'
  ],
  data() {
    return {
      calendarOptions: {
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        plugins: [
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin
        ],
        // hiddenDays: [0, 6],
        select: this.handleDateSelect,
        eventClick: this.deleteLeave,
        eventsSet: this.handleEvents,
        initialView: 'dayGridMonth',
        locale:trLocale,
        timeZone: 'local',
        events: [
        ],
        eventContent: function (arg) {
          if(!arg.event.allDay){
            const startTime = arg.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = arg.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              html: `<div class="event-title fc-daygrid-event" style="background-color:#ddd"> ${startTime}-${endTime} ${arg.event.title}</div>`,
              display: 'block',
            };
          }else{
            return {
              html: `<div class="event-title"> ${arg.event.title}</div>`,
              display: 'block',
            };
          }
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right:''
          // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        contentHeight:'auto'
      },
      dayHours:9,
      currentEvents: [],
      modalOpen:false,
      newLeave:this.emptyLeave(),
      selectInfo:null,
      timeZone: 'UTC',
      hoursList:[
        '08:30',
        '09:30',
        '10:30',
        '11:30',
        '12:30',
        '13:30',
        '14:30',
        '15:30',
        '16:30',
        '17:30',
        '18:30'
      ],
      eventListDate:[]
    }
  },
  methods: {
    
    ...mapActions(['setNotify']),
    emptyLeave(){
      return {
        user_id:this.$store.state.userInfo.id,
        title:null,
        start:null,
        end:null,
        type:1,
        leave_type:0, // Burada 0 : tam gün, 1 : yarım gün, 2 : saatlik
        half_type:0, //Burada 0 öğleden önceyi, 1 ise öğleden sonrayı ifade ediyoreee..
        startHours:'08:30',
        endHours:'18:30',
        number_of_days:1,
        hours:this.dayHours,
        compensationStatus:0
      }
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    async saveLeave(){
      
        if(this.newLeave.leave_type==1 || this.newLeave.leave_type==2){ //saatleri ayarla
          const newDatestart = new Date(`${this.newLeave.start}T${this.newLeave.startHours}:00.000Z`);
          const newDateend = new Date(`${this.newLeave.start}T${this.newLeave.endHours}:00.000Z`);
          if (!isNaN(newDatestart.getTime())) {
            this.newLeave.start = newDatestart.toISOString();
            this.newLeave.end = newDateend.toISOString();
          } else {
            console.error("Geçersiz tarih veya saat bilgisi");
          }
        }

        if(this.newLeave.leave_type==2){ //saatlik izinlerde telafi için status ekleniyor
          this.newLeave.compensationStatus=1
        }

        this.newLeave.title=this.eventTitle(this.newLeave,'details')

        if (this.newLeave.type == 2) {
          if (this.$refs.fileInput && this.$refs.fileInput.files) {
            const selectedFile = this.$refs.fileInput.files[0];
            if (selectedFile && selectedFile.size > 0) {
              this.newLeave.file = selectedFile;
            } else {
              alert("Dosya seçimi zorunludur");
              return; // Dosya seçimi yapılmamışsa işlemi sonlandır
            }
          }
        }

        if (this.newLeave.leave_type == 0) { // tarih formatından kaynaklı önceki gün ekleniyor.
          this.newLeave.end=new Date(this.beforeDay(this.newLeave.end)).toISOString();
        }


        let calendarApi = this.selectInfo.view.calendar
        
        await this.$http.post("calendar", this.newLeave)
          .then((response)=>{
            const data = response.data.data
            this.setNotify({
              'desc': response.data.message.text,
              'class': 'success'
            });
            let start=new Date(data.start)
            let end=new Date(data.end)
            if(data.leave_type==0){ //burada eğer tam gün tipi ise sadece tarih bilgisi alınıyor.
              start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
              end.setHours(start.getHours(), start.getMinutes());
              end.setDate(end.getDate() + 1 );
              start = start.toISOString().split('T')[0];
              end = end.toISOString().split('T')[0];
            }
            calendarApi.addEvent({
              id: data.id,
              title:this.eventTitle(data,'details'), 
              start: start,
              end: end,
              allDay: data.leave_type == 0  ? true : false,
              extendedProps:{
                type:data.type
              },
              color:data.type == 0  ? 'red' : data.type==1 ? 'default' : 'gray', 
            })
            this.$emit('changeList');
            this.selectInfo=null
            this.newLeave=this.emptyLeave();
            this.modalOpen=false
          }).catch((error)=>{
            this.setNotify({
              'desc': error,
              'class': 'danger'
            });
          })
    },
    async deleteLeave(clickInfo) {

        const now = new Date();
        const start = new Date(clickInfo.event.start)
        if(start<now){
          this.$swal({
              title: 'Uyarı',
              text: 'Geçmiş tarihlerde silme işlemi yapılamamaktadır.',
              icon: 'warning',
              confirmButtonText: 'Tamam',
          });
          return false;
        }
        if(clickInfo.event.extendedProps.type==0){
          this.setNotify({
            'desc': "Resmi tatillere işlem yapamıyoruz maalesef... :( ",
            'class': 'warning'
          });
          return false
        }
        this.$swal({
            title: 'Emin misiniz?',
            text: 'Etkinliği silmek istediğinizden emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil',
            cancelButtonText: 'İptal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await this.$http.delete(`calendar/${clickInfo.event.id}`);
                if(response.data.success){
                    if(clickInfo.event.extendedProps.type==3){ //uçuş modu ise fly nesnesi eklensin
                      delete this.$globalVeriable.eventType[2].fly
                    }
                    clickInfo.event.remove();
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'success'
                    });
                    this.$emit('changeList');
                }else{
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'danger'
                    });
                }
            }
        });
    },
    async fetchEventsForDateRange(calendar) {
      this.$globalVeriable.eventType.forEach(item => {
        delete item.disabled;
        delete item.fly;
      });
      this.calendarOptions.events=[];
      let activeMount = calendar.currentData.dateProfile.activeRange
      try {
        const start = activeMount.start.toISOString();
        const end = activeMount.end.toISOString();
        let calendar = []
        const response = await this.$http.get(`calendar?start=${start}&end=${end}&user_id=0${this.filter_user ? '&user_id='+this.filter_user : ''}`);
        calendar=response.data.data
        if(calendar.length>0){
          calendar.forEach(item => {
            if(this.calendarOptions.events.find(i => i.id == item.id)==undefined){
              let start=new Date(item.start)
              let end=new Date(item.end)

              const currentDate = new Date(start);
              
              if(item.type==3){ // uçuş modu ise uçuş modu seçimi disabled yapılıyor.
                this.$globalVeriable.eventType[2].disabled=true
                this.$globalVeriable.eventType[2].fly=true
              }
              
              // Tarih aralığındaki tarihleri eventListDate'e ekleniyor...
              if(item.type==0){
                currentDate.setDate(currentDate.getDate() + 1 );
                this.eventListDate.push({type:item.type,leave_type:item.leave_type,date:currentDate.toISOString().split('T')[0]});
              }
              while (currentDate <= end && item.leave_type!=2) {
                if(item.leave_type!=1){
                  currentDate.setDate(currentDate.getDate() + 1 );
                }
                this.eventListDate.push({type:item.type,leave_type:item.leave_type,date:currentDate.toISOString().split('T')[0]});
                currentDate.setDate(currentDate.getDate() + 1);
              }

              if (item.leave_type === 0) {
                start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
                end.setHours(start.getHours(), start.getMinutes());
                end.setDate(end.getDate() + 1 );
                start = start.toISOString().split('T')[0];
                end = end.toISOString().split('T')[0];
              }
              this.calendarOptions.events.push({
                id:item.id,
                title:this.eventTitle(item,'title'),
                start:start,
                color:item.type == 0  ? 'red' : item.type == 3  ? 'green' : item.type==1 ? 'default' : 'gray', 
                end:end,
                extendedProps:{
                  type:item.type
                }
              })
            }
          });
        }
      } catch (error) {
        console.error('Etkinlikleri çekerken bir hata oluştu:', error);
      }
    },
    handleDateSelect(selectInfo) {


      this.$globalVeriable.eventType.map(item=> !item.fly ? delete item.disabled :'') // tüm type'lar disabled değeri siliniyor. uçuş modu hariç

      this.selectInfo=selectInfo;

      this.newLeave.start=this.selectInfo.startStr
      this.newLeave.end=this.selectInfo.endStr

      //burada seçili günde etlinlik kontrolü yapılıyor.
      const currentDate = new Date(this.newLeave.start);
      const end = new Date(this.newLeave.end);
      
      end.setDate(end.getDate() - 1)
      
      while (currentDate <= end) {

        // item.date ile belirli bir tarih aralığını kontrol et
        if (this.eventListDate.some(item => isSameDay(item.date, currentDate))) {
              this.$swal({
                  title: 'Uyarı',
                  text: 'Bu tarihte etkinlik bulunmaktadır.',
                  icon: 'warning',
                  confirmButtonText: 'Tamam',
              });
              return false;
          }

          //Burada izinden önceki ve sonraki günler uçuş modu alınmasın diye yapılan kontroll...
          const prevDayExists = this.eventListDate.find(item => isSameDay(this.beforeDay(item.date), currentDate))
          const nextDayExists = this.eventListDate.find(item => isSameDay(this.afterDay(item.date), currentDate))
          var dayExists = prevDayExists || nextDayExists
          if(dayExists){
            if(dayExists.type==3){ //Eğer uçuş modu öncesi veya sonrası ise yıllık izin disabled yapılıyor...
              this.$globalVeriable.eventType[0].disabled=true
              this.newLeave.type=2 // Raporlu seçili olsun
            }
            if(dayExists.type==0 || dayExists.type==1){ //Eğer tatil günü veya izin günü öncesi veya sonrası ise uçuş modu izin disabled yapılıyor...
              this.$globalVeriable.eventType[2].disabled=true
            }
          }
          
          currentDate.setDate(currentDate.getDate() + 1); //while döngüsü için
      }

      // Özel kontrol fonksiyonu: İki tarihin gün, ay ve yıl açısından aynı olup olmadığını kontrol eder
      function isSameDay(date1, date2) {
          const d1 = new Date(date1);
          const d2 = new Date(date2);

          return (
              d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate()
          );
      }
      
      // Saat farkı bulunuyor...
      this.newLeave.number_of_days=this.dateDiff(this.newLeave.start,this.newLeave.end,this.newLeave.type)


      console.log(this.newLeave.start)
      if(this.newLeave.number_of_days>1){ // 1 den fazla gün seçili ise uçuş modu pasif et
        this.$globalVeriable.eventType[2].disabled=true
      }


      if(this.newLeave.number_of_days==0){
        this.$swal({
            title: 'Uyarı',
            text: 'Hafta sonları için işlem sağlanmamaktadır.',
            icon: 'warning',
            confirmButtonText: 'Tamam',
        })
        return false
      }else{
        this.modalOpen=true
      }

      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect()

    },
    hoursDiff(start,end){
      const date1 = new Date(`1970-01-01T${start}`);
      const date2 = new Date(`1970-01-01T${end}`);
      const timeDiff = date2.getTime() - date1.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      
      return hoursDiff;
    },
    hoursControl(start,end){
        const date1 = new Date(`1970-01-01T${start}`);
        const date2 = new Date(`1970-01-01T${end}`);

        const hourDifference = date2.getHours() - date1.getHours();

        return date1.getTime() >= date2.getTime() || hourDifference > 2;
    },
  },
  watch:{
    newLeave:{
      handler(newData){
        this.newLeave.half_type=parseInt(this.newLeave.half_type);
        this.newLeave.leave_type=parseInt(this.newLeave.leave_type);
        if(newData.leave_type==0){ //eğer tüm gün seçili ise diğer değerleri sıfırla
          this.newLeave.half_type=0
          this.newLeave.hours=this.dayHours
        }else if(newData.leave_type==1) { // yarım gün seçildiğinde saat ayarları
          if(this.newLeave.half_type==0){ //eğer öğleden önce ise
            this.newLeave.hours=5;
            this.newLeave.startHours="08:30"
            this.newLeave.endHours="13:30"
          }else{
            this.newLeave.hours=5;
            this.newLeave.startHours="13:30"
            this.newLeave.endHours="18:30"
          }
          
        }else if(newData.leave_type==2){
          if(this.hoursControl(newData.startHours,newData.endHours)){
            this.newLeave.endHours="18:30"
          }
          this.newLeave.hours=this.hoursDiff(newData.startHours,newData.endHours)
        }
      },
      deep:true
    },
    'newLeave.type': function (newValue) {
      if(newValue==2) { //raporlu seçilirse  leave_type 0 (tüm gün) olsun
        this.newLeave.leave_type=0
      }
      this.newLeave.number_of_days=this.dateDiff(this.newLeave.start,this.newLeave.end,newValue)
     },

    modalOpen(newValue){
      if(!newValue){
        this.newLeave=this.emptyLeave();
      }
    },
  },
  created(){
    
  },
  mounted(){
    const calendar = this.$refs.calendarRef.getApi();
    this.fetchEventsForDateRange(calendar);
    calendar.on('datesSet', () => {
      this.fetchEventsForDateRange(calendar);
    });
  },
  computed:{
    
  }
  
}
</script>./CalendarLeav.vue