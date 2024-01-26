<template>
    <div>
        <div class="text-md py-2 border-b mb-3 font-bold text-primaryDark">ADIMA KAYITLI DEMİRBAŞLAR</div>
        <LoadingBtn v-if="loading"></LoadingBtn>
        <t-table v-else :head="tableHead" :body="tableBody" page="fixture" class="mt-4" />
    </div>
</template>

<script>
import LoadingBtn from "@/components/ui/LoadingBtn.vue";
import UsersTable from '@/components/ui/CustomTable.vue';

import { mapActions } from 'vuex'
export default {
    name:'myFixtures',
    components: {
        't-table':UsersTable,
        LoadingBtn,
    },
    data(){
        return{
            loading:true,
            fixtures:null,
            tableHead:[],
            tableBody:[],
        }
    },
    methods:{
        ...mapActions(['setNotify']),
        async getFixtures(){
            const userId = this.$store.getters.userId
            try {
                const response = await this.$http.get(`/user/fixtures?user_id=${userId}`);
                if(response.data.success){
                    this.fixtures = response.data.data; 
                    this.setFixtureTable();
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
        setFixtureTable(){
            this.tableHead = [
                { label: 'KAYIT TARİHİ', type: 'date' },
                { label: 'ÜRÜN ADI' },
                { label: 'ÜRÜN MODELİ' },
                { label: 'ÜRÜN SERİ NUMARASI'},
            ];
            if(this.fixtures){
                this.tableBody=this.fixtures.map((item) => [item.delivery_date, item.name, item.model, item.seri_no])
            }
        },
    },
    created(){
        this.getFixtures()
    }
}
</script>

<style>

</style>