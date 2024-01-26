 
<template>
    <div>
        <div class="text-md py-2 border-b mb-3 font-bold text-primaryDark">Avanslarım</div>
        <LoadingBtn v-if="loading"></LoadingBtn>
        <t-table v-else :head="tableHead" :body="tableBody" page="payments" class="mt-4" />
    </div>
</template>

<script>
import UsersTable from '@/components/ui/CustomTable.vue';
import LoadingBtn from "@/components/ui/LoadingBtn.vue";

import { mapActions } from 'vuex'
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
        }
    },
    methods:{
        ...mapActions(['setNotify']),
        setPaymentsTable(){
            this.tableHead = [
                { label: 'VERİLME TARİHİ', type: 'date' },
                { label: 'TOPLAM ÖDEME', type: 'price' },
                { label: 'KİŞİ', type: 'user_name' },
                { label: 'ÖDEME DURUMU', type: 'status' },
                { label: 'YÖNET', type: 'id' }
            ];
            if(this.payments){
                this.tableBody=this.payments.map((item) => [item.date, item.total_amount, item.user, item.status,item.id])
            }
        },
        async getPayments(){
            try {
                const response = await this.$http.get(`/payment/`);
                if(response.data.success){
                    this.payments = response.data.data; 
                    this.setPaymentsTable();
                    this.loading = false;
                }else{
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'danger'
                    });
                }
            } catch (error) {
                this.setNotify({
                    'desc': error,
                    'class': 'danger'
                });
            }
        }
    },
    created(){
        this.getPayments().then(() => {
            this.setPaymentsTable();
        })
    }
}
</script>

<style>

</style>