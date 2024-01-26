<template>
  <div>
    <div>
      <h2 class="text-xl font-medium mb-4">Değer Listesi</h2>
      <LoadingBtn v-if="loading"></LoadingBtn>
      <ul class="border-b">
        <li v-for="(item, index) in values" class="p-2 border border-b-0" :key="index">
          <span class="font-bold pr-2">{{ formatDate(item.date) }}:</span> {{ item.val }} TL
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <CustomButton @click="addNewValue" bg="bg-blue-500">
        Yeni Ekle
      </CustomButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex' 
import LoadingBtn from "@/components/ui/LoadingBtn.vue";
import CustomButton from "@/components/ui/CustomButton.vue";
export default {
    name:'FoodPrice',
    components: {
        LoadingBtn,
        CustomButton
    },
    data(){
      return {
        newDate: new Date(),
        setting:[],
        values:[],
        loading:true
      }
    },
    methods:{
      ...mapActions(['getSetting','setNotify']),
      addNewValue() {
          this.$swal.fire({
              title: this.formatDate(this.newDate),
              input: 'text', // Input türünü belirtin
              inputLabel:'Yemek Ücreti',
              inputValue:'',
              showCancelButton: true,
              confirmButtonText: 'Kaydet',
              cancelButtonText: 'İptal',
              inputValidator: (value) => {
              if (!value) {
                  return 'Boş olamaz';
              }
              },
          }).then((result) => {
              if (result.isConfirmed) {
                this.values.push({date: this.newDate, val: result.value })
                this.setting.value = JSON.stringify(this.values);
                try {
                  this.$store.dispatch('updateSetting', this.setting)
                  .then(() => {
                      this.setNotify({
                          'desc':'Başarılı',
                          'class':'success'
                      })
                  })
                  .catch((error) => {
                      this.setNotify({
                          'desc':'Ayar güncellenirken bir hata oluştu:', error,
                          'class':'success'
                      })
                  });                } catch (error) {
                  console.log("veri güncellemede hata")
                }
              }
          });
      },
    },
    mounted() {
      this.getSetting(1).then(response => {
        this.setting = response;
        this.values = JSON.parse(this.setting.value)
        this.loading=false
      }).catch(error => {
        console.error('Error fetching setting:', error);
      });
    }
}
</script>
