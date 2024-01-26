<template>
    <div>
      <div class="w-full flex items-center mb-2">
        <h1 class="py-3 w-full text-xl font-bold border-b text-primaryDark mb-2">ÇALIŞAN</h1>
      </div>

      <!-- Çalışan form alanaı -->
      <user-details v-if="user" :isNew="isNew" :user="user" />

      <!-- Çalışan demirbaş alanı -->
      
      <div v-if="!loading" class="text-sm font-bold text-primaryDark">KAYITLI DEMİRBAŞLAR</div>
      <t-table v-if="!loading" :head="tableHead" :body="tableBody" page="fixture" class="mt-4" />
      
    </div>
  </template>
  
  <script>
  import UsersForm from '@/components/users/UsersForm.vue';
  import UsersTable from '@/components/ui/CustomTable.vue'; 
  import { mapActions } from 'vuex';

  export default {
    components: {
      't-table':UsersTable,
      'user-details': UsersForm
    },
    data() {
      return {
        user: null,
        isNew:false,
        tableHead:[],
        tableBody:[],
        loading:true
      }
    },
    mounted() {
      this.getUser();
    },
    computed: {},
    methods: {
      ...mapActions(['setNotify']),
      
      setFixtureTable(){
        this.tableHead = [
            { label: 'KAYIT TARİHİ', type: 'date' },
            { label: 'ÜRÜN ADI' },
            { label: 'ÜRÜN MODELİ' },
            { label: 'ÜRÜN SERİ NUMARASI'},
        ];
        if(this.user.fixtures){
            this.tableBody=this.user.fixtures.map((item) => [item.delivery_date, item.name, item.model, item.seri_no])
        }
        this.loading=false;
      },
      async getUser() {
        const userId = this.$route.params.id;
        if (userId) {
          if(userId=='new'){
            this.isNew=true;
            this.user = { // Yeni ekleme için...
              working_type:1,
              city:0,
              district:0
            }
          }else{
            try {
              const response = await this.$http.get(`${this.$apiUrl.users}/${userId}`);
              if(response.data.success){
                this.user = response.data.data; // Düzenleme datası dolduruluyor...
                this.setFixtureTable();
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
          }
        }
      },
    },
  }
  </script>
  
  
  
  
  
  