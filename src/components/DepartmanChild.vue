<template>
    <div class="relative pl-4">
        <div v-if="list.length==0" class=" p-3">
            İş tanımı bulunmuyor. Yeni ekleyebilirsiniz...
        </div>
        <div v-else class="flex gap-2 py-2 items-center cursor-pointer uppercase flex-col border-b" 
            v-for="(job,index) in list"         
            :key="index"        
            @mouseover="showDeleteBtn=index"
            @mouseleave="showDeleteBtn=null"
            >
            <div class="flex gap-3 items-center justify-between w-full h-8">
                <div @click="toggleSubDepartman(job)">{{ job.title }}</div>
                <!-- <input 
                @blur="oldData[index].title!=job.title ? updateJobs(job) : null"
                @keydown.enter="oldData[index].title!=job.title ? updateJobs(job) : null"
                v-model="job.title"
                type="text"
                class="bg-transparent w-full uppercase border-none border focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 p-2"> -->
                
                <div v-show="showDeleteBtn==index" class="flex gap-3">
                    
                    <div class="diji-btn btn-sm bg-green-500 h-auto" @click="editJob(job, index)">
                        DÜZENLE
                    </div>
                    <div class="diji-btn btn-sm bg-red-500 h-auto" v-show="showDeleteBtn==index" @click="deleteJob(job, index)">
                        SİL
                    </div>
                </div>
            </div>
            
            <div class="block rounded-lg rounded-tl-none w-full" v-if="job.visible">
                <DepartmanChild :departman_info="departman_info" :subDepartman="job"></DepartmanChild>
            </div>
        </div>
        <div class="py-2 border-b last:border-b-0" >
            <div class="h-8 flex items-center w-full cursor-pointer" @click="editJob()">
                İş Tanımı Ekle...
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import departmanChild from '@/components/DepartmanChild.vue'

export default {
    props : ['departman_info','subDepartman'],
    components : {
        departmanChild
    },
    data(){
        return{
            list:[],
            oldData:[],
            showDeleteBtn:null,
            departmanInfo:this.departman_info,
            active_parent_id:0,
            breadcrumb:[],
        }
    },
    methods:{
        ...mapActions(['setNotify','setCacheDepartman']),
        toggleSubDepartman(subJob) {
            subJob.visible = !subJob.visible;
        },
        editJob(job,index){
            let title="Yeni iş tanımı";
            let swalTitle = "İş Tanımı Ekle";
            let swalBtn = "Ekle"
            if(job!=undefined){
                title = this.list[index].title;
                swalTitle = "İş Tanımı Düzenle",
                swalBtn = "Düzenle"
            }
            this.$swal.fire({
                title: swalTitle,
                input: 'text', // Input türünü belirtin
                inputValue:title,
                showCancelButton: true,
                confirmButtonText: swalBtn,
                cancelButtonText: 'İptal',
                inputValidator: (value) => {
                if (!value) {
                    return 'Boş olamaz';
                }
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    const inputValue = result.value;
                    if(job!=undefined){
                        if (inputValue !== null && inputValue!==this.list[index].title) {
                            this.list[index].title = inputValue
                            this.updateJobs(job, index)
                        }
                    }else{
                        this.addJob(inputValue)
                    }
                }
            });
        },
        async deleteJob(job,index) {
            this.$swal({
                title: 'Emin misiniz?',
                text: 'İş tanımını silmek istediğinizden emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet, sil',
                cancelButtonText: 'İptal',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await this.$http.delete(`${this.$apiUrl.departmansJobs}/${job.id}`);
                    if(response.data.success){
                        this.list.splice(index, 1);
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
        async updateJobs(job){
            await this.$http.put(`${this.$apiUrl.departmansJobs}/${job.id}`,job)
            .then((result)=>{
                if(result.data.success){
                    this.oldData = JSON.parse(JSON.stringify(this.list));
                    const cacheDepartman = {
                        id: this.active_parent_id,
                        departman_id:this.departmanInfo.id,
                        data : this.list
                    }
                    this.setCacheDepartman(cacheDepartman)
                    this.setNotify({
                        'desc': result.data.message.text,
                        'class': 'success'
                    });
                }else{
                    this.setNotify({
                        'desc': result.data.message.text,
                        'class': 'warning'
                    });
                }
            }).catch((error)=>{
                console.log(`İş Tanımları gelirken hata:${error}`)
            })  
        },
        async addJob(title){
            let data = {
                'departman_id':this.departmanInfo.id,
                'title':title,
                'parent_id':this.active_parent_id
            }
            await this.$http.post(`${this.$apiUrl.departmansJobs}`,data)
            .then((result)=>{
                if(result.data.success){
                    if(this.list===undefined){
                        this.list=[result.data.data]
                    }else{
                        this.list.push(result.data.data)
                    }
                    const cacheDepartman = {
                        id: this.active_parent_id,
                        departman_id:this.departmanInfo.id,
                        data : this.list
                    }
                    this.setCacheDepartman(cacheDepartman)
                    
                    this.oldData = JSON.parse(JSON.stringify(this.list));
                    this.setNotify({
                        'desc': result.data.message.text,
                        'class': 'success'
                    });
                }else{
                    this.setNotify({
                        'desc': result.data.message.text,
                        'class': 'warning'
                    });
                }
            }).catch((error)=>{
                console.log(`İş Tanımları gelirken hata:${error}`)
            })
        },
        async getJobList(job){
            const job_id= job.name==undefined ? job.id : 0;
            this.active_parent_id = job_id
            console.log(this.cacheDepartman[this.departmanInfo.id])
            if (this.cacheDepartman[this.departmanInfo.id][job_id]) {
                // Eğer önbellekte veri varsa, önbellekten alınacak...
                this.list = JSON.parse(JSON.stringify(this.cacheDepartman[this.departmanInfo.id][job_id]));
                this.breadcrumb.push(job)
            } else{
                await this.$http.get(`${this.$apiUrl.departmansJobs}?departman_id=${this.departmanInfo.id}&parent_id=${this.active_parent_id}`)
                .then((result)=>{
                    this.list=result.data.data
                    this.oldData = JSON.parse(JSON.stringify(result.data.data));
                    const cacheDepartman = {
                        id: job_id,
                        departman_id:this.departmanInfo.id,
                        data : result.data.data
                    }
                    this.setCacheDepartman(cacheDepartman)
                    this.breadcrumb.push(job)
                }).catch((error)=>{
                    console.log(`İş Tanımları gelirken hata:${error}`)
                })
            }
            console.log("this.cacheDepartman")
            console.log(this.cacheDepartman)
        }
    },
    computed:{
        ...mapState(['cacheDepartman'])
    },
    created(){
        if(this.subDepartman){
            this.getJobList(this.subDepartman)
        }else{
            this.getJobList(this.departmanInfo)
        }
    },
    
    watch: {
        breadcrumb : {
            handler: function (newVal) {
                this.$emit('changeStack',this.departmanInfo.id,newVal)
            },
            deep: true
        },
    }
}
</script>

<style>

</style>