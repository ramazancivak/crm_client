<template>
    
    <div>
        <div class="w-full flex items-center mb-2 justify-between" v-if="!$route.params.id">
            <div class="flex gap-3 items-center">
                <h1 class="py-2 text-md font-bold">Ayarlar</h1>
            </div>
        </div>
        <div class="grid grid-cols-6 gap-5" v-if="!$route.params.id">
            <router-link :to="'/settings'+setting.link" class="rounded-lg flex p-3 text-white" :class="setting.color" v-for="setting in settingsList" :key="setting">
                <i class="fas mr-2 w-[25px] justify-center flex text-2xl" :class="setting.icon"></i>
                <div>
                    <span class="text-lg">{{ setting.title }}</span>
                </div>
            </router-link>
        </div>
        <div v-else>
            <CustomButton class="mb-2" size="btn-md" bg="bg-zinc-800" icon="fa-angle-left" @click="$router.back()">GERİ</CustomButton>
            <div v-if="$route.params.id==1">
                <FoodPrice />
            </div>
            <div v-if="$route.params.id==2">
                <SetHoliday />
            </div>
        </div>
    </div>
</template>

<script>

import CustomButton from '@/components/ui/CustomButton.vue';
import FoodPrice from '@/components/settings/FoodPrice.vue';
import SetHoliday from '@/components/settings/SetHoliday.vue';

export default {
    components:{
        CustomButton,
        FoodPrice,
        SetHoliday
    },
    data(){
        return{
            settingsList:[
                {
                    title:'Multinet Ücreti',
                    link:'/1',
                    icon:'fa-sack-dollar',
                    color:'bg-yellow-500'
                },
                {
                    title:'Resmi Tatilleri Güncelle',
                    link:'/2',
                    icon:'fa-sun',
                    color:'bg-green-500'
                },
            ]
        }
    },
    methods:{

    },
    computed:{
    },
    mounted(){
    },
    created(){
    },
    watch: {
    },
}
</script>

<style>

</style>