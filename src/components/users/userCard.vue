<template>
    <div> 
        <div class="w-full mb-2">
            <div class="text-sm font-bold text-primaryDark mb-3">ÖZLÜK BİLGİLERİM</div>
            <div class="grid gap-4 shadow-lg p-3 text-sm w-1/3">
                <div class="group flex justify-between">
                    <div class="font-medium">Çalışma Tipi</div>
                    {{ arrayFind($globalVeriable.calismaTipi,formData.working_type) }}
                </div>
                <div class="group flex justify-between">
                    <div class="font-medium">Departman</div>
                    {{ arrayFind(departmansList,formData.departman_id) }}
                </div> 
            </div>
        </div>
        <div class="grid gap-5 grid-cols-3 w-100 py-4">
            <div class="w-full mb-4">
                <div class="text-sm font-bold text-primaryDark mb-3">KİŞİSEL BİLGİLERİM</div>
                <div class="grid gap-4 shadow-lg p-3 text-sm">
                    <div class="group flex justify-between">
                        <div class="font-medium">Ad Soyad</div>
                        {{formData.name}}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Cep Telefonu</div>
                        {{formData.phone}}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Mail Adres</div>
                        {{formData.mail}}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Doğum Tarihi</div>
                        {{formatDate(formData.birthday)}}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Medeni Hali</div>
                        {{formData.marital_status == 1 ? "Evli" : "Bekar"}}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Mezuniyet</div>
                        {{ arrayFind($globalVeriable.mezuniyetList,formData.graduation) }}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Ev Telefonu</div>
                        {{formData.home_phone}}
                    </div>
                    
                    <div class="group flex justify-between">
                        <div class="font-medium">Kan Grubu</div>
                        {{ arrayFind($globalVeriable.kanList,formData.blood_group) }}
                    </div>
                </div>
            </div>
            <div class="w-full mb-4">
                <div class="text-sm font-bold text-primaryDark mb-3">YAKINIM</div>
                <div class="grid gap-4 shadow-lg p-3 text-sm">
                    <div class="group flex justify-between">
                        <div class="font-medium">Yakının İsmi</div>
                        <span v-if="formData.near_name">{{formData.near_name}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Yakınlık Derecesi</div>
                        <span v-if="formData.near_degree">{{formData.near_degree}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Yakının Telefonu</div>
                        <span v-if="formData.near_phone">{{formData.near_phone}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                </div>
                <div class="text-sm font-bold text-primaryDark mb-3 mt-8">ADRES BİLGİLERİ</div>
                <div class="grid gap-4 shadow-lg p-3 text-sm">
                    <div class="group flex justify-between">
                        <div class="font-medium">İl </div>
                        {{ arrayFind(ilList,formData.city,'text','value') }}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">İlçe {{ formData.districts }}</div>
                        <span v-if="formData.city!=0">
                            {{ arrayFind(ilList.find(item => item.value === formData.city).districts,formData.district,'text','value') }}
                        </span>                        
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Adres</div>
                        <span v-if="formData.home_address">{{formData.home_address}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                </div>
            </div>
            <div class="w-full mb-4">
                <div class="text-sm font-bold text-primaryDark mb-3">DİĞER BİLGİLER</div>
                <div class="grid gap-4 shadow-lg p-3 text-sm">
                    <div class="group flex justify-between">
                        <div class="font-medium">Banka</div>
                        {{ arrayFind($globalVeriable.bankaList,formData.bank_name) }}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">IBAN</div>
                        <span v-if="formData.bank_iban">{{formData.bank_iban}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">İşe Başlama Tarihi</div>
                        <span v-if="formData.date_of_start">{{formatDate(formData.date_of_start)}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">İşten Ayrılma Tarihi</div>
                        <span v-if="formData.date_of_end">{{formatDate(formData.date_of_end)}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">İşten Ayrılış Nedeni</div>
                        {{ arrayFind($globalVeriable.ayrilmaList,formData.reason_leaving) }}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">2. İşe Giriş Tarihi</div>
                        <span v-if="formData.date_of_start_2">{{formatDate(formData.date_of_start_2)}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">İzin Hak Ediş</div>
                        <span v-if="formData.day_off">{{formData.day_off}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Yemek Kartı Firması</div>
                        {{ arrayFind($globalVeriable.yemekList,formData.food_card) }}
                    </div>
                    <div class="group flex justify-between">
                        <div class="font-medium">Yemek Kartı Numarası</div>
                        <span v-if="formData.date_of_start_2">{{formData.food_card_number+' / '+formData.food_card_cvv}}</span>
                        <span v-else>Değer girilmemiş</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { mapActions } from 'vuex';
import { iller } from '@/utils/iller';
export default {
  name: 'userCard',
  props: ['user'],
  data() {
    return {
      formData: this.user,
      originalData: JSON.parse(JSON.stringify(this.user)),
      departmansList:[],
      maaslar: [
        { maas: 0, tarih: new Date() },
      ],
      fixtures: [],
      requiredd:['name','mail','departman_id','phone','tc_identity','user_name','password'],
      ilList:iller,
    };
  },
  methods: {
        
        ...mapActions(['setNotify']),

        getChangedData(original, modified) {
            const changedData = {};

            for (const key in original) {
                if ((original[key] !== modified[key] && key != 'fixtures') || this.requiredd.indexOf(key)<0 == false) {
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
        },
        arrayFind(array,value,key='name',val='id'){
            return array.some(item => item[val] === value) 
            ? array.find(item => item[val] === value)[key] 
            : 'Bilgi girişi yapılmamış'
        }
    },
    created(){
        this.getDepartmans();
        this.editData();
    },
    computed: {
    },
};
</script>

<style>

</style>