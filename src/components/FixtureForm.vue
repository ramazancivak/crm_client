<template>
    <form @submit="saveFixture" class="py-3 grid gap-4 col-span-3">
        <div class="group flex items-center">
            <label for="fixture_name" class="block mb-1 text-md w-1/2 font-semibold">Ürün Adı</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <input type="text" id="fixture_name" v-model="formData.name" class="diji-input">
            </div>
        </div>

        <div class="group flex items-center">
            <label for="fixture_model" class="block mb-1 text-md w-1/2 font-semibold">Model Adı</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <input type="text" id="fixture_model" v-model="formData.model" class="diji-input">
            </div>
        </div>

        <div class="group flex items-center">
            <label for="seri_no" class="block mb-1 text-md w-1/2 font-semibold">Seri No</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <input type="text" id="seri_no" v-model="formData.seri_no" class="diji-input">
            </div>
        </div>

        <div class="group flex items-center">
            <label for="fixture_where_is_return" class="block mb-1 text-md w-1/2 font-semibold">Geri İadede Ne oldu</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <input type="text" id="fixture_where_is_return" v-model="formData.where_is_return" class="diji-input">
            </div>
        </div>

        <div class="group flex items-center">
            <label for="fixture_delivery_date" class="block mb-1 text-md w-1/2 font-semibold">Kişiye Teslim Edilme Tarihi</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <DatePicker
                v-model="formData.delivery_date"
                :format="formatOptions"
                class="diji-input" ></DatePicker>
            </div>
        </div>
        
        <div class="group flex items-center">
            <label for="fixture_delivery_date" class="block mb-1 text-md w-1/2 font-semibold">Kayıtlı Yer</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <select id="user" class="diji-input" v-model="formData.user_id" required>
                    <option :value="user.id" v-for="user in users" :key="user.id">{{ user.name }}</option>
                </select>
            </div>
        </div>

        <div class="group flex items-center">
            <label for="fixture_return_date" class="block mb-1 text-md w-1/2 font-semibold">Geri Alınma Tarihi</label>
            <div class="font-bold px-3 w-[40px]">:</div>
            <div class="w-1/2">
                <DatePicker
                v-model="formData.return_date"
                :format="formatOptions"
                class="diji-input" ></DatePicker>
            </div>
        </div>

        <div class="flex gap-3 justify-end">
            <custom-button :size="'btn-sm'" @click="$emit('closePopup')" :bg="'bg-red-500'">İptal</custom-button>
            <custom-button :size="'btn-sm'" :bg="'bg-green-400'" @click="saveFixture">Kaydet</custom-button>
        </div>

    </form>
</template>

<script>
import CustomButton from './ui/CustomButton.vue';
import { mapActions, mapState } from 'vuex';
export default {
    name:'FixtureForm',
    props : ['fixture','isNew'],
    data (){
        return {
            formData:this.fixture
        }
    },
    components : {
        CustomButton,
    },
    methods: {
        ...mapActions(['setNotify']),
        async saveFixture(){

            let response=[];
            if(Object.prototype.hasOwnProperty.call(this.formData, 'id')){
                response = await this.$http.put(`${this.$apiUrl.fixtures}/${this.formData.id}`, this.formData);
            }else{
                response = await this.$http.post(`${this.$apiUrl.fixtures}`, this.formData);
            }
            if(response.data.success){
                this.formData=response.data.data
                this.$emit('updateFixture', this.formData);
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
        },
    },
    created () {
        if(this.isNew==true){
            this.formData = {
                user_id:7
            }
        }else{
            this.formData.delivery_date = this.formData.delivery_date ? new Date(this.formData.delivery_date) : ''
            this.formData.return_date = this.formData.return_date ? new Date(this.formData.return_date) : ''
        }
    },
    computed:{
        ...mapState(['users']),
        
    },
}
</script>

<style>

</style>