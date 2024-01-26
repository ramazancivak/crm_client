<template>
  <div class="fixed top-3 right-3 z-10 w-[350px]">
    <div v-for="(notify, key) in notifyList" :key="key" :class="notify.class" class="min-h-[100px] mt-2 p-2 text-white">
      <div v-if="notify.title">{{ notify.title }}</div>
      <div v-if="notify.desc">{{ notify.desc }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props:['notifyList']
}
</script>

<style scoped>
  .danger{
    border-left: 8px solid rgb(179, 33, 33);
    background-color:#f5a01f
  }
  .success{
    border-left:8px solid #38b35d;
    background-color:#68CC86
  }
  .warning{
    border-left:8px solid #EF9234;
    background-color:#FEB648
  }
</style>