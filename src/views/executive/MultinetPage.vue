<template>
    
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <h1 class="py-2 text-md font-bold">MULTİNET LİSTESİ</h1>
        </div>
        <div>
            <div class="flex gap-3 items-center w-full font-semibold py-3">
                <CustomButton @click="changeDate(-1)" size="btn-sm" bg="bg-zinc-500" icon="fa-chevron-left"></CustomButton>
                <span class="text-lg">{{ months[selectedMonth-1] }} {{ selectedYear }} </span>
                <CustomButton @click="changeDate(1)" size="btn-sm" bg="bg-zinc-500" icon="fa-chevron-right"></CustomButton>
                <div>
                    <span class="font-medium">Yemek Bedeli : </span> {{ foodPrice }}
                </div>
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
                        <th class="border-r px-2 py-3 font-medium"></th>
                        <th class="border-r px-2 font-medium py-3">Multinet Kart No</th>
                        <th class="border-r px-2 font-medium">Çalışma Günü</th>
                        <th class="border-r px-2 font-medium">Kesilen gün</th>
                        <th class="border-r px-2 font-medium">Net Gün</th>
                        <th class="border-r px-2 font-medium bg-amber-600 text-white">Yemek Ücreti</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <tr v-for="user in usersFoodList" :key="user.id" class="border-b">
                        <td class="border-r px-2 py-3">{{ user.name }}</td>
                        <td class="border-r px-2">{{ user.food_card_number }} / {{ user.food_card_cvv }}</td>
                        <td class="border-r px-2">{{ getWorkingDaysInMonth() }}</td>
                        <td class="border-r px-2">{{ user.not_working_day == 0 ? "YOK" : user.not_working_day }}</td>
                        <td class="border-r px-2">{{ getWorkingDaysInMonth() - user.not_working_day }}</td>
                        <td class="border-r px-2">{{ foodAmount(user) }} TL</td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td class="total-amount font-bold px-2 py-3">TOPLAM : {{ totalAmount }} TL</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-3 flex justify-end">
            <CustomButton @click="exportToExcel()" bg="bg-green-600" icon="fa-file-excel">Excel İndir</CustomButton>
        </div>
    </div>
</template>

<script>
import CustomButton from '../../components/ui/CustomButton.vue'
import {mapActions} from 'vuex'
import ExcelJS from 'exceljs';

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
            foodPriceList:[],
            total_holiday:0
        }
    },
    methods:{
        ...mapActions(['getSetting','setNotify']),
        async exportToExcel() {
            // Yeni bir Excel kitabı ve sayfa oluştur
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(this.months[this.selectedMonth]);

            // Başlık satırını ekle
            worksheet.addRow(['Kişi', 'Kart Numarası', 'Tutar']);
            
            // Verileri ekleyin (örnek veri)
            this.usersFoodList.forEach((item) => {
                if (item && item.name && item.food_card_number) {
                    worksheet.addRow([item.name, item.food_card_number, this.foodAmount(item)]);
                }
            });

            // Dosyayı oluşturun
            const buffer = await workbook.xlsx.writeBuffer();

            // Dosyayı indir
            this.downloadFile(buffer, `${this.months[this.selectedMonth]}-${this.selectedYear}-multinetListesi.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        },
        downloadFile(buffer, fileName, fileType) {
            const blob = new Blob([buffer], { type: fileType });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.setNotify({
                'desc':`${this.months[this.selectedMonth]}-${this.selectedYear} multinet listesi indirildi...`,
                'class':'success'
            })
        },
        changeDate(offset) {
            this.selectedMonth += offset;
            // Ay 12'den büyükse, yeni yıl ve ayı güncelle
            if (this.selectedMonth > 12) {
                this.selectedYear++;
                this.selectedMonth = 1; // Ocak
            }
            if (this.selectedMonth < 1) {
                this.selectedYear--;
                this.selectedMonth = 12; // Ocak
            }
            this.fetchFoodList();
        },
        async fetchFoodList() {
            try {
            const response = await this.$http.get(`/user/usersFoodList?months=${this.selectedMonth}&year=${this.selectedYear}`);
            this.usersFoodList = response.data.data;
            this.total_holiday=this.usersFoodList[0].resmi_tatil //herhangi birinden resmi tatil gün sayısı çekiliyor.
            this.loading = false
            this.foodPrice = this.getFoodPrice();
            } catch (error) {
            console.error('Etkinlikleri çekerken bir hata oluştu:', error);
            }
        },
        getWorkingDaysInMonth() {
            const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
            let workingDays = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(this.selectedYear, this.selectedMonth - 1, day);
                // Hafta sonu değilse 
                if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    workingDays++;
                }
            }

            return workingDays - this.total_holiday;
        },
        foodAmount(user) {
            return this.foodPrice * (this.getWorkingDaysInMonth() - user.not_working_day);
        },
        getFoodPrice() {

            const targetDate = this.selectedYear+"-"+this.selectedMonth; // Ay ve yıl bilgisi
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
        }
    },
    mounted() {
    },
    computed:{
        totalAmount() {
            return this.usersFoodList.reduce((total, user) => total + this.foodAmount(user), 0);
        },
    },
    created(){
        this.getSetting(1).then(response => {
            this.foodPriceList = JSON.parse(response.value)
            this.fetchFoodList();
        }).catch(error => {
            console.error('Error fetching setting:', error);
        });
    },
    watch: {
    },
}
</script>

<style>

</style>