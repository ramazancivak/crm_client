<template>
  <div>
    <div class="w-full flex items-center mb-2 justify-between">
        <div class="flex gap-3 items-center">
            <h1 class="py-2 text-md font-bold">ÇALIŞAN LİSTESİ</h1>
            <router-link to="/users/new">
                <CustomButton>Yeni Çalışan Ekle</CustomButton>
            </router-link>
        </div>
        <div class="flex gap-2">
            <div class="py-1 px-5 rounded-md text-white" :class="$globalVeriable.calismaTipi.find(item => item.hasOwnProperty('active')) ? 'bg-blue-300 cursor-pointer' : 'bg-bgPrimary'" @click="filterUsers()">Tamamı</div>
            <div 
                class="py-1 px-5 rounded-md text-white"
                :class="item.hasOwnProperty('active') ? 'bg-bgPrimary' : 'bg-blue-300 cursor-pointer'"
                @click="filterUsers(item.id)" v-for="item in $globalVeriable.calismaTipi" :key="item.id">
                {{ item.name }}
            </div>
        </div>
    </div>
    <LoadingBtn v-if="loading"></LoadingBtn>
    <t-table v-else :head="tableHead" :body="tableBody" page="users" />
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
import CustomTable from '@/components/ui/CustomTable.vue';
import CustomButton from "@/components/ui/CustomButton.vue";
import LoadingBtn from "@/components/ui/LoadingBtn.vue";
export default {
    components:{
        't-table':CustomTable,
        CustomButton,
        LoadingBtn
    },
    data(){
        return{
            tableHead:[],
            tableBody:[],
            loading:true
        }
    },
    computed:{
        ...mapState(['users']),
    },
    methods: {
        ...mapActions(['fetchUsers']),
        updateTableBody() {
            this.tableBody = this.users.map((user) => [user.name, user.departman_id, user.phone, user.working_type, user.date_of_start, user.id]);
        },
        filterUsers(type_id){
            this.loading=true;
            let filters = ''
            this.$globalVeriable.calismaTipi.forEach(item => {
                delete item.active;
            });
            if(type_id){
                filters="working_type="+type_id
                this.$globalVeriable.calismaTipi.find(item => item.id==type_id)['active'] = true
            }
            this.fetchUsers({filter:filters}).then(() => {
                this.updateTableBody();
                this.loading=false;
            });
        }
    },
    created(){
        this.fetchUsers({}).then(() => {
            this.tableHead = [
                { label: 'ÇALIŞAN ADI' },
                { label: 'DEPARTMAN' , type:'departman' },
                { label: 'İLETİŞİM' },
                { label: 'ÇALIŞAN TİPİ', type:'work_type'},
                { label: 'İŞE BAŞLAMA TARİHİ', type:'date' },
                { label: 'YÖNET', type: 'id' }
            ];
            this.updateTableBody();
            this.loading=false;
        });
    }
}
</script>

<style>

</style>