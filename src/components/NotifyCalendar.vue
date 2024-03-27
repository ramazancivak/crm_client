<template>
    <div class="flex gap-2 h-10 items-center">
        <b>Bugün ne var? :</b>
        <div v-if="notifyList.length>0">
            <swiper
                class="h-10"
                :slides-per-view="1"
                :direction="'vertical'"
                :autoplay="{ 'delay': 3000 }"
                :loop="true"
            >
                <swiper-slide class="duyuru flex items-center" v-for="event in notifyList" :key="event.id">
                    <p v-if="event.type==1">{{event.user_name}} izinli
                        <sup v-if="event.leave_type==1">Yarım Gün - {{ event.half_type==0 ? 'Öğleden Önce' : 'Öğleden Sonra' }}</sup>
                        <sup v-if="event.leave_type==2">Saatlik - {{ hoursDiff(event.start,event.end) }}</sup>
                    </p>
                    <p v-if="event.type==2">{{event.user_name}} raporlu</p>
                    <p v-if="event.type==3">{{event.user_name}} uçuşta</p>
                    <p v-if="event.type==4">{{event.user_name}} doğum günü!</p>
                </swiper-slide>
            
            </swiper>

            
        </div>
        <div v-else>
            Bugün hiç birşey yok :/
        </div>
    </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide  } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
export default {
    components: {
      Swiper,
      SwiperSlide,
    },
    data() {
        return {
            notifyList: [],
            nowDate: new Date().toISOString(),
        }
    },
    methods: {
        getCalendar() {
            this.$http.get(`/calendar/whatstoday?start=${this.nowDate}`).then((response) => {
                // Verileri notifyList'e atayın
                this.notifyList = response.data.data;
            }).catch((error) => {
                console.error('Takvim verilerini alırken hata oluştu:', error);
            });
        },
        
        hoursDiff(start,end){
        const date1 = new Date(start);
        const date2 = new Date(end);
        const timeDiff = date2.getTime() - date1.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        
        return hoursDiff + ' Saat';
        },
        
    },
    created() {
        // Sayfa oluşturulduğunda takvim verilerini al
        this.getCalendar();
    },
    
}
</script>