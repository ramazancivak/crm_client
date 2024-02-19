<template>
    <div class="w-screen h-screen flex items-center justify-center">
        <div id="Login" class="min-w-[854px] max-w-full min-h-[528] bg-red-40009* flex bg-white shadow-md rounded-md">
            <div class="w-1/2">
                <img src="../assets/img/banner/login.jpg" alt="">
            </div>
            <div class="w-1/2 flex justify-center items-center">
                <div class="flex justify-center flex-col items-center" v-if="userInfo.register_done && $route.name=='SignDone'">
                    <div class="mb-2">Merhaba <b>{{ userInfo.name }}</b>, kayıt tamamlanmış görünüyor...</div>
                    <router-link to="/login">
                        <CustomButton class="mt-3" type="submit">Giriş Yap</CustomButton>
                    </router-link>
                </div>
                <div class="flex justify-center" v-if="success!=null">
                     {{success}}
                </div>
                <form @submit.prevent="registerDone" class="flex gap-5 flex-col" v-if="success==null">
                    <div class="mb-2" v-if="$route.name=='SignDone'">Merhaba <b>{{ userInfo.name }}</b>, aramıza hoşgeldin...</div>
                    <div class="flex justify-center flex-col items-center" v-else>
                        <div class="mb-2">Merhaba <b>{{ userInfo.name }}</b>, şifreni yenile...</div>
                    </div>
                    <div class="flex gap-2 flex-col w-full" v-if="$route.name=='SignDone'">
                        <label for="username">Kullanıcı Adı</label>
                        <input type="text" :disabled="$route.name=='FargotPassword'" name="username" v-model="user.user_name"  class="diji-input">
                    </div>
                    
                    <div class="flex gap-2 flex-col w-full">
                        <label for="password">{{ $route.name=='SignDone' ? "Şifre" : "Yeni Şifre" }}</label>
                        <input type="password" name="password" v-model="user.password" :autocomplete="user.password" class="diji-input">
                    </div>

                    <div class="flex gap-2 flex-col w-full">
                        <label for="rePassword">{{ $route.name=='SignDone' ? "Şifre Tekrar" : "Yeni Şifre Tekrar" }}</label>
                        <input type="password" name="rePassword" v-model="user.rePassword" :autocomplete="user.rePassword" class="diji-input">
                    </div>
                    
                    <CustomButton class="mt-3" type="submit">
                        {{ $route.name=='SignDone' ? "Kaydı Tamamla" : "Şifre Yenile" }}
                    </CustomButton>
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
                password:null,
                rePassword:null
            },
            userInfo:[],
            success:null
        }
    },
    computed:{
    },
    methods: {
        ...mapActions(['setNotify']),
        
        registerDone(){
                if (this.user.user_name=='') {
                    this.setNotify({
                        'desc':"Lütfen kullanıcı adını giriniz",
                        'class':'danger'
                    })
                    return false
                }
                if(this.user.password==null){
                    this.setNotify({
                        'desc':"Lütfen şifre belirleyiniz",
                        'class':'danger'
                    })
                    return false
                }
                if(this.user.password!=this.user.rePassword){
                    this.setNotify({
                        'desc':"Şifreler uyuşmuyor",
                        'class':'danger'
                    })
                    return false
                }
                
                this.$http.put(`/auth/signup/${this.userInfo.id}`, this.user)
                .then(response => {
                    let data = response.data;
                    if(data.success){
                        this.setNotify({
                            'title':'Başarılı',
                            'desc':this.$route.name=='SignDone'? 'Kayıt Başarılı':'Şifre yenilendi'+ ',giriş sayfasına yönlendiriliyorsunuz',
                            'class':'success'
                        })
                        
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 1000);
                    }else{
                        this.setNotify({
                            'desc':response.data.message.text,
                            'class':'danger'
                        })
                    }
                })
        },
        async getUser() {
            const token = this.$route.query.token;
            if (token) {
                try {
                const response = await this.$http.get(`/auth/signup?token=${this.$route.query.token}`);
                    if(response.data.success){
                        this.userInfo = response.data.data; // Düzenleme datası dolduruluyor...
                    }else{
                        this.setNotify({
                        'desc': response.data.message.text,
                        'class': 'danger'
                        });
                        this.success=response.data.message.text
                    }
                } catch (error) {
                this.setNotify({
                    'desc': error,
                    'class': 'danger'
                });
                }
                
            }else{
                this.setNotify({
                    'desc': "Kullanıcı bulunamadı",
                    'class': 'danger'
                });
                this.success= "Kullanıcı bulunamadı"
            }
        },
    },
    mounted(){
        this.getUser();
    }
}
</script>

<style>

</style>