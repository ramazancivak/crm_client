<template>
    <div>
      <SideBar></SideBar>
      <div class="p-4 sm:ml-64">
        <HeaderFixed></HeaderFixed>
        <div class="bg-white shadow-md rounded-md p-4">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </template>
  <script>
  import SideBar from "../SideBar.vue";
  import HeaderFixed from "../HeaderFixed.vue";

  export default {
    name: 'executiveLayout',
    components:{
        SideBar,
        HeaderFixed
    },
    computed: {
    },
    created(){
    }
  }
  </script>