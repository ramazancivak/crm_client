<template>
    <div class="bg-white shadow-md rounded-md p-3 min-h-screen">
        <div class="grid grid-cols-3 gap-5">
            <div class="text-sm" v-for="(departman,dIndex) in departmanList" :key="dIndex">
                <div class="flex justify-between items-center">
                    <div :class="departman.color" class="py-4 px-4 w-auto text-white rounded-tl-lg rounded-tr-lg font-semibold uppercase">
                        <span v-if="breadcrumb[departman.id]" :class="breadcrumb[departman.id].length-1>0 ? 'cursor-pointer' : ''" @click="back(dIndex,departman.id)">
                            {{ breadcrumb[departman.id][breadcrumb[departman.id].length-1].name ? breadcrumb[departman.id][breadcrumb[departman.id].length-1].name : breadcrumb[departman.id][breadcrumb[departman.id].length-1].title }}
                        </span>
                        <!-- <span class="px-1" @click="back(dIndex,index,departman.id)" v-for="(item,index) in breadcrumb[departman.id]" :key="index">
                            {{ item.name ? item.name : item.title }} 
                            <i v-if="index!=breadcrumb[departman.id].length-1">></i>
                        </span> -->
                    </div>
                    <div class="diji-btn btn-sm bg-red-500 text-white" @click="deleteJob(departman, index)">SİL</div>
                    
                </div>
                <div :class="departman.color" class="bg-opacity-[90%] w-full block rounded-lg rounded-tl-none h-[400px] overflow-y-auto">
                    <DepartmanChild :departman_info="departman" @changeStack="getStack" ref="childDepart"></DepartmanChild>
                </div>
            </div>
        </div>
        <div class="block w-full my-5">
            <custom-button @click="addDepartman" class="ml-auto">Departman Ekle</custom-button>
        </div>
        
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import DepartmanChild from "../../components/DepartmanChild.vue";
import CustomButton from "../../components/ui/CustomButton.vue";
export default {
    components : {
        DepartmanChild,
        CustomButton
    },
    data(){
        return{
            departmanList:[],
            renkList:['bg-sky-500','bg-cyan-500','bg-indigo-500','bg-rose-500','bg-fuchsia-500','bg-red-700','bg-blue-500'],
            breadcrumb:[]
        }
    },
    methods:{
        ...mapActions(['setNotify']),
        getStack(id, stack){
            this.breadcrumb[id]=stack;
        },
        back(dIndex , departman_id){
            if(this.breadcrumb[departman_id].length>1){
                this.$refs.childDepart[dIndex].goBack();
            }
        },
        async loadDepartmans(){
            await this.$http.get(this.$apiUrl.departmans)
            .then((result)=>{
                this.departmanList=result.data.data
                this.departmanList.forEach((item,index) => {
                    item.color=this.renkList[index]
                })
            })
        },

        async addDepartman(){
            let data = {
                name : 'YENİ DEPARTMAN'
            }
            await this.$http.post(this.$apiUrl.departmans, data)
            .then((result)=>{
                this.departmanList.push(result.data.data)
                this.departmanList.forEach((item,index) => {
                    item.color=this.renkList[index]
                })
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
    created(){
        this.loadDepartmans()
    }

}
</script>

<style>

</style>