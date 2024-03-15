export default {
  methods: {
    formatDate(val) {
      const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      const date = new Date(val);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    },   
  
    eventTitle(event,details){
      var title=''
      if(event.type==1){
          if(event.leave_type==1){
              if(event.half_type==0){
                  title += " Ö.Ö"
              }else{
                  title += " Ö.S"
              }
          }else if(event.leave_type==2){
              title += ` ${event.hours} Saat`
          }else if(event.leave_type==0){
            title += ` ${event.number_of_days} Gün` 
          }
      }else if(event.type==2){
        title += ` ${event.number_of_days} Gün` 
      }else if(event.type==3){
          title += this.$globalVeriable.eventType[event.type-1].name
      }

      if(event.type==0){
          title += ` ${event.title}` 
      }
      if(event.type!=0 && details && event.type!=3){
        title=title+' '+this.$globalVeriable.eventType[event.type-1].name
      }
      return title
    },
    beforeDay(date){
      var time = new Date(date)
      return time.setDate(time.getDate() - 1)
    },
    getType(type, leave_type, val) {
      if (leave_type > 0) {
          const leaveTypeItem = this.$globalVeriable.eventTypeList.find(item => item.leave_type === leave_type);
          return leaveTypeItem ? leaveTypeItem[val] : null;
      } else {
          const eventTypeItem = this.$globalVeriable.eventTypeList.find(item => item.type === type && item.leave_type === leave_type);
          return eventTypeItem ? eventTypeItem[val] : null;
      }
    },
    afterDay(date){
      var time = new Date(date)
      return time.setDate(time.getDate() + 1)
    },
    calculateDateDifference(startDate, endDate) {
      let timeDifference = endDate.getTime() - startDate.getTime();
  
      return {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      };
    },
    errorField(errorField){
      if(errorField=='clear'){
        const allLabels = document.querySelectorAll('label');
        allLabels.forEach(label => {
            label.style = '';
        });
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            input.style = '';
        });
      }else{
        errorField.forEach((item) => {
            const inputElement = document.getElementById(item);
            const labelElement = document.querySelector(`label[for="${item}"]`);
            if (inputElement) {
                inputElement.style.border = '1px solid red';
                const closestForm = inputElement.closest('form'); // En yakın form
                window.scrollTo({top: closestForm.offsetTop, behavior: 'smooth'});
            }
            if (labelElement) {
                labelElement.style.color = 'red';
            }
        });
      }
    },
    
    dateDiff(start,end,type){
        let dayCount = 0;
        let currentDate = new Date(start);

        while (currentDate < new Date(end)) {
          const dayOfWeek = currentDate.getDay();

          // Hafta sonu (Cumartesi veya Pazar) değilse tarih aralığına ekle
          if ((dayOfWeek !== 0 && dayOfWeek !== 6) || type==2) {
            dayCount++
          }

          // Bir gün ekleyerek devam et
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dayCount;
    },
  },
  
  computed:{
    formatOptions() {
        return 'DD-MM-YYYY';
    },
  }
};