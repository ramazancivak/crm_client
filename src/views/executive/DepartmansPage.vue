<template>
    <div>
        <div class="w-full flex items-center mb-2 justify-between">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">DEPARTMANTLAR</h1>
                <CustomButton @click="addDepartman">Yeni Departman Ekle</CustomButton>
            </div>
        </div>
        <LoadingBtn v-if="loading"></LoadingBtn>
        <div v-for="(departman, dIndex) in departmanList" :key="dIndex">
            <div class="font-semibold py-1 flex justify-between">
                <div class="flex gap-3 items-center cursor-pointer" @click="toggleSubDepartman(departman)">
                    <div> > </div>
                    {{ dIndex+1 }} - {{ departman.name }}
                </div>
                <CustomButton @click="deleteJob(departman,dIndex)">Sil</CustomButton>
            </div>
            <div class="bg-opacity-[90%] w-full block rounded-lg rounded-tl-none">
                <DepartmanChild :departman_info="departman" v-if="departman.visible"></DepartmanChild>
            </div>
        </div>
    </div>
    
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DepartmanChild from "@/components/DepartmanChild.vue";
import CustomButton from "@/components/ui/CustomButton.vue";
import LoadingBtn from "@/components/ui/LoadingBtn.vue"
export default {
    components : {
        CustomButton,
        DepartmanChild,
        LoadingBtn
    },
    data(){
        return{
            departmanList:[],
            breadcrumb:[],
            loading:true
        }
    },
    methods:{
        ...mapActions(['setNotify','setCacheDepartman']),

        toggleSubDepartman(subDepartman) {
            subDepartman.visible = !subDepartman.visible;
        },
        async loadDepartmans(){
            this.setCacheDepartman() //departman cache silmek için boş değer ile action yapıyroum.
            await this.$http.get(this.$apiUrl.departmans)
            .then((result)=>{
                this.departmanList=result.data.data
                this.departmanList.forEach(element => {
                    this.setCacheDepartman(element)
                });
                this.loading=false
            })
        },

        async addDepartman(){
            let data = {
                name : 'YENİ DEPARTMAN'
            }
            await this.$http.post(this.$apiUrl.departmans, data)
            .then((result)=>{
                this.departmanList.push(result.data.data)
                this.setCacheDepartman(result.data.data)
            })
        },

        async deleteJob(departman,index) {
            this.$swal({
                title: 'Emin misiniz?',
                text: 'Departmanı silmek istediğinizden emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet, sil',
                cancelButtonText: 'İptal',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await this.$http.delete(`${this.$apiUrl.departmans}/${departman.id}`);
                    if(response.data.success){
                        this.departmanList.splice(index, 1);
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'success'
                        });
                    }else{
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'danger'
                        });
                    }
                }
            });
        },
    },
    computed: {
        ...mapState(['cacheDepartman'])
    },
    created(){
        this.loadDepartmans()
    }

}
</script>

<style>

</style>