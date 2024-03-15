<template>
    
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">İZİN VE RAPOR TAKVİMİ</h1>
            </div>
        </div>

        <div>
        <div class="flex justify-between w-full font-semibold py-3">
            <CustomButton @click="changeYear(-1)" size="btn-sm" bg="bg-zinc-500">Önceki Yıl</CustomButton>
            <span class="text-lg">{{ selectedYear }}</span>
            <CustomButton @click="changeYear(1)" size="btn-sm" bg="bg-zinc-500">Sonraki Yıl </CustomButton>
        </div>
        
        <div class="loading flex justify-center my-5" v-if="loading">
            <button type="button" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 transition ease-in-out duration-150 cursor-not-allowed" disabled="">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor...
            </button>
        </div>

        <table class="table-auto w-full border-spacing-2 border" v-else>
            <thead class="text-[12px]">
                <tr class="border-b uppercase">
                    <th class="border-r p-2 font-medium">Çalışan</th>
                    <th class="border-r px-2 font-medium">YILLIK</th>
                    <th class="border-r px-2 font-medium">KULLANILAN</th>
                    <th class="border-r px-2 font-medium">KALAN</th>
                    <th v-for="month in months" :key="month" class="border-r px-2 font-medium">{{ month }}</th>
                </tr>
            </thead>
            <tbody class="text-[12px]">
                <tr v-for="user in users" :key="user.id" class="border-b">
                    <td class="border-r p-2">{{ user.name }}</td>
                    <td class="border-r px-2">{{ user.day_off }} Gün</td>
                    <td class="border-r px-2">{{ getUsedDays(user) != 0 ? getUsedDays(user) : "0" }}</td>
                    <td class="border-r px-2">{{ calculateRemainingDays(user)}}</td>
                    <td class="border-r" v-for="month in months" :key="month">                        
                        <ul class="flex flex-col">
                            <li v-for="event in getUserEvents(user.id, month)" :key="event.id" :title="getType(event.type, event.leave_type,'name')" class="hover:bg-primary hover:text-white w-full px-1">
                                <span>
                                    <i class="mr-1 fas" :class="getType(event.type, event.leave_type,'icon')"></i><b>{{ formatEventDate(event.start) }} {{  event.number_of_days > 1 ? '- '+formatEventDate(event.end) : '' }}</b>  - {{ eventTitle(event)}}
                                </span>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CustomButton from '../../components/ui/CustomButton.vue'

export default {
    components:{
        CustomButton
    },
    data(){
        return{
            loading:true,
            selectedYear: new Date().getFullYear(),
            months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            events:[],
        }
    },
    methods:{
        ...mapActions(['fetchUsers','setNotify']),
        changeYear(offset) {
            this.selectedYear += offset;
            this.fetchEventsForDateRange();
        },
        getUsedDays(user){

            const list = this.events.filter(item => item.user_id === user.id && item.type === 1);
            
            const days = list.reduce((total, item) => total + (item.leave_type === 0 ? item.number_of_days : 0.5), 0);

            user.usedDays=days

            return days
        },
        calculateRemainingDays(user) {
            const totalDays = user.day_off;

            const remainingDays = totalDays - user.usedDays;

            // Kalan izin miktarını uygun bir şekilde formatlayarak ekrana yazdır
            return `${remainingDays} Gün`;
        },
        async fetchEventsForDateRange() {
            try {
            const response = await this.$http.get(`calendar?type=1&type=2&type=3&start=${this.selectedYear}-01-01T00:00:00.000Z&end=${this.selectedYear}-12-31T00:00:00.000Z`);
            this.events = response.data.data;
            this.loading = false
            } catch (error) {
            console.error('Etkinlikleri çekerken bir hata oluştu:', error);
            }
        },
        getUserEvents(userId, month) {
            return this.events.filter((event) => {
                const eventMonth = new Date(event.start).getMonth();
                return event.user_id === userId && this.months[eventMonth] === month;
            });
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
    },
    computed:{
        ...mapState(['users']),
    },
    mounted(){
      this.fetchEventsForDateRange();
    },
    created(){
        this.fetchUsers({ })
    }
}
</script>

<style>

</style>