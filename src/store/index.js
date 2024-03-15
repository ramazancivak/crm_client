import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import apiInstance from '../axios'
import router from '@/router';

export default createStore({
  plugins: [createPersistedState()],
  state: {
    authToken: null,
    isAuthenticated: false,
    userInfo:null,
    notifyList:[],
    users:[],
    fixtures:[],
    cacheDepartman:{},
    settings:[]
  },
  mutations: {
    async SET_LOGIN(state,{token,user}) {
      state.authToken = token;
      state.isAuthenticated = true;
      state.userInfo = user;
      try {
        const response = await apiInstance.get('settings');
        state.settings = response.data.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    SET_USER_INFO(state, newUserInfo) {
      state.userInfo = newUserInfo;
    },
    SET_LOGOUT(state){
      Object.assign(state, getDefaultState());
    },
    SET_NOTIFY(state,notify){
      state.notifyList.push(notify)
    },
    CLEAR_NOTIFY_LIST(state) {
      state.notifyList=[]
    },
    REMOVE_NOTIFY(state, notify) {
      // Bildirimi listeden kaldırma işlemi
      const index = state.notifyList.indexOf(notify);
      if (index !== -1) {
        state.notifyList.splice(index, 1);
      }
    },
    SET_USERS(state, data) {
      state.users = data;
    },
    SET_FIXTURES(state, data) {
      state.fixtures = data;
    },
    SET_CACHE_DEPARTMAN(state, job=undefined){
      if(job==undefined){
        state.cacheDepartman={} //departman sayfasında obje tamamen temizleniyor.
      }else if(job.name!=undefined){
        state.cacheDepartman[job.id] = {} //departman id ile boş obje oluşturuldu
      }else{
        state.cacheDepartman[job.departman_id][job.id]= job.data //departman altına iş tanım id si ile data cachelenecek
      }
    },
    SET_LOGIN_STATUS(state, data) {
      state.isLoggedIn = data.success;
    },
    SET_SETTINGS(state, data) {
      const index = state.settings.findIndex(item => item.id === data.id);
      if (index !== -1) {
        // Eğer bulunduysa, güncelle
        state.settings[index] = data;
      } else {
        // Bulunamadıysa, yeni öğe olarak ekle
        state.settings.push(data);
      }
    }
  },
  actions: {
    setLogin({ commit }, {token, user}) { 
      commit('SET_LOGIN', {token, user});
    },
    async setLogout({ commit }, tokenNull = null) { 
      if(tokenNull!=null){   
        await apiInstance.post(`auth/logout`)
        .then(response => {
          if (response.data.success === true) {
            commit('SET_LOGOUT');
            console.log('Çıkış işlemi başarılı.');
          } else {
            console.log('Çıkış işlemi sırasında hata oluştu.');
          }
        })
        .catch(error => {
          console.error(error);
        });
      }else{
        commit('SET_LOGOUT');
      }
      router.push('/login');
    },
    setNotify({ commit },notify) { 
      commit('SET_NOTIFY',notify);
      
      setTimeout(() => {
        commit('REMOVE_NOTIFY', notify); 
      }, 4000); 
    },

    async getSetting(_,id) { //commit yerine _ yazılıyor
      try {
        const response = await apiInstance.get(`settings/${id}`);
        return response.data.data[0];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateSetting({ commit },data) {
      await apiInstance.put(`settings/${data.id}`,data)
      .then(response => {
        let settings = response.data.data;
        commit('SET_SETTINGS', settings);
      })
      .catch(error => {
        console.error(error);
      });
    },
    

    async fetchUsers({ commit }, { filter = '', columns = '' }) {
      const filterParam = filter !== '' ? `?${filter}` : '';
      const columnsParam = columns !== '' ? `?columns=${columns}` : '';
        
      await apiInstance.get(`user/users${filterParam}${columnsParam}`)
        .then(response => {
          let users = response.data.data;
          commit('SET_USERS', users);
        })
        .catch(error => {
          console.error(error);
        });
    },
    

    async fetchFixtures({ commit }, filter='') {
      if(filter!=''){
        filter='?'+filter
      }
      await apiInstance.get(`user/fixtures${filter}`)
      .then(response => {
        let fixtures = response.data.data;
        commit('SET_FIXTURES', fixtures);
      })
      .catch(error => {
        console.error(error);
      });
    },
    
    async setCacheDepartman({ commit }, job) {
      commit('SET_CACHE_DEPARTMAN', job);
    },

    async checkLoginStatus({ commit }) {
      try {
        const response = await apiInstance.post('auth/isLogin');
        commit('SET_LOGIN_STATUS', response.data); 
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  getters: {
    isLogin: state => {
      return state.isLoggedIn;
    },
    userId:state => {
      return state.userInfo.id
    },
    userInfo:state => {
      return state.userInfo
    },
    authority:state => {
      return state.userInfo.authority
    }
  },
});

function getDefaultState() {
  return {
    authToken: null,
    isAuthenticated: false,
    userInfo:null,
    notifyList:[],
    users:[],
    settings:[]
  };
}
