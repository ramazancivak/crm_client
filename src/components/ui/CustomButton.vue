<template>
    <button :type="type ? type : 'button'" class="diji-btn" 
            :class="[bg ? bg : 'bg-bgPrimary', size ? size : 'btn-md']">
        <i class="fas mr-2" :class="icon" v-if="icon"></i><slot></slot>
    </button>
</template>
<script>
   export default {
    props:['bg','size','type','icon'],
    name:'CustomButton',
    data(){
        return{

        }
    }
   }
</script>