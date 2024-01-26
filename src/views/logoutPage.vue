<template>
    <div class="w-screen h-screen flex items-center justify-center">
        Çıkış yapılıyor
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name : 'logoutPage',
    computed:{
    },
    methods: {
        ...mapActions(['setLogout']),
    },
    created(){
        setTimeout(async () => {
            await this.setLogout();
        }, 1000);
    }
}
</script>

<style>

</style>