<template>
    
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <h1 class="py-2 text-md font-bold">YEMEK KARTI DETAYLARI</h1>
            <div class="flex gap-3 items-center border border-gray-400">
                <label class="border-r px-2 py-1 border-gray-400">Multinet Kart No</label>
                <div class="pr-2">{{ userInfo.food_card_number}} / {{ userInfo.food_card_cvv }}</div>
            </div>
        </div>
        <div>
            <div class="flex gap-3 items-center w-full font-semibold py-3">
                <CustomButton @click="changeDate(-1)" size="btn-sm" bg="bg-zinc-500" icon="fa-chevron-left"></CustomButton>
                <span class="text-lg">{{ selectedYear }} </span>
                <CustomButton :disabled="this.selectedYear == new Date().getFullYear()" class="disabled:bg-zinc-300" @click="changeDate(1)" size="btn-sm" bg="bg-zinc-500" icon="fa-chevron-right"></CustomButton>
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
                <thead class="text-sm">
                    <tr class="border-b uppercase">
                        <th class="border-r px-2 py-3 font-medium">Ay / Günlük Ücret</th>
                        <th class="border-r px-2 font-medium">Çalışma Günü</th>
                        <th class="border-r px-2 font-medium">Kesilen gün</th>
                        <th class="border-r px-2 font-medium">Net Gün</th>
                        <th class="border-r px-2 font-medium bg-amber-600 text-white">Yemek Ücreti</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <tr v-for="(month, index) in monthsUntilSelectedMonth()" :key="index" class="border-b">
                        <td class="border-r px-2 py-3 font-medium">{{ month }} / {{ getFoodPrice(index+1) }} TL</td>
                        <td class="border-r px-2">{{ getWorkingDaysInMonth(usersFoodList[index]) }}</td>
                        <td class="border-r px-2">{{ usersFoodList[index].not_working_day == 0 ? "YOK" : usersFoodList[index].not_working_day }}</td>
                        <td class="border-r px-2">{{ getWorkingDaysInMonth(usersFoodList[index]) - usersFoodList[index].not_working_day }}</td>
                        <td class="border-r px-2">{{ foodAmount(usersFoodList[index],index+1) }} TL</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import CustomButton from '../../components/ui/CustomButton.vue'
import {mapState,mapActions} from 'vuex'
export default {
    components:{
        CustomButton
    },
    data(){
        return{
            loading:true,
            selectedMonth: new Date().getMonth()+1,
            selectedYear: new Date().getFullYear(),
            months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            usersFoodList:[],
            foodPrice:0,
            foodPriceList:[]
        }
    },
    methods:{
        ...mapActions(['getSetting','setNotify']),
        monthsUntilSelectedMonth() {
            return this.months.slice(0, this.selectedMonth);
        },

        changeDate(offset) {
            this.loading = true;
            this.selectedYear += offset;
            if (this.selectedYear < new Date().getFullYear()) {
                this.selectedMonth = 12;
            }else{
                this.selectedMonth = new Date().getMonth()+1;
            }
            this.fetchFoodList();
        },
        async fetchFoodList() {
            try {
            const response = await this.$http.get(`/user/usersFoodList?user_id=${this.userInfo.id}&year=${this.selectedYear}`);
            this.usersFoodList = response.data.data;
            this.loading = false
            } catch (error) {
            console.error('Etkinlikleri çekerken bir hata oluştu:', error);
            }
        },
        getWorkingDaysInMonth(month) {
            const daysInMonth = new Date(this.selectedYear, month.ay, 0).getDate();
            let workingDays = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(this.selectedYear, this.selectedMonth - 1, day);
                // Hafta sonu değilse 
                if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    workingDays++;
                }
            }

            return workingDays - month.resmi_tatil
        },
        
        getFoodPrice(month) {
            const targetDate = this.selectedYear + "-" + month;
            const targetTimestamp = new Date(targetDate).getTime();

            // Verileri tarihe göre azalan şekilde sırala
            const sortedData = this.foodPriceList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Hedef tarihten küçük veya eşit olan en yakın tarihi bul
            for (let i = 0; i < sortedData.length; i++) {
                const currentTimestamp = new Date(sortedData[i].date).getTime();
                if (currentTimestamp <= targetTimestamp) {
                return sortedData[i].val; // En yakın tarihin değerini döndür
                }
            }

            // Hedef tarihten küçük veya eşit tarih yoksa ilk değeri döndür
            return sortedData[0].val;
        },
        foodAmount(month,index) {
            return this.getFoodPrice(index) * (this.getWorkingDaysInMonth(month) - month.not_working_day);
        },

    },
    computed:{
        ...mapState(['userInfo']),  
    },
    mounted(){
        this.getSetting(1).then(response => {
            this.foodPriceList = JSON.parse(response.value)
            
            this.fetchFoodList();
        }).catch(error => {
            console.error('Error fetching setting:', error);
        });
    },
    created(){
    },
    watch: {
    },
}
</script>

<style>

</style>