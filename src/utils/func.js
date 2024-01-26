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
  
    eventTitle(event){
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
          }
      }else if(event.type==3){
          title += this.$globalVeriable.eventType[event.type-1].name
      }

      if(event.leave_type==0 && event.type!=3){
          title += ` ${event.number_of_days} Gün`
      }
      return title
    },
    beforeDay(date){
      var time = new Date(date)
      return time.setDate(time.getDate() - 1)
    },
    getTypeIcon(type,leave_type){
      if(leave_type>0){
        return this.$globalVeriable.eventTypeList.find(item=>item.leave_type==leave_type).icon
      }else{
        return this.$globalVeriable.eventTypeList.find(item=>item.type==type && item.leave_type==leave_type).icon
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