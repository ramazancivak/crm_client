<template>
    <div>
        {{year}}
    </div>
</template>

<script>

export default{
    data(){
        return{
            year:new Date().getFullYear()
        }
    },
    created(){
        console.log("https://date.nager.at/Api/v2/PublicHolidays/2014/TR")
    }
}

</script>