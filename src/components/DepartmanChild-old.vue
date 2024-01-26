<template>
    <div class="relative min-h-full">
        <div v-if="list.length==0" class="text-white p-3">
            İş tanımı bulunmuyor. Yeni ekleyebilirsiniz...
        </div>
        <div v-else class="flex gap-2 p-3 py-2 text-white items-center cursor-pointer uppercase flex justify-between"
            v-for="(job,index) in list"         
            :key="index"        
            @mouseover="showDeleteBtn=index"
            @mouseleave="showDeleteBtn=null"
            >
                <div class="flex gap-3 items-center">
                    <div class="w-8 h-8 bg-white border border-blue-700 border-[3px] flex items-center justify-center text-xl rounded-full text-blue-700 leading-none font-medium" @click="getJobList(job)" >></div>
                    <div>{{ job.title }}</div>
                </div>
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

        <div class="px-2 h-8 bg-white border border-blue-700 border-[3px] flex items-center justify-center text-md rounded-full text-blue-700 leading-none font-medium absolute left-2 bottom-2 cursor-pointer"
         @click="goBack"
         v-if="active_parent_id != 0"
         > GERİ </div>

        <div class="w-8 h-8 bg-white border border-blue-700 border-[3px] flex items-center justify-center text-3xl rounded-full text-blue-700 leading-none font-medium absolute right-2 bottom-2 cursor-pointer"
         @click="editJob()"
         >+</div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    props : ['departman_info'],
    data(){
        return{
            list:[],
            oldData:[],
            showDeleteBtn:null,
            departmanInfo:this.departman_info,
            active_parent_id:0,
            breadcrumb:[],
            cache: {},
        }
    },
    methods:{
        ...mapActions(['setNotify']),
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
        goBack() {
            this.breadcrumb.pop()
            let  previousParent = this.breadcrumb.pop() || this.departmanInfo
            this.active_parent_id=previousParent.name!=undefined ? 0 : previousParent.id
            if (this.cache[this.active_parent_id]) {
                this.list = JSON.parse(JSON.stringify(this.cache[this.active_parent_id]));
                this.breadcrumb.push(previousParent)
            } else {
                this.getJobList(previousParent);
            }
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
                    this.cache[this.active_parent_id] = this.list;
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
            if (this.cache[job_id]) {
                // Eğer önbellekte veri varsa, önbellekten alınacak...
                this.list = JSON.parse(JSON.stringify(this.cache[job_id]));
                this.breadcrumb.push(job)
            } else{
                await this.$http.get(`${this.$apiUrl.departmansJobs}?departman_id=${this.departmanInfo.id}&parent_id=${this.active_parent_id}`)
                .then((result)=>{
                    this.list=result.data.data
                    this.oldData = JSON.parse(JSON.stringify(result.data.data));
                    this.cache[job_id] = result.data.data;
                    this.breadcrumb.push(job)
                }).catch((error)=>{
                    console.log(`İş Tanımları gelirken hata:${error}`)
                })
            }
        }
    },
    created(){
        this.getJobList(this.departmanInfo)
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