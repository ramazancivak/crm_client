<template>
    <div>        

        <CalendarLeave @changeList="fetchEventsForDateRange()" class="w-full mt-5" />

    </div>
</template>

<script>

import CalendarLeave from '@/components/ui/CalendarLeave.vue'
export default {
    name:'myCalendar',
    components: {
        CalendarLeave
    },
    data(){
        return{
        }
    },
    methods:{
    },
    mounted(){
    },  
    created(){
    }
}
</script>

<style>

</style>./CalendarPage.vue