<template>
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">KAYITLI DEMİRBAŞLAR</h1>
                <CustomButton @click="actionFixture()">Yeni Demibaş Ekle</CustomButton>
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
        <t-table v-if="!loading" :head="tableHead" :body="tableBody" page="fixture" editType="action" @actionModule="actionFixture" />

        <div class="fixed top-0 h-screen" v-show="popupActive">
            <div class="bg-black cursor-pointer opacity-30 fixed left-0 top-0 h-screen w-screen" @click="actionFixture()"></div>
            <div class="w-1/3 p-2 z-10 -right-1/3 fixed  bg-white shadow-slate-600 shadow-lg  transition-all h-screen" :class="{'!right-0' : popupActive}">
                <div class="flex justify-between items-center border-b pb-2">
                    <div class="font-bold text-lg">{{ isNew ? 'YENİ EKLE' : 'DÜZENLE' }}</div>
                    <CustomButton @click="actionFixture()">X</CustomButton>
                </div>
                <FixtureForm v-if="popupActive" :isNew="isNew" :fixture="fixture" @updateFixture="updateFixture" @closePopup="actionFixture"></FixtureForm>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UsersTable from '@/components/ui/CustomTable.vue';
import CustomButton from "@/components/ui/CustomButton.vue";
import FixtureForm from '@/components/FixtureForm.vue';
export default {
    components:{
        't-table':UsersTable,
        CustomButton,
        FixtureForm,
    },
    data(){
        return{
            tableHead:[],
            tableBody:[],
            loading:true,
            popupActive:false,
            fixture:{},
            isNew:false
        }
    },
    computed:{
        ...mapState(['fixtures']),
    },
    methods:{
        ...mapActions(['setNotify','fetchFixtures','fetchUsers']),
        updateTableBody(){
            this.tableBody=this.fixtures.map((item) => [item.delivery_date, item.name, item.model, item.seri_no, item.user_data, item.id])
        },
        
        actionFixture(id=null) {
            this.popupActive=!this.popupActive;
            if(id!=null){
                this.fixture = this.fixtures.find(item => item.id === id);
                this.isNew=false
            }else{
                this.fixture=[];
                this.isNew=true
            }
        },
        updateFixture(updatedFixture) {
            const index = this.fixtures.findIndex(item => item.id === updatedFixture.id);
            if (index !== -1) {
                this.fixtures[index] = updatedFixture;
                this.updateTableBody();
            }
        }
    },
    created(){
        this.fetchFixtures().then(()=>{
            this.tableHead = [
                { label: 'KAYIT TARİHİ', type: 'date' },
                { label: 'ÜRÜN ADI' },
                { label: 'ÜRÜN MODELİ' },
                { label: 'ÜRÜN SERİ NUMARASI'},
                { label: 'KAYITLI KİŞİ',type : 'user_name' },
                { label: 'YÖNET' },
            ];
            this.updateTableBody();
            this.loading=false;
        })
        const usersColumn = 'id, name';
        this.fetchUsers({ columns: usersColumn })
    },

}
</script>

<style>

</style>