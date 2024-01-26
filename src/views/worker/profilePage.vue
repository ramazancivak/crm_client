<template>
  <div>
    <div class="text-md py-2 border-b mb-3 font-bold text-primaryDark">BİLGİLERİM</div>
    <LoadingBtn v-if="loading"></LoadingBtn>
    <userCard v-else :user="user" />
  </div>
</template>

<script>
import userCard from '@/components/users/userCard.vue';
import LoadingBtn from "@/components/ui/LoadingBtn.vue";
import { mapActions } from 'vuex'
export default {
    name : 'detailsPage',
    components:{
      userCard,
      LoadingBtn
    },
    data(){
        return{
            loading:true,
            user:null
        }
    },
    methods:{
        ...mapActions(['setNotify']),
        async getUser() {
            const userId = this.$store.getters.userId;
            try {
                const response = await this.$http.get(`/user/users/${userId}`);
                if(response.data.success){
                    this.user = response.data.data; 
                    this.loading=false
                }else{
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'danger'
                    });
                }
            } catch (error) {
                this.setNotify({
                    'desc': error,
                    'class': 'danger'
                });
            }
        },
    },
    created(){
        this.getUser();
    }
}
</script>

<style>

</style>