<template>
    <div> 
        <form @submit.prevent="handleSubmit">
            <div class="w-full border-b mb-4 flex justify-between">
                <div>
                    <div class="text-sm font-bold text-primaryDark">ÇALIŞAN TİPİ</div>
                    <div class="flex py-4">
                        <div class="flex items-center mr-4" v-for="item in $globalVeriable.calismaTipi" :key="item.id">
                            <input :id="'work_type'+item.id" type="radio" :value="item.id" v-model="formData.working_type" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label :for="'work_type'+item.id" class="ml-2 text-sm font-medium">{{item.name}}</label>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="grid gap-5 items-center" :class="isNew ? 'grid-cols-2' : 'grid-cols-1'">
                        <div class="group flex items-center">
                            <label for="user_name" class="text-sm mr-2">CRM Kullanıcı Adı</label>
                            <input type="text" id="user_name" v-model="formData.user_name" :disabled="!isNew" class="diji-input disabled:bg-gray-300">
                        </div>
                        <div class="group flex items-center" v-if="isNew">
                            <label for="password" class="text-sm mr-2">CRM Şifre</label>
                            <div class="relative">
                                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" autocomplete="password" class="diji-input">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button type="button" @click="showPassword=!showPassword">
                                        {{ showPassword ? "Gizle" : "Göster" }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full border-b mb-4">
                <div class="text-sm font-bold text-primaryDark">ÇALIŞAN KİŞİSEL BİLGİLER</div>
                <div class="grid gap-5 grid-cols-5 w-100 py-4">
                    <div class="group">
                        <label for="name" class="block mb-1 text-sm w-100">Ad&Soyad</label>
                        <input type="text" id="name" v-model="formData.name" class="diji-input">
                    </div>
                    <div class="group">
                        <label for="tc_identity" class="block mb-1 text-sm w-100">T.C. Kimlik Numarası</label>
                        <input type="text" id="tc_identity" v-model="formData.tc_identity" v-mask="'###########'" :placeholder="'###########'" class="diji-input">
                    </div>
                    <div class="group">
                        <label for="phone" class="block mb-1 text-sm w-100">Cep Telefonu</label>
                        <input type="text" id="phone" v-model="formData.phone" v-mask="'+90(###)-###-##-##'" :placeholder="'+90(###)-###-##-##'" class="diji-input">
                    </div>
                    <div class="group">
                        
                        <label for="dg" class="block mb-1 text-sm w-100">Doğum Tarihi</label>
                        
                        <DatePicker
                        v-model="formData.birthday"
                        :format="formatOptions"
                        class="diji-input" ></DatePicker>

                    </div>
                    <div class="group">
                        <label for="marital_status" class="block mb-1 text-sm w-100">Medeni Hali {{ formData.marital_status }}</label>
                        <select id="marital_status" class="diji-input" v-model="formData.marital_status">
                            <option value="0">Medeni Hali Seçiniz</option>
                            <option value="1">Evli</option>
                            <option value="2">Bekar</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="graduation" class="block mb-1 text-sm w-100">Mezuniyet</label>
                        <select id="graduation" class="diji-input" v-model="formData.graduation">
                            <option value="0">Mezuniyet Durumu Seçiniz</option>
                            <option :value="item.id" v-for="item in $globalVeriable.mezuniyetList" :key="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="home_phone" class="block mb-1 text-sm w-100">Ev Telefonu</label>
                        <input type="text" id="home_phone" v-mask="'0(###)-###-##-##'" :placeholder="'0(###)-###-##-##'" class="diji-input" v-model="formData.home_phone">
                    </div>
                    <div class="group">
                        <label for="te" class="block mb-1 text-sm w-100">Kan Grubu</label>
                        <select id="te" class="diji-input" v-model="formData.blood_group">
                            <option value="0">Kan Grubu Seçiniz</option>
                            <option :value="item.id" v-for="item in $globalVeriable.kanList" :key="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="mail" class="block mb-1 text-sm w-100">Mail Adresi</label>
                        <input type="text" id="mail" class="diji-input" v-model="formData.mail">
                    </div>
                </div>
            </div>
            <div class="w-full border-b mb-4">
                <div class="text-sm font-bold text-primaryDark">YAKINI BİLGİSİ</div>
                <div class="grid gap-5 grid-cols-5 w-100 py-4">
                    
                    <div class="group">
                        <label for="near_name" class="block mb-1 text-sm w-100">Yakının İsmi</label>
                        <input type="text" id="near_name" class="diji-input" v-model="formData.near_name">
                    </div>
                    <div class="group">
                        <label for="near_degree" class="block mb-1 text-sm w-100">Yakınlık Derecesi</label>
                        <input type="text" id="near_degree" class="diji-input" v-model="formData.near_degree">
                    </div>
                    <div class="group">
                        <label for="near_phone" class="block mb-1 text-sm w-100">Yakının Telefonu</label>
                        <input type="text" id="near_phone" v-mask="'+90(###)-###-##-##'" :placeholder="'+90(###)-###-##-##'" class="diji-input" v-model="formData.near_phone">
                    </div>
                </div>
            </div>
            <div class="w-full border-b mb-4">
                <div class="text-sm font-bold text-primaryDark">DİĞER BİLGİLER</div>
                <div class="grid gap-5 grid-cols-5 w-100 py-4">
                    <div class="group">
                        <label for="bank_name" class="block mb-1 text-sm w-100">Banka Bilgisi</label>
                        
                        <select id="bank_name" class="diji-input" v-model="formData.bank_name">
                            <option value="">Banka Bilgisi</option>
                            <option :value="item.id" v-for="item in $globalVeriable.bankaList" :key="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="tc" class="block mb-1 text-sm w-100">IBAN Bilgisi </label>
                        <input type="text" id="tc" v-model="formData.bank_iban" v-mask="'TR## #### #### #### #### #### ##'" placeholder="TR## #### #### #### #### #### ##"  class="diji-input">
                    </div>
                    <div class="group">
                        <label for="date_of_start" class="block mb-1 text-sm w-100">İşe Başlama Tarihi</label>
                        <DatePicker
                        v-model="formData.date_of_start"
                        :format="formatOptions"
                        class="diji-input" ></DatePicker>
                    </div>
                    <div class="group">
                        <label for="date_of_end" class="block mb-1 text-sm w-100">İşten Ayrılma Tarihi</label>
                        <DatePicker
                        v-model="formData.date_of_end"
                        :format="formatOptions"
                        class="diji-input" ></DatePicker>
                    </div>
                    <div class="group">
                        <label for="a" class="block mb-1 text-sm w-100">İşten Ayrılış Nedeni</label>
                        <select id="a" class="diji-input" v-model="formData.reason_leaving">
                            <option value="0">Ayrılış Nedenini Seçiniz</option>
                            <option :value="item.id" v-for="item in $globalVeriable.ayrilmaList" :key="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="date_of_start_2" class="block mb-1 text-sm w-100">2. İşe Giriş Tarihi</label>
                        <DatePicker
                        v-model="formData.date_of_start_2"
                        :format="formatOptions"
                        class="diji-input" ></DatePicker>
                    </div>
                    <div class="group">
                        <label for="departman_id" class="block mb-1 text-sm w-100">Departman</label>
                        <select id="departman_id" class="diji-input" v-model="formData.departman_id">
                            <option value="0">Departman Seçiniz</option>
                            <option :value="item.id" v-for="item in departmansList" :key="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="food_card" class="block mb-1 text-sm w-100">Yemek Kartı Firması</label>
                        <select id="food_card" class="diji-input" v-model="formData.food_card">
                            <option value="0">Yemek Kartı Seçiniz</option>
                            <option :value="item.id" v-for="item in $globalVeriable.yemekList" :key="item.id">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="food_card_number" class="block mb-1 text-sm w-100">Yemek Kartı Numarası</label>
                        <input type="text" id="food_card_number" v-model="formData.food_card_number" class="diji-input">
                    </div>
                    <div class="group">
                        <label for="day_off" class="block mb-1 text-sm w-100">İzin Hak Ediş</label>
                        <input type="text" id="day_off" v-model="formData.day_off" class="diji-input">
                    </div>
                </div>
            </div>
            <div class="w-full border-b mb-4">
                <div class="text-sm font-bold text-primaryDark">ÇALIŞAN FİNANSAL BİLGİLER</div>
                <div class="grid gap-5 grid-cols-5 w-100 py-4 items-end">
                    <div class="group" v-for="(maas, index) in maaslar" :key="index">
                        <label :for="'maas'+index" class="mb-1 text-sm w-100 flex justify-between">{{ formatDate(maas.tarih) }} <button type="button" @click="removeMaas(index)">Kaldır</button></label>
                        <input type="text" v-model="maas.maas" :id="'maas'+index" class="diji-input" @blur="handleSubmit">
                    </div>
                    <div @click="addMaas" class="rounded-full w-6 h-6 bg-blue-400 text-center text-xl font-medium cursor-pointer flex items-center justify-center text-white">+</div>
                </div>
            </div>
            <div class="w-full border-b mb-4">
                <div class="text-sm font-bold text-primaryDark">ADRES BİLGİLERİ</div>
                <div class="grid gap-5 grid-cols-5 w-100 py-4">
                    <div class="group">
                        <label for="city" class="block mb-1 text-sm w-100">İl</label>
                        <select id="city" class="diji-input" v-model="formData.city">
                            <option value="0">İl Seçiniz</option>
                            <option :value="il.value" v-for="il in ilList" :key="il.value">{{ il.text }}</option>
                        </select>
                    </div>
                    <div class="group">
                        <label for="district" class="block mb-1 text-sm w-100">İlçe </label>
                        <select id="district" class="diji-input" v-model="formData.district" v-if="formData.city!=0">
                            <option value="0">İlçe Seçiniz </option>
                            <option :value="district.value" v-for="district in ilList.find(item => item.value === formData.city).districts" :key="district.value">{{ district.text }}</option>
                        </select>
                        <input type="text" v-else disabled placeholder="Öncelikle İl Seçiniz" class="diji-input">
                    </div>
                    <div class="group">
                        <label for="home_address" class="block mb-1 text-sm w-100">Adres Bilgisi</label>
                        <input type="text" id="home_address" v-model="formData.home_address" class="diji-input">
                    </div>
                </div>
            </div>
            <div class="w-full border-b mb-4 pb-4"> 
                <div class="text-sm font-bold text-primaryDark flex gap-2 items-center">
                    KAYITLI DEMİRBAŞLAR 
                    <button type="button" @click="addFixture" class="rounded-md p-1 text-sm bg-blue-400 text-center font-medium cursor-pointer flex items-center justify-center text-white" :disabled="isNew">YENİ EKLE</button>
                </div> 
                <div v-if="isNew" class="text-red-600">
                    Demirbaş eklemeden önce kayıt işlemini sağlamanız gerekmektedir.
                </div>
                <div v-else class="grid gap-5 grid-cols-5 w-100 py-4 items-end" v-for="(fixture, index) in fixtures" :key="index">
                    <div class="group">
                        <label :for="'fix_name'+index" class="block mb-1 text-sm w-100">Ürün adı</label>
                        <input type="text" v-model="fixture.name" :id="'fix_name'+index" class="diji-input">
                    </div>
                    <div class="group">
                        <label :for="'fix_model'+index" class="block mb-1 text-sm w-100">Ürün Modeli</label>
                        <input type="text" v-model="fixture.model" :id="'fix_model'+index" class="diji-input">
                    </div>
                    <div class="group">
                        <label :for="'fix_seri_no'+index" class="block mb-1 text-sm w-100">Ürün Seri No</label>
                        <input type="text" v-model="fixture.seri_no" :id="'fix_seri_no'+index" class="diji-input">
                    </div>
                    <div class="group">
                        <label :for="'fix_price'+index" class="block mb-1 text-sm w-100">Ürün Fiyatı</label>
                        <input type="text" v-model="fixture.buy_price" :id="'fix_price'+index" class="diji-input">
                    </div>
                    <div class="group flex gap-2" v-if="fixture.hasOwnProperty('id')">
                        <button type="button" class="bg-green-400 diji-btn btn-sm" @click="saveFixture(index,fixture)" >Güncelle</button>
                        <button type="button" class="bg-red-500 diji-btn btn-sm" @click="removeFixture(index,fixture)">Sil</button>
                    </div>
                    <div class="group flex gap-2" v-else>
                        <button type="button" class="bg-green-400 diji-btn btn-sm" @click="saveFixture(index,fixture)">Kaydet</button>
                        <button type="button" class="bg-red-500 diji-btn btn-sm" @click="removeFixture(index)" >Vazgeç</button>
                    </div>
                </div>
            </div>
            <div class="w-full flex gap-2 justify-end">
                <button type="button" class="diji-btn btn-sm bg-red-500" @click="handleCancel">İptal</button>
                <button type="submit" class="diji-btn btn-sm bg-green-400">Kaydet</button>
            </div>
        </form>
        <input v-model="datetest" :format="testra">
    </div>
    
</template>

<script>
import { mapActions } from 'vuex';
import { iller } from '@/utils/iller';
export default {
  name: 'UsersForm',
  props: ['user','isNew'],
  data() {
    return {
      formData: this.user,
      showPassword:false,
      originalData: JSON.parse(JSON.stringify(this.user)),
      departmansList:[],
      maaslar: [
        { maas: 0, tarih: new Date() },
      ],
      fixtures: [],
      required:['name','mail','departman_id','phone','tc_identity','user_name','password'],
      ilList:iller,
      datetest:new Date()
    };
  },
  methods: {
    
        ...mapActions(['setNotify']),

        async handleSubmit(event) {
            if (event) {
                event.preventDefault();
            }

        if(this.isNew){ // Yeni Kayıt çalışan için...
            this.errorField('clear') // Hata inputları temizlenecek
            const response = await this.$http.post(`${this.$apiUrl.users}`,this.formData);
            if(response.data.success){
                this.formData = response.data.data
                this.editData()
                this.originalData= JSON.parse(JSON.stringify(this.formData));
                this.setNotify({
                'desc': response.data.message.text,
                'class': 'success'
                });
                await this.$router.push({ path: '/users/' + this.formData.id });
                location.reload();
            }else{
                if(response.data.message.errorField){
                    this.errorField(response.data.message.errorField) // ./func.js 'de yer alıyor
                }
                this.formData = this.user
                this.setNotify({
                'desc': response.data.message.text,
                'class': 'danger'
                });
            }
        }else{ //Düzenleme penceresi için
            this.formData.salaries=JSON.stringify(this.maaslar)
            const changedData = this.getChangedData(this.originalData, this.formData);
            if (Object.keys(changedData).length === 0) { //Eğer değişiklik yapılmdayısa
                this.setNotify({
                    'desc': 'Herhangi bir değişiklik yapılmadı.',
                    'class': 'warning'
                });
            }else{
                this.errorField('clear') // Hata inputları temizlenecek
                const response = await this.$http.put(`${this.$apiUrl.users}/${this.originalData.id}`,changedData);
                if(response.data.success){
                    this.originalData= JSON.parse(JSON.stringify(this.formData));
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'success'
                    });
                }else{
                    if(response.data.message.errorField){
                        this.errorField(response.data.message.errorField) // ./func.js 'de yer alıyor
                    }
                    this.formData = this.user
                    this.setNotify({
                    'desc': response.data.message.text,
                    'class': 'danger'
                    });
                }
            }
        }
        },
        addMaas() {
        this.maaslar.push({ maas: 0, tarih: new Date()});
        },
        removeMaas(index) {
            this.$swal({
                title: 'Emin misiniz?',
                text: 'Maaşı silmek istediğinizden emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet, sil',
                cancelButtonText: 'İptal',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.maaslar.splice(index, 1);
                    this.handleSubmit();
                }
            });
        },
        addFixture() {
        this.fixtures.push(
                { name: "", model: "" , seri_no: "", buy_price: ""}
            );
        },
        async removeFixture(index,fixture) {
            if(fixture){
                this.$swal({
                    title: 'Emin misiniz?',
                    text: 'Demirbaşı silmek istediğinizden emin misiniz?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Evet, sil',
                    cancelButtonText: 'İptal',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await this.$http.delete(`${this.$apiUrl.fixtures}/${fixture.id}`);
                        if(response.data.success){
                            this.fixtures.splice(index, 1);
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
                
            }else{
                this.fixtures.splice(index, 1);
            }
        },
        async saveFixture(index,fixture){
            console.log("fixture")
            console.log(fixture)
            let response=[];
            if(Object.prototype.hasOwnProperty.call(fixture, 'id')){
                response = await this.$http.put(`${this.$apiUrl.fixtures}/${fixture.id}`, fixture);
            }else{
                fixture={...fixture,'user_id':this.formData.id}
                response = await this.$http.post(`${this.$apiUrl.fixtures}`, fixture);
            }
            if(response.data.success){
                this.fixtures[index]=response.data.data
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
        handleCancel() {
            this.resetForm();
            this.$router.go(-1);
        },
        resetForm() {
            // Form alanlarını sıfırlama işlemi burada
            this.formData = this.user
        },
        getChangedData(original, modified) {
            const changedData = {};

            for (const key in original) {
                if ((original[key] !== modified[key] && key != 'fixtures') || this.required.indexOf(key)<0 == false) {
                    changedData[key] = modified[key];
                }
            }

            return changedData;
        },
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
        editData(){
            if(this.formData.salaries){ 
                const jsonString = this.formData.salaries;
                this.maaslar = JSON.parse(jsonString);
            }
            if(this.formData.fixtures){ 
                this.fixtures = this.formData.fixtures
            }
            if(this.formData.birthday){
                this.formData.birthday = new Date(this.formData.birthday); 
            }

            if(this.formData.date_of_start){
                this.formData.date_of_start = new Date(this.formData.date_of_start); 
            }

            if(this.formData.date_of_start_2){
                this.formData.date_of_start_2 = new Date(this.formData.date_of_start_2); 
            }

            if(this.formData.date_of_end){
                this.formData.date_of_end = new Date(this.formData.date_of_end); 
            }
        }
    },
    created(){
        this.getDepartmans();
        if(!this.isNew){ //Eğer düzenleme ekranıysa sutün ayarları
            this.editData();
        }else{
            const today = new Date();
            const twentyYearsAgo = new Date(today);
            twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20, 0, 1);

            this.formData.birthday = new Date(twentyYearsAgo); 
            this.formData.date_of_start = new Date(); 
            this.formData.date_of_end = new Date(); 
            this.formData.date_of_start_2 = new Date(); 
        }
    },
    computed: {
        testra() {
            return "DD-MM-YYYY";
        },
    },
};
</script>

<style>

</style>