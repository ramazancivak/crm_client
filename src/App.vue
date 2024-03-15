<template>
  <div class="bg-blue-100 min-h-screen h-full text-primary">
    <router-view></router-view>    
    <NotifyComponent :notifyList="notifyList" v-if="notifyList.length > 0"></NotifyComponent>
  </div>
  
</template>

<script>

import NotifyComponent from '@/components/layout/NotifyComponent.vue';
export default {
  name: 'App',
  components : {
    NotifyComponent
  },
  data () {
    return {
      
    }
  },
  methods:{
  },
  computed:{
    notifyList() {
      return this.$store.state.notifyList;
    },
  },
  created(){
  }
}
</script>

