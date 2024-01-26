 
<template>
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">{{ type==1 ? 'AVANSLAR' : 'KESİNTİLER'}}</h1>
                <CustomButton @click="paymentModal()" size="btn-md" icon="fa-plus">Yeni Ekle</CustomButton>
            </div>
        </div>
        <LoadingBtn v-if="loading"></LoadingBtn>
        <t-table v-else :head="tableHead" :body="tableBody" page="payments" editType="action" class="mt-4" @actionModule="paymentModal" />
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
                <div class="max-w-3xl w-[90%] p-6 bg-white rounded-md shadow-xl">
                    <div class="flex items-center justify-between">
                        <h4 class="text-md">Avans Düzenleme</h4>
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
                    <div>
                        <div class="flex gap-4 w-100 py-4">
                            <div>
                                <label for="name" class="block mb-1 text-sm w-100">Kişi Seç</label>
                                <select id="user" class="diji-input" v-model="editData.user_id" required>
                                    <option :value="user.id" v-for="user in users" :key="user.id">{{ user.name }}</option>
                                </select>
                            </div>
                            <div class="group">
                                <label for="name" class="block mb-1 text-sm w-100">Tarih</label>
                                <DatePicker
                                v-model="editData.date"
                                class="diji-input" ></DatePicker>
                            </div>
                            <div class="group">
                                <label for="name" class="block mb-1 text-sm w-100">Toplam Tutar</label>
                                <input type="text" id="name" v-model="editData.total_amount" class="diji-input">
                            </div>
                            <div class="group">
                                <label for="name" class="block mb-1 text-sm w-100">Taksit Sayısı</label>
                                <select class="diji-input" v-model="editData.number_installments">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div class="group flex items-end">
                                <CustomButton bg="bg-green-600" class="w-full" @click="calc()">
                                    <i class="fas fa-rotate"></i>
                                </CustomButton>
                            </div>
                        </div>
                        <div class="w-100 mt-3" v-if="editData.installments">
                            <div class="font-medium mb-2">Taksitler ({{ editData.installments.length }})</div>
                            <div class="grid grid-cols-4 font-semibold py-2">
                                <div>No</div>
                                <div>Tarih</div>
                                <div>Tutar</div>
                                <div>Ödeme Durumu</div>
                            </div>
                            
                            <LoadingBtn v-if="loadInstallments"></LoadingBtn>
                            <div v-for="(ins,index) in editData.installments" v-else :key="index" class="py-2 border-t grid grid-cols-4">
                                <div>{{index + 1}}</div>
                                <div>{{formatDate(ins.date)}}</div>
                                <div>{{ins.amount}}</div>
                                <div @click="ins.status=!ins.status,savePayment()" class="cursor-pointer">
                                    <i class="fas fa-circle-check" :class="ins.status==1 ? 'text-green-500':'text-red-500'"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button
                        @click="modalOpen = false"
                        class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
                        >
                        VAZGEÇ
                        </button>
                        <button class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded" @click="savePayment()">
                        KAYDET
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UsersTable from '@/components/ui/CustomTable.vue';
import LoadingBtn from "@/components/ui/LoadingBtn.vue";
import CustomButton from '@/components/ui/CustomButton.vue'

import { mapActions, mapState } from 'vuex'
export default {
    name:'paymentsPage',
    components: {
        't-table':UsersTable,
        LoadingBtn,
        CustomButton
    },
    data(){
        return{
            loading:true,
            payments:null,
            tableHead:[],
            tableBody:[],
            modalOpen:false,
            editData:this.emptyData(),
            loadInstallments:true,
            type:this.$route.query.type
        }
    },
    methods:{
        ...mapActions(['setNotify','fetchUsers']),
        emptyData(){
            return {
                date:new Date(),
                total_amount:2000,
                number_installments:1,
                installments:[],
                type:this.type
            }
        },
        setPaymentsTable(){
            this.tableHead = [
                { label: 'KİŞİ', type: 'user_name' },
                { label: 'VERİLME TARİHİ', type: 'date' },
                { label: 'TOPLAM ÖDEME', type: 'price' },
                { label: 'KALAN TUTAR', type: 'price' },
                { label: 'ÖDEME DURUMU', type: 'status' },
                { label: 'YÖNET', type: 'id' }
            ];
            if(this.payments){
                this.tableBody=this.payments.map((item) => [ 
                    item.user,
                    item.date,
                    item.total_amount,
                    item.installments.reduce((total, installment) => {
                    if (!installment.status) {
                        return total + parseInt(installment.amount);
                    }
                    return total;
                    }, 0).toFixed(2),
                    item.status,
                    item.id
                ])
            }
        },
        paymentModal(id=null) {
            if(id!=null){ //edit ekranı 
                this.editData = this.payments.find((item)=>item.id==id)
                this.editData.date = new Date(this.editData.date)
            }else{
                this.editData=this.emptyData()
                this.calc()
            }
            this.loadInstallments=false
            this.modalOpen=true
        },
        savePayment(){
            const statusControl = this.editData.installments.find(item=>!item.status)
            if(statusControl==undefined){//burada tüm taksitler ok ise, payment status güncelle
                this.editData.status=true
            }else{
                this.editData.status=false
            }
            this.loadInstallments=true
            this.editData.installments=JSON.stringify(this.editData.installments)
            if(this.editData.id!=null){
                this.$http.put(`/payment/${this.editData.id}`,this.editData)
                .then((response)=>{
                    if(response.data.success){
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'success'
                        });
                        this.editData.installments=JSON.parse(this.editData.installments) //taksit durum güncellemesinde tekrar parse ediliyor
                        this.getPayments()
                    }else{
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'danger'
                        });
                    }
                    this.loadInstallments=false
                }).catch((error) => {
                    this.setNotify({
                        'desc': error,
                        'class': 'danger'
                    });
                })
            }else{
                this.$http.post('/payment',this.editData)
                .then((response)=>{
                    if(response.data.success){
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'success'
                        });
                        this.modalOpen=false
                        this.getPayments()
                    }else{
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'danger'
                        });
                    }
                }).catch((error) => {
                    this.setNotify({
                        'desc': error,
                        'class': 'danger'
                    });
                })
            }
        },
        async getPayments(){
            try {
                const response = await this.$http.get(`/payment?type=${this.type}`);
                if(response.data.success){
                    this.payments = response.data.data; 
                    this.payments.map(item => {
                        item.installments=JSON.parse(item.installments); //taksitler json'a dönüştürülüyor...
                    })
                    this.setPaymentsTable();
                }else{
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'danger'
                    });
                }
                this.loading = false;
            } catch (error) {
                this.setNotify({
                    'desc': error,
                    'class': 'danger'
                });
            }
        },
        calc(){
            var currentDate = new Date();
            var nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            var resultDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5);
            this.editData.installments=[]
            for(let i = 0; i < this.editData.number_installments; i++){
                resultDate = resultDate.setMonth(resultDate.getMonth() + 1)
                this.editData.installments.push(
                    {
                        date:resultDate,
                        amount:(parseInt(this.editData.total_amount) / this.editData.number_installments).toFixed(2),
                        status:0
                    }
                )
                resultDate = new Date(resultDate);
            }
        }
    },
    computed:{
        ...mapState(['users'])
    },
    created(){
        this.getPayments().then(() => {
            this.setPaymentsTable();
        })
        const usersColumn = 'id, name';
        this.fetchUsers({ columns: usersColumn })
    },
    watch: {
        '$route.query.type': function(newType) {
            if(this.$route.path=='/payments'){
                this.type = newType;
                this.getPayments()
            }
        }
    },
}
</script>

<style>

</style>