<template>
    <div>
        
        <button @click="authorize">Google'a Giriş Yap</button>
        <button @click="fetchGoogleCalendarEvents">Etkinlikleri Getir</button>
        <div v-if="calendarEvents.length">
        <h2>Etkinlikler</h2>
        <ul>
            <li v-for="event in calendarEvents" :key="event.id">
            {{ event.summary }}
            </li>
        </ul>
        </div>
    </div>
</template>
<script>
export default {
        data(){
            return{
                calendarEvents:[],
                accessToken: null,
                clientId: '823363524692-v2qhm9vsuiuq1pa2r4faphc1pnsouq6j.apps.googleusercontent.com', // Google Cloud Platform'dan aldığınız istemci kimliği
                redirectUri: 'http://localhost:8080/inbox' // Yetkilendirme tamamlandıktan sonra yönlendirilecek URI
            }
        },
        methods:{
            
            authorize() {
                const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=https://www.googleapis.com/auth/calendar.events.readonly&access_type=offline`;
               
                window.location.href = authUrl;
            },
            fetchAccessToken(code) {
                const tokenUrl = 'https://oauth2.googleapis.com/token';
                const requestBody = new URLSearchParams({
                    code,
                    client_id: this.clientId,
                    client_secret: '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', // Google Cloud Platform'dan aldığınız istemci sırrı
                    redirect_uri: this.redirectUri,
                    grant_type: 'authorization_code'
                });

                fetch(tokenUrl, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: requestBody
                })
                .then(response => response.json())
                .then(data => {
                    this.accessToken = data.access_token;
                })
                .catch(error => {
                    console.error('Access token fetch error:', error);
                });
            },
            fetchGoogleCalendarEvents() {
            if (!this.accessToken) {
                console.error('Access token is not available.');
                return;
            }

            const calendarApiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

            fetch(calendarApiUrl, {
                headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                this.calendarEvents = data.items;
            })
            .catch(error => {
                console.error('Error fetching Google Calendar events:', error);
            });
            }
        },
        
        mounted(){
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
            this.fetchAccessToken(code);
            }
        },  
    }
</script>