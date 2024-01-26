<template>
    <div>        
        <div class="w-full flex items-center mb-2 justify-between border-b pb-2">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">İZİNLER</h1>
                <CustomButton @click="modalOpen=true" size="btn-sm">YENİ İZİN</CustomButton>
            </div>
        </div>
        <div class="mt-3">
            <div class="text-sm font-bold text-primaryDark mb-3">İZİN ÖZETİ</div>
            <div class="grid gap-4 shadow-lg p-3 text-sm">
                <div class="flex justify-between w-full font-semibold py-1">
                    <CustomButton @click="changeYear(-1)" size="btn-sm" bg="bg-zinc-500">Önceki Yıl</CustomButton>
                    <span class="text-lg">{{ selectedYear }}</span>
                    <CustomButton @click="changeYear(1)" size="btn-sm" bg="bg-zinc-500">Sonraki Yıl </CustomButton>
                </div>
                
                <table class="table-auto w-full mb-5">
                    <thead class="text-sm">
                        <tr class="border-b uppercase">
                            <th class="border-r px-2 font-medium"></th>
                            <th class="border-r px-2 font-medium">TOPLAM</th>
                            <th v-for="month in months" :key="month" class="border-r px-2 font-medium">{{ month }}</th>
                        </tr>
                    </thead>
                    <tbody class="text-[12px]">
                        <tr v-for="eventList in $globalVeriable.eventTypeList" :key="eventList" class="border-b">
                            <td class="border-r px-2 font-medium">{{eventList.name}}</td>
                            <td class="border-r px-2"> {{eventList.total}} {{ eventList.leave_type == 2 ? "Saat" : "Gün" }}</td>
                            <td class="border-r px-2" v-for="month in months" :key="month">                        
                                <ul>
                                    <li v-for="event in getTypeEvents(eventList, month)" :key="event.id">
                                        <span>
                                            <i class="mr-1 fas" :class="getTypeIcon(event.type, event.leave_type)"></i><b>{{ formatEventDate(event.start) }} {{  event.number_of_days > 1 ? '- '+formatEventDate(event.end) : '' }}</b>  - {{ eventTitle(event)}}
                                        </span>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="mt-5">
            <div class="text-sm font-bold text-primaryDark mb-3">GENEL BİLGİ</div>
            <div class="grid gap-4 shadow-lg p-3 text-sm">
                <table class="text-[12px] w-full justify-end">
                    <tr>
                        <td class="px-2 font-medium w-[250px]">YILLIK İZİN HAKKI</td>
                        <td>:</td>
                        <td colspan="3">{{ $store.getters.userInfo.day_off }} Gün</td>
                    </tr>
                    <tr>
                        <td class="px-2 font-medium">KULLANILAN</td>
                        <td>:</td>
                        <td colspan="3">{{ usedDays.totalDays + " Gün + " + usedDays.totalHours + " Saat"   }}</td>
                    </tr>
                    <tr>
                        <td class="px-2 font-medium">KALAN</td>
                        <td>:</td>
                        <td colspan="3">{{ calculateRemainingDays() }}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="mt-5">
            <div class="text-sm font-bold text-primaryDark mb-3">TELAFİ EDİLEBİLECEKLER</div>
            <div class="grid gap-4 shadow-lg p-3 text-[12px]">
                <ul v-if="compensationList.length>0">
                    <li v-for="event in compensationList" class="mb-2 border-b py-2 flex justify-between" :key="event.id">
                        <span>
                            <!-- Buraya 48 saat sayacı gelecek! -->
                            <i class="fas" :class="$globalVeriable.eventType[event.type-1].icon"></i> {{ formatEventDate(event.start,'hasMonth','hasYear') }} - {{ eventTitle(event) }}
                        </span>
                        <div class="flex gap-3">
                            <CustomButton size="btn-sm" bg="bg-red-500">
                                {{ event.counterDate.days }} Gün
                            </CustomButton>
                            <CustomButton size="btn-sm" bg="bg-red-500">
                                {{ event.counterDate.hours }} Saat
                            </CustomButton>
                            <CustomButton size="btn-sm" bg="bg-red-500">
                                {{ event.counterDate.minutes }} Dakika
                            </CustomButton>
                            <CustomButton @click="compensationUpdate(event)" size="btn-sm" bg="bg-green-400 hover:bg-green-500">TELAFİ ET</CustomButton>
                        </div>
                    </li>
                </ul>
                <span class="text-red-500" v-else>
                    Telafi edilecek izin bulunmamaktadır.
                </span>
            </div>
        </div>

        <div class="mt-5">
            <div class="text-sm font-bold text-primaryDark mb-3">TELAFİ EDİLMİŞLER</div>
            <div class="grid gap-4 shadow-lg p-3 text-[12px]">
                <ul v-if="compensationDone.length>0">
                    <li v-for="event in compensationDone" class="mb-2 border-b py-2 flex justify-between" :key="event.id">
                        <span>
                            <!-- Buraya 48 saat sayacı gelecek! -->
                            <i class="fas" :class="$globalVeriable.eventType[event.type-1].icon"></i> {{ formatEventDate(event.start,'hasMonth','hasYear') }} - {{ eventTitle(event) }}
                        </span>
                    </li>
                </ul>
                <span class="text-red-500" v-else>
                    Telafi edilmiş izin bulunmamaktadır...
                </span>
            </div>
        </div>

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
                <div class="max-w-2/3 w-3/4 p-6 bg-white rounded-md shadow-xl">
                <div class="flex items-center justify-between">
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
                    <CalenderLeave @changeList="fetchEventsForDateRange()" :filter_user="userId" class="w-full mt-5" />
                </div>
                </div>
            </div>
        </div>
        


    </div>
</template>

<script>

import { mapActions } from 'vuex'
import CalenderLeave from '@/components/ui/CalenderLeave.vue'
import CustomButton from '@/components/ui/CustomButton.vue'
export default {
    name:'myCalender',
    components: {
        CalenderLeave,
        CustomButton
    },
    data(){
        return{
            modalOpen:false,
            selectedYear: new Date().getFullYear(),
            months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            events:[],
            userId:this.$store.state.userInfo.id,
            usedDays: {
                totalDays: 0,
                totalHours: 0,
            },
            compensationList:[],
            compensationDone:[]
        }
    },
    methods:{
        ...mapActions(['setNotify']),
        changeYear(offset) {
            this.selectedYear += offset;
            this.fetchEventsForDateRange();
        },
        async compensationUpdate(event){
           try {
            event = {
                ...event,
                compensationStatus:2 //burada 2 olarak güncelleniyor ve kayıt veritabanında kalmaya devam ediyor...
            }
            const response = await this.$http.put(`calender/${event.id}`,event) 
            if(response.data.success){
                this.setNotify({
                    'desc':response.data.message.text,
                    'class':'success'
                })
                this.fetchEventsForDateRange();
            }
           } catch (error) {
                this.setNotify({
                    'desc':"Telafi güncellemede hata",
                    'class':'danger'
                })
           }
        },
        calculateRemainingDays() {
            const totalDays = this.$store.getters.userInfo.day_off;

            let remainingDays = totalDays - this.usedDays.totalDays;
            let remainingHours = this.usedDays.totalHours > 0 ? 9 - this.usedDays.totalHours : 0;
            if(remainingHours>0){
                remainingDays--
                return `${remainingDays} Gün + ${remainingHours} Saat`;
            }else{
                return `${remainingDays} Gün`;
            }

        },
        getTypeEvents(eventList, month) {
            return this.events.filter((event) => {
                const eventMonth = new Date(event.start).getMonth();
                if(eventList.type==1){
                    return event.type == eventList.type && event.leave_type == eventList.leave_type && this.months[eventMonth] === month;
                }else{
                    return event.type == eventList.type && this.months[eventMonth] === month;
                }
            });
        },
        async fetchEventsForDateRange() {

            this.modalOpen=false

            this.$globalVeriable.eventTypeList.map(item=> item.total = 0)
            this.usedDays = {
                totalDays: 0,
                totalHours: 0
            }
            try {
                const response = await this.$http.get(`calender?type=1&type=2&type=3&user_id=${this.userId}&start=${this.selectedYear}-01-01T00:00:00.000Z&end=${this.selectedYear}-12-31T00:00:00.000Z`);
                const eventList = response.data.data;

                this.compensationDone = eventList.filter((event) => {
                    return event.compensationStatus==2; //telafi edilmiş izinler
                });
                this.compensationList = eventList.filter((event) => {
                    return event.compensationStatus==1; //telafi hakkı olan izinler
                });
                this.events = eventList.filter((event) => {
                    return event.compensationStatus==0; //telafi hakkı olmayan izinler
                });
                this.counterDate()

                this.$globalVeriable.eventTypeList.forEach((event) => {
                    const list = this.events.filter(item => item.type === event.type && item.leave_type === event.leave_type);
                    if(event.leave_type==0){ // Tam gün (RAporlu ve yıllık izin)
                        event.total = list.reduce((total, item) => total + item.number_of_days, 0);
                        if(event.type===1){ //sadece yıllık izinleri topla
                            this.usedDays.totalDays += event.total;
                        }
                    }
                    if(event.leave_type==1){ // Yarım Gün
                        event.total = list.reduce((total) => total + 0.5 , 0);
                        this.usedDays.totalDays += event.total;
                    }
                    if(event.leave_type==2){ //Satlik izin
                        event.total= list.reduce((total,item) => total + item.hours, 0)
                        this.usedDays.totalHours += event.total;
                    }
                });
            } catch (error) {
            console.error('Etkinlikleri çekerken bir hata oluştu:', error);
            }
        },
        formatEventDate(date,hasMonth,hasYear) {
            const eventDate = new Date(date);
            const day = eventDate.getDate().toString().padStart(2, '0');
            let text = day
            if(hasMonth){
                const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
                text += ` ${this.months[parseInt(month) - 1]}`
            }
            if(hasYear){
                text += ` ${eventDate.getFullYear()}`;
            }
            return text
        },
        async compensationControl() {
            const response = await this.$http.post("calender/compensation") 
            return response
        },
        counterDate(){
            let startDate = new Date(); // Şu anki tarih
            this.compensationList.map((event)=>{
                let eventDate= new Date(event.start)
                eventDate.setDate(eventDate.getDate() + 2)
                event.counterDate=this.calculateDateDifference(startDate, eventDate);
            })
            console.log("this.compensationList")
            console.log(this.compensationList)
        }

    },
    mounted(){
        setInterval(() => {
            this.counterDate()
        }, 60000); //telafi için sayaç
    },  
    created(){
        this.compensationControl().then((response)=>{
            if(response.data.success){
                this.fetchEventsForDateRange();
            }
        })
    }
}
</script>

<style>

</style>