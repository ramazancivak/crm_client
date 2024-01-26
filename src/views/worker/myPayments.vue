 
<template>
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">AVANS ve KESİNTİLER</h1>
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
                        <h4 class="text-md">Avans Detay</h4>
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
                            <div class="group">
                                <label for="name" class="block mb-1 text-sm w-100">Tarih</label>
                                <DatePicker
                                v-model="editData.date"
                                class="diji-input disabled" disabled></DatePicker>
                            </div>
                            <div class="group">
                                <label for="name" class="block mb-1 text-sm w-100">Toplam Tutar</label>
                                <input type="text" id="name" v-model="editData.total_amount" class="diji-input disabled" disabled>
                            </div>
                            <div class="group">
                                <label for="name" class="block mb-1 text-sm w-100">Taksit Sayısı</label>
                                <select class="diji-input disabled" v-model="editData.number_installments" disabled>
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
                                <div @click="ins.status=!ins.status" class="cursor-pointer">
                                    <i class="fas fa-circle-check" :class="ins.status==1 ? 'text-green-500':'text-red-500'"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UsersTable from '@/components/ui/CustomTable.vue';
import LoadingBtn from "@/components/ui/LoadingBtn.vue";

import { mapActions, mapState } from 'vuex'
export default {
    name:'paymentsPage',
    components: {
        't-table':UsersTable,
        LoadingBtn
    },
    data(){
        return{
            loading:true,
            payments:null,
            tableHead:[],
            tableBody:[],
            modalOpen:false,
            editData:[],
            loadInstallments:true
        }
    },
    methods:{
        ...mapActions(['setNotify']),
        setPaymentsTable(){
            this.tableHead = [
                { label: 'TYPE'},
                { label: 'VERİLME TARİHİ', type: 'date' },
                { label: 'TOPLAM ÖDEME', type: 'price' },
                { label: 'KALAN TUTAR', type: 'price' },
                { label: 'ÖDEME DURUMU', type: 'status' },
                { label: 'YÖNET', type: 'id' }
            ];
            if(this.payments){
                this.tableBody=this.payments.map((item) => [ 
                    item.type==1 ? "Avans" : "Kesinti",
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
            this.editData = this.payments.find((item)=>item.id==id)
            this.editData.date = new Date(this.editData.date)
            this.loadInstallments=false
            this.modalOpen=true
        },
        async getPayments(){
            try {
                const response = await this.$http.get(`/payment?user_id=${this.userInfo.id}`);
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
    },
    computed:{
        ...mapState(['userInfo'])
    },
    created(){
        this.getPayments().then(() => {
            this.setPaymentsTable();
        })
    },
}
</script>

<style>

</style>