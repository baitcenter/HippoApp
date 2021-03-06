<template>
  <f7-page page-content @page:init="refreshVenuesStatus">
  <f7-navbar title="Book" back-link="Back"></f7-navbar>

  <!-- Date and time -->
  <f7-block>
     <f7-row>
        <f7-col width="60">
           <small>Date and start time</small>
           <date-picker v-model="startDateTime"
                        lang="en"
                        format="MMM DD HH:mm A"
                        :width="150"
                        :time-picker-options="{ start: '8:00', step: '00:15', end: '22:30' }"
                        :minute-step="15"
                        :append-to-body=true
                        :popupStyle="{'z-index':10000}"
                        readonly
                        type="datetime"> 
           </date-picker>
        </f7-col>
        <f7-col width="40">
           <small>End time </small>
           <date-picker v-model="endDateTime" 
                        lang="en"
                        placeholder="Ending time"
                        :width="100"
                        :minute-step="15"
                        :append-to-body=true
                        :time-picker-options="{ start: '8:00', step: '00:15', end: '22:30' }"
                        :popupStyle="{'z-index':10001}"
                        format="HH:mm A"
                        readonly
                        type="time">
           </date-picker>
        </f7-col>
     </f7-row>
     <f7-row>
        <f7-col></f7-col>
        <f7-col>
           <f7-button raised fill @click="refreshVenuesStatus" >Filter Venues</f7-button>
        </f7-col>
     </f7-row>
  </f7-block>

  <f7-block-title>Available venues</f7-block-title>
  <f7-list>
     <f7-list-item v-for="(item, index) in venuesFree" 
                   :title="`${item.id}`"
                   :value="`${item.id}`"
                   :footer="venueToStr(item.id)"
                   :key="index"
                   :link="`/book/${item.id}/${startTimeStamp}/${endTimeStamp}/`"
                   after="Book">
     </f7-list-item>
  </f7-list>
  </f7-block-title>

  <f7-block-title>Occupied venues</f7-block-title>
  <f7-list>
     <f7-list-item v-for="(item, index) in venuesTaken" 
                   :title="`${item.id}`"
                   :header="`${item.events[0].title}`"
                   :footer="`${item.events[0].date}
                   ${item.events[0].start_time} to ${item.events[0].end_time}`"
                   :key="index"
                   >
     </f7-list-item>
  </f7-list>
  </f7-block-title>

  </f7-page-content>
  </f7-page>

</template>

<script>
import moment from 'moment';

export default {
   data() {
      return {
         venuesStatus : [],
         venuesFree: [],
         venuesTaken: [],
         startDateTime: moment(),
         startTimeStamp: moment().format('X'),
         endDateTime: moment().add(60, 'm'),
         endTimeStamp: moment().add(60, 'm').format('X'),
         venues: [], // information about venues.
      };
   },
   actions: {
      bookingPopup: function(data) {
         console.log('popup');
      },
   },
   watch : {
      startDateTime: function(data){ this.startTimeStamp = moment(data).format('X');}, 
      endDateTime: function(data){ this.endTimeStamp = moment(data).format('X');},
   },
   mounted: function() {
      // Fetch the available classes of booking. 
      const self = this;
      const app = this.$f7;

      // Currently only NOPUBLIC type of bookings are allowed.
      self.postWithPromise('/config/bookmyvenue.nopublic.class')
      .then(
         function(x) 
         {
            const res = JSON.parse(x.data);
            if( res.status=='ok')
            {
               self.classes = res.data;
               self.saveStore('classes', res.data.value);
            }
            else
               self.classes = self.loadStore('classes');
         }
      );
      self.fetchVenues();
      self.venues = self.loadStore('venues');
   },
   methods: { 
      venueToStr: function(venueID)
      {
         const self = this;
         const v = self.venues[venueID];
         if(v)
            return '('+v.strength+') ' + v.summary;
         return 'Info not available.';
      },
      refreshVenuesStatus: function(data) 
      {
         const self         = this;
         const app          = self.$f7;
         self.isOpen        = false;

         // Try to connect. Convert date to unix-timestamp.
         var link = self.$store.state.api+'/venue/status/all/'
            +self.startTimeStamp+'/'+self.endTimeStamp;

         app.request.post( link, this.apiPostData()
            , function(x) 
            {
               var res = JSON.parse(x.data);
               if(res.status == 'ok')
               {
                  self.venuesStatus = res.data.venues;
                  self.venuesFree = self.venuesStatus.filter(el=>el.events.length==0);
                  self.venuesTaken = self.venuesStatus.filter(el=>el.events.length>0);
                  self.$localStorage.set('venueIDs', res.data.venues.map(x=>x.id));
               }
            });

      }
   },
}; 

</script>
