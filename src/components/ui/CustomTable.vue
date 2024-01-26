<template>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs">
            <tr>
                <th scope="col" class="px-6 py-3" :class="{'pl-0':index==0}" v-for="(item, index) in head" :key="index">
                    {{ item.label }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="body.length==0">
                <td class="text-red-500">Kayıtlı Veri bulunmamaktadır.</td>
            </tr>
            <tr class="border-t" v-for="(item, rowIndex) in body" :key="rowIndex" v-else>
                <td class="px-6 py-4" :class="{'pl-0':index==0}" v-for="(val, index) in item" :key="index">
                    <span v-if="index!=item.length-1 || isDetails">
                        <!--Burası users tablosu özelinde-->
                        <span v-if="head[index].type=='departman' && departmansList.find(item=>item.id == val)" class="text-center bg-lime-600 text-white py-3 w-3/4 block rounded-3xl" :class="{'bg-purple-500':val==1,'bg-yellow-500':val==2,'bg-blue-500':val==3}">
                             {{ departmansList.find(item=>item.id == val).name}} Departmanı
                        </span>
                        <span v-else-if="head[index].type=='work_type' && val!=0">
                             {{ $globalVeriable.calismaTipi.find(item=>item.id == val).name}}
                        </span>
                        <span v-else-if="head[index].type=='date' && val!=''">
                             {{ formatDate(val) }}
                        </span>
                        <span v-else-if="head[index].type=='status' && val!=''">
                            <div class="cursor-pointer">
                                <i class="fas fa-circle-check" :class="val==1 ? 'text-green-500':'text-red-500'"></i>
                            </div>
                        </span>
                        
                        <!--Burası fixtures tablosu özelinde-->
                        <span v-else-if="head[index].type=='user_name' && val!=undefined">
                             {{ val.name}}
                        </span>

                        <span v-else>{{ val }} {{ head[index].type=='price' ? 'TL' : '' }}</span>
                    </span>
                    <div class="flex text-primary cursor-pointer" v-else>
                        <div v-if="editType=='action'" class="font-medium" @click="$emit('actionModule',val)">
                            <CustomButton bg="bg-green-600" size="btn-sm" icon="fa-pen" class="w-full">
                                Detay
                            </CustomButton>
                        </div>
                        <router-link :to="'/users/'+val" class="font-medium py-1" v-else>
                            
                            <CustomButton bg="bg-green-600" size="btn-sm" icon="fa-eye" class="w-full">
                                Detay
                            </CustomButton>
                        </router-link>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    
</template>

<script>
import CustomButton from '@/components/ui/CustomButton.vue'

export default {
    components:{
        CustomButton
    },
    props:['head','body', 'page','editType'],
    data(){
        return{
            departmansList:[]
        }
    },
    methods:{
        async getDepartmans(){
            const response = await this.$http.get(`${this.$apiUrl.departmans}`);
            if(response.data.success){
                this.departmansList=response.data.data
            }else{
                this.setNotify({
                'desc': response.data.message.text,
                'class': 'danger'
                });
            }
        },
    },
    computed:{
        isDetails(){
            return this.$route.name === 'UsersDetails' || this.$route.name === 'myFixtures'
        }
    },
    created(){
        if(this.page=='users'){
            this.getDepartmans()
        }
    }
}
</script>

<style>

</style>