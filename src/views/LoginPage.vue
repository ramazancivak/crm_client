<template>
    <div class="w-screen h-screen flex items-center justify-center">
        <div id="Login" class="min-w-[854px] max-w-full min-h-[528] bg-red-40009* flex bg-white shadow-md rounded-md">
            <div class="w-1/2">
                <img src="../assets/img/banner/login.jpg" alt="">
            </div>
            <div class="w-1/2 flex justify-center items-center">
                <form @submit.prevent="login" class="w-9/12 flex gap-5 flex-col">
                    <div class="flex gap-2 flex-col w-full">
                        <label for="username">Kullanıcı Adı</label>
                        <input type="text" name="username" v-model="user.user_name"  class="diji-input">
                    </div>
                    
                    <div class="flex gap-2 flex-col w-full">
                        <label for="password">Şifre</label>
                        <input type="password" name="password" v-model="user.password" :autocomplete="user.password" class="diji-input">
                    </div>

                    <div class="text-sm text-right cursor-pointer" @click="fargotPassword">Şifremi Unuttum ? </div>
                    
                    <CustomButton class="mt-3" type="submit">Giriş Yap</CustomButton>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomButton from '../components/ui/CustomButton.vue';

export default {
    name : 'LoginPage',
    components : {
        CustomButton
    },
    data (){
        return {
            user: {
                user_name:'ramram',
                password:'159753Diji1'
            },
        }
    },
    computed:{
    },
    methods: {
        ...mapActions(['setLogin','setNotify']),
        
        login(){
            if (this.user.user_name!='') {
                this.$http
                .post(`/auth/login`, this.user)
                .then(response => {
                    let data = response.data;
                    if(data.success){
                        this.setLogin({ 
                            token: data.token, 
                            user: data.data 
                        })
                        this.setNotify({
                            'title':'Başarılı',
                            'desc':'Başarıyla giriş yaptınız, Panele Yölendiriliyorsunuz...',
                            'class':'success'
                        })
                        
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 1000);
                    }else{
                        this.setNotify({
                            'desc':response.data.message.text,
                            'class':'danger'
                        })
                    }
                })
                .catch(error => {
                    this.setNotify({
                        'desc':error,
                        'class':'danger'
                    })
                });
            } else {
                this.setNotify({
                    'desc':"Lütfen kullanıcı adını giriniz",
                    'class':'danger'
                })
            }
        },
        fargotPassword(){
            this.$swal.fire({
                title: "Şifre Yenileme",
                input: 'text', // Input türünü belirtin
                inputLabel:'Kullanıcı Adı',
                inputValue:'',
                showCancelButton: true,
                confirmButtonText: 'Gönder',
                cancelButtonText: 'İptal',
                inputValidator: (value) => {
                if (!value) {
                    return 'Boş olamaz';
                }
                },
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await this.$http.post(`sendEmail/fargotPassword`,{user_name:result.value});
                    if(response.data.success){
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
        }
    },
}
</script>

<style>

</style>