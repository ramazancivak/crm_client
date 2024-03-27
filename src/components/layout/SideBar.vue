<template>
    
    <aside id="sidebar-multi-level-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r-blue-300 border-r" aria-label="Sidebar">
        <div class="w-full p-3 flex justify-between items-center">
            <router-link to="/" class="flex gap-4 items-center">
                <img src="@/assets/logo.png" width="40" height="40">
                <div class="font-medium">
                    {{ $store.state.userInfo.authority == 0 ? "ADMİN" : "ÇALIŞAN" }}
                </div>
            </router-link>
            
            <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" @click="changeRole">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
        </div>
        <div class="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
            <li v-for="item in menu" :key="item">
                <router-link :to="item.link" class="flex items-center p-2 rounded-lg group hover:bg-slate-600 hover:text-white"
                    :class="{ 'bg-slate-600 text-white': item.type ? $route.query.type === item.type : $route.path === item.link }"
                     @click="menuShow(item)">
                    <span class="flex-1 whitespace-nowrap flex items-center"><i class="fas mr-1 w-[25px] justify-center flex" :class="item.icon"></i>{{item.title}}</span>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" v-if="item.children">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </router-link>
                <!-- Alt Menü Gösterimi -->
                <ul id="dropdown-example" class="py-2 space-y-2" v-show="item.show" v-if="item.children">
                    <li v-for="child in item.children" :key="child">
                        <router-link :to="child.link" class=" w-full p-2 transition duration-75 rounded-lg pl-6 group flex items-center hover:bg-slate-600 hover:text-white"
                            :class="{ 'bg-slate-600 text-white': $route.href === child.link }">
                            <i class="fas mr-1 w-[25px] flex justify-center" :class="child.icon" v-if="child.icon"></i> {{child.title}} 
                        </router-link>
                    </li>
                </ul>
            </li>
            <li>
                <router-link to="/logout" class="flex items-center p-2 rounded-lg group hover:bg-slate-600 hover:text-white">
                    <span class="flex-1 whitespace-nowrap flex items-center"><i class="fas mr-1 fa-right-from-bracket w-[25px] justify-center flex" ></i> Çıkış Yap</span>
                </router-link>
            </li>

        </ul>
        </div>
    </aside>
 
</template>

<script>

export default {
  name: 'SideBar',
  computed:{
  },
  data(){
    return{
        menu:[]
    }
  },
  methods:{
    menuShow(item){
        if (item.children && !item.children.length) {
            this.fetchCustomersList().then(customers => {
                item.children = customers;
                item.show = !item.show;
            });
        } else {
            item.show = !item.show;
        }
    },
    async changeRole(){
       const userId = this.$store.state.userInfo.id;
       let user = []
        const res = await this.$http.get(`${this.$apiUrl.users}/${userId}`);
        if(res.data.success){
            user = res.data.data; 
        }
        const newRole = {
            ...user,
            authority: user.authority == 0 ? 1 : 0
        }
        const response = await this.$http.put(`${this.$apiUrl.users}/${user.id}`, newRole);
        if(response.data.success){
            this.$store.commit('SET_USER_INFO', response.data.data);
            window.location.reload();
        }else{
            alert("yetki güncellemede hata")
        }
    },
    async fetchCustomersList() {
        try {
            const response = await this.$http.get(`customer/customers?columns=company_name,id`);
            if (response.data.success) {
                return response.data.data.map(element => ({
                    title: element.company_name,
                    link: '/customers/' + element.id
                }));
            }
        } catch (error) {
            console.error("An error occurred while fetching customers:", error);
            return [];
        }
    },
  },
  created(){
    const authority = this.$store.state.userInfo.authority

    if(authority==0){
        this.menu.push(
            {
                title:'Anasayfa',
                link:'/',
                icon:'fa-home'
            },
            {
                title:'InBox',
                link:'/inbox',
                icon:'fa-envelope'
            },
            {
                title:'Çalışanlar',
                link:'',
                icon:'fa-user',
                children:[
                    {
                        title:'Çalışan Listesi',
                        link:'/users',
                        icon:'fa-users'
                    },
                    {
                        title:'İzinler',
                        link:'/events',
                        icon:'fa-calendar-days'
                    },
                    {
                        title:'Multinet',
                        link:'/multinet',
                        icon:'fa-money-bill-wheat'
                    },
                    {
                        title:'Avanslar',
                        link:'/payments?type=1',
                        icon:'fa-sack-dollar'
                    },
                    {
                        title:'Kesintiler',
                        link:'/payments?type=2',
                        icon:'fa-hand-holding-dollar'
                    },
                ]
            },
            {
                title:'Müşteriler',
                link:'',
                icon:'fa-users',
                children:[]
            },
            {
                title:'Takvim',
                link:'/calendar',
                icon:'fa-calendar-days'
            },
            {
                title:'Demirbaşlar',
                link:'/fixtures',
                icon:'fa-hands-praying'
            },
            {
                title:'Departmanlar',
                link:'/departmans',
                icon:'fa-d'
            },
            {
                title:'Ayarlar',
                link:'/settings',
                icon:'fa-gear'
            },
        )
    }else if(authority==1){
        this.menu.push(
            {
                title:'Anasayfa',
                link:'/',
                icon:'fa-home'
            },
            {
                title:'Bilgilerim',
                link:'/profile',
                icon:'fa-circle-info',
            },
            {
                title:'Kayıtlı Demirbaşlarım',
                link:'/my-fixtures',
                icon:'fa-d'
            },
            {
                title:'İzinlerim',
                link:'/my-events',
                icon:'fa-list'
            },
            {
                title:'Takvim',
                link:'/calendar',
                icon:'fa-calendar-days'
            },
            {
                title:'Multinet Detayları',
                link:'/my-multinet',
                icon:'fa-money-bill-wheat'
            },
            {
                title:'Avanslarım',
                link:'/my-payments',
                icon:'fa-sack-dollar'
            }
        )
    }
  }
}
</script>

<style>

</style>