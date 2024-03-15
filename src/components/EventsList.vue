
<template>
    <div>
      <div class="flex justify-between w-full font-semibold py-3">
        <button @click="changeYear(-1)"> Önceki Yıl</button>
        <span>{{ selectedYear }}</span>
        <button @click="changeYear(1)">Sonraki Yıl </button>
      </div>
      <table class="table-auto w-full border-separate border-spacing-2 border border-slate-400	">
        <thead>
        <tr>
          <th>Çalışan Adı</th>
          <th v-for="month in months" :key="month">{{ month }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='event in events' :key='event.id'>
            <td>{{ event.id }}</td>
            <td>{{ event.title }}</td>
            <td>{{ event.startStr }}</td> 
            <td>{{ event.endStr }}</td>
          </tr>
      </tbody>
    </table>
    </div>
  </template>
  <script>
  //Takvim ile ilgili
  
  import { mapActions } from 'vuex';
  
  export default {
    components: {
    },
    data() {
      return {
        selectedYear: new Date().getFullYear(),
        months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        events:[],
        userId:null
      }
    },
    methods: {
      
      ...mapActions(['setNotify']),
      
      changeYear(offset) {
        this.selectedYear += offset;
      },
      async fetchEventsForDateRange() {
        try {
          const response = await this.$http.get(`calendar?type=1&type=2`);
          this.events = response.data.data;
        } catch (error) {
          console.error('Etkinlikleri çekerken bir hata oluştu:', error);
        }
      },
    },
    watch:{
      
    },
    mounted(){
      this.fetchEventsForDateRange();
    },
    computed:{
      
    }
  }
  </script>