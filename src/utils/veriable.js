// global değişkenler burada yer alır.
import { reactive } from 'vue';

export const veriable = reactive({
    
    calismaTipi:[ //working_type alan adı
        {id:1,name:"Tam Zamanlı"},
        {id:2,name:"Proje Bazlı"},
        {id:3,name:"Freelance"},
        {id:4,name:"Danışman"}
    ],
    kanList:[ //blood_group alan adı
        {id:1,name:"AB Rh+"},
        {id:2,name:"AB Rh-"},
        {id:3,name:"A Rh+"},
        {id:4,name:"A Rh-"},
        {id:5,name:"B Rh+"},
        {id:6,name:"B Rh-"},
        {id:7,name:"O Rh+"},
        {id:8,name:"O Rh-"},
    ],
    mezuniyetList:[ //graduation alan adı
        {id:1,name:"Lise"},
        {id:2,name:"Üniversite (2 Yıllık)"},
        {id:3,name:"Üniversite (4 Yıllık)"}
    ],
    bankaList:[ //bank_name alan adı
        {id:1,name:"İş Bankası"},
        {id:2,name:"Garanti BBVA"},
        {id:3,name:"Finans Bank"},
        {id:4,name:"Vakıf Bank"},
    ],
    ayrilmaList:[ //reason_leaving alan adı
        {id:1,name:"Ücret Yetersizli"},
        {id:2,name:"Şehir Değişimi"}
    ],
    yemekList:[ //food_card alan adı
        {id:1,name:"Mültinet"},
        {id:2,name:"Sodexo"},
        {id:3,name:"SedCart"}
    ],
    eventType:[ // Takvim tip'leri
        {id:1,name:"İzin"},
        {id:2,name:"Raporlu"},
        {id:3,name:"Uçak Modu"}
    ],
    eventTypeList:[
        {
            type:1,
            leave_type:0,
            name:"TAM GÜN",
            total:0,
            icon:'fa-sun'
        },
        {
            type:1,
            leave_type:1,
            name:"YARIM GÜN",
            icon:'fa-circle-half-stroke'
        },
        {
            type:1,
            leave_type:2,
            name:"SAATLİK",
            icon:'fa-clock'
        },
        {
            type:2,
            leave_type:0,
            name:"RAPORLU",
            icon:'fa-bed'
        },
        {
            type:3,
            leave_type:0,
            name:"UÇAK MODU",
            icon:'fa-plane'
        }
    ],
});