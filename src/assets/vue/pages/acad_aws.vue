<template>
  <f7-page ptr ptr:refresh="refreshPage">

    <f7-navbar title="Annual Work Seminars" back-link="Back">
    </f7-navbar>

    <!-- POPUP ASSIGN -->
    <f7-popup :opened="openAssignPopup" @popup:close="openAssignPopup=false">
      <f7-page>

        <f7-navbar title="Assign AWS">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-block>
          <f7-list no-hairlines media-list>

            <f7-list-input :input="false" label="Date">
              <date-picker lang="en"
                           slot="input"
                           v-model="thisAWS.date"
                           format="YYYY-MM-DD"
                           type="date">
              </date-picker>
            </f7-list-input>

            <f7-list-input :value="thisAWS.venue" 
                           label="Venue" 
                           readonly
                           placeholder="Hippo will assign one automatically">
            </f7-list-input>

            <f7-list-input label="Speaker" type="text" :input="false">
              <input id="autocomplete_aws_speaker"  
                     :value="thisAWS.speaker"
                     @input="thisAWS.speaker = $event.target.value"
                     slot="input" type="text" />
            </f7-list-input>
          </f7-list>
          <f7-row>
            <f7-col>
              <f7-button popup-close raised @click="assignThisAWS()"> 
                Assign
              </f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
      </f7-page>
    </f7-popup>

    <!-- POPUP EDIT -->
    <f7-popup :opened="openEditPopup" @popup:close="openEditPopup = false">
      <f7-page>
        <f7-navbar title="Edit AWS">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-block>
          <f7-list no-hairlines>

            <f7-list-input :value="thisAWS.date" label="Date" readonly>
            </f7-list-input>

            <f7-list-input :value="thisAWS.venue"  readonly label="Venue">
            </f7-list-input>

            <f7-list-input label="Speaker" readonly :value="thisAWS.speaker">
            </f7-list-input>

            <!-- FOLLOWING ITEMS APPEARS ONLY WHEN EDITING AWS -->
            <f7-list-input label="Title"
                           :value="thisAWS.title"
                           @input="thisAWS.title=$event.target.value"
                           type="text"
                           >
            </f7-list-input>

              <f7-list-item label="Description">
                <vue-editor ref="quillEditor" v-model="thisAWS.abstract">
                </vue-editor>
              </f7-list-item>

              <f7-list-item>
                <f7-button  raised 
                            popup-close 
                            slot="after"
                            @click="editThisAWS()">
                  Update
                </f7-button>
              </f7-list-item>

          </f7-list>
        </f7-block>
      </f7-page>
    </f7-popup>


    <f7-block-title small>
      Upcoming Annual Work Seminars
      <f7-button small 
                 raised fill color="yellow"
                             @click="openAssignPopup=true"
                             style="float:right">
        Assign AWS
      </f7-button>
    </f7-block-title>
    <f7-block>
      <f7-list media-list accordion-list
               no-hairlines
               v-for="(AWSes, date) in upcomingAWS" :key="date">

               <f7-block-title style="color:black">
                 {{date | date }}, {{venueInfo(AWSes[0].venue)}} 
               </f7-block-title>
        <f7-list-item v-if="AWSes.length < 3">
          <div slot="title" text-color="gray">Some slots are empty ...</div>
          <f7-button slot="after" small outline raised
                     @click="addAWSSchedule(date, AWSes[0])">
            Add AWS
          </f7-button>
        </f7-list-item>

        <f7-list-item v-for="(aws, key) in AWSes" :key="key" accordion-item>
                      <div slot="title" v-html="aws.by"></div>
                      <div slot="text" v-html="aws.title"></div>
                      <div slot="footer">{{aws.supervisor_1}}</div>
                      <div slot="footer">{{aws.supervisor_2}}</div>
                      <f7-accordion-content>
                        <f7-block>
                          <div v-html="aws.abstract"></div>
                          <f7-row>
                            <f7-col>
                              <f7-button small 
                                         fill 
                                         @click="cancelAWS(aws)"
                                         color="red">
                                Cancel
                              </f7-button>
                            </f7-col>
                            <f7-col></f7-col>
                            <f7-col>
                              <f7-button small fill @click="editAWSClick(aws)">Edit</f7-button>
                            </f7-col>
                          </f7-row>
                        </f7-block>
                      </f7-accordion-content>
                      <div slot="media" v-if="aws.acknowledged==='NO'">
                        <f7-icon icon="fa fa-question fa-2x"></f7-icon>
                      </div>
                      <div slot="media" v-else>
                        <f7-icon icon="fa fa-check fa-fw"></f7-icon>
                      </div>
        </f7-list-item>
      </f7-list>
    </f7-block>

    <!-- Upcoming schedule -->
    <f7-block-title small>
      Click on login to assign AWS.
      <f7-button small color="yellow" fill 
                       style="float:right"
                       @click="computeSchedule()">
        Recompute Schedule
      </f7-button>
    </f7-block-title>

    <f7-block>
      <div v-for="(awses, date) in schedule"
           style="border-top:1px solid lightgray"
           :key="'xyz'+date">
        <f7-row>
          <f7-col width="25"> 
            {{humanReadableDate(awses[0].date)}}
            <f7-button small raised @click="acceptSchedule(awses)">Accept All</f7-button>
          </f7-col>
          <f7-col width="25" v-for="(aws, key) in awses" :key="'yy'+key" no-gap>
            <f7-link @click="acceptSchedule([aws])">
              {{aws.speaker}} <sup>{{aws.num_aws}}</sup>
            </f7-link>
            <br />
            <span style="font-size:xx-small">{{aws.specialization}}
              <br />
              Last AWS {{str2Moment(aws['date'], 'YYYY-MM-DD')
              .diff(str2Moment(aws.last_aws_date, 'YYYY-MM-DD'), 'days')}} ago
            </span>
          </f7-col>
          <f7-col v-for="i in 3-awses.length" width="25" :key="'xxx'+i">
          </f7-col>
        </f7-row>
      </div>
    </f7-block>

  </f7-page>

</template>

<script>
import moment from 'moment';
export default {
  data() {
    const self = this;
    return {
      thisAWS: {date:'', speaker:'', venue:'', title:'', abstract:''},
      upcomingAWS: [],
      popupTitle: 'Review request',
      openAssignPopup: false,
      openEditPopup: false,
      popupAction: '',
      resules: [],
      schedule: {},
    };
  },
  mounted()
  {
    const self = this;
    const app = self.$f7;

    self.fetchUpcomingAws();
    self.fetchSchedule();

    // Autocomplete.
    app.autocomplete.create({
      inputEl : '#autocomplete_aws_speaker',
      openIn: 'dropdown',
      //expandInput: true,

      source: function(q, render)
      {
        const autocomplete = this;
        var results = [];

        if(2 >= q.length)
        {
          render(results);
          return;
        }

        autocomplete.preloaderShow();

        self.promiseWithAuth('search/awsspeaker/'+q)
          .then( function(x) {
            let res = JSON.parse(x.data);
            results = res.map(a=> a.login);
            autocomplete.preloaderHide();
            render(results);
          });
      },
      on: {
        change: function(val) {
          self.thisAWS.speaker = val[0];
        },
      },
    });

  },
  methods : {
    refreshData: function()
    {
      const self = this;
    },
    refreshPage: function()
    {
      const self = this;
    },
    fetchUpcomingAws: function() 
    {
      const self = this;
      const app = self.$f7;
      app.preloader.show();
      self.promiseWithAuth('/acadadmin/aws/upcoming')
        .then( function(x) {
          self.upcomingAWS = JSON.parse(x.data).data;
          app.preloader.hide();
        });
      setTimeout(() => app.preloader.hide(), 10000);
    },
    fetchSchedule: function()
    {
      const self = this;
      self.promiseWithAuth('/info/aws_schedule')
        .then( function(x) {
          self.schedule = JSON.parse(x.data).data;
        });
    },
    acceptSchedule: async function(awses)
    {
      const self = this;
      const app = self.$f7;

      app.dialog.preloader('Assigning AWSes: ' + Object.keys(awses).join(', '));
      for(let key in awses)
      {
        //console.log(key, self.thisAWS);
        self.thisAWS = awses[key];
        await self.assignThisAWS();
      }
      self.computeSchedule();
      app.dialog.close();
    },
    addAWSSchedule: async function(date, aws) 
    {
      const self = this;
      self.thisDate = date;
      if(! aws)
        self.thisAWS = {date:'', speaker:'', venue:''};
      else
        self.thisAWS = aws;
      self.thisAWS.date = date;
      self.thisAWS.speaker = '';
      self.popupTitle = "Add to AWS Schedule";
      self.popupAction = 'Assign';
      self.openAssignPopup = true;
    },
    editAWSClick: function(aws) 
    {
      const self = this;
      self.thisAWS = aws;
      self.popupTitle = "Editing AWS";
      self.popupAction = 'Edit';
      self.openEditPopup = true;
    },
    editThisAWS: function()
    {
      const self = this;
      self.sendRequest('acadadmin/aws/update', self.thisAWS).then( function(x){
        self.fetchUpcomingAws();
      });
    },
    assignThisAWS: async function()
    {
      const self = this;
      const app = self.$f7;
      console.log('thisAWS', self.thisAWS);
      self.thisAWS.date = self.dbDate(self.thisAWS.date);
      self.thisAWS.status = 'VALID'
      //app.dialog.preloader('Assigning AWS of ' + self.thisAWS.speaker);
      app.preloader.show();
      return self.promiseWithAuth('/acadadmin/aws/assign', self.thisAWS)
        .then( function(x) {
          var res = JSON.parse(x.data).data;
          if(! res.success)
            self.notify('Failed', res.msg);
          else
            self.notify('Success', res.msg);
          self.fetchUpcomingAws();
          app.preloader.hide();
        });
      setTimeout(() => app.preloader.hide(), 2000);
    },
    computeSchedule: function()
    {
      const self = this;
      const app = self.$f7;
      app.preloader.show();
      self.promiseWithAuth('acadadmin/reschedule')
        .then(function(x) {
          let res = JSON.parse(x.data).data;
          self.fetchSchedule();
          app.preloader.hide();
        });
      setTimeout(() => app.preloader.hide(), 10000);
    },
    cancelAWS: function(aws) 
    {
      const self = this;
      const app = self.$f7;
      app.dialog.prompt("Please give some reason..."
        , "Cancelling AWS ..."
        , function(value) {
          if( value.length <= 8)
          {
            app.dialog.alert("At least 8 char..."
              , "Reason is too short.", null);
            return;
          }
          aws['reason'] = value;
          console.log('aws', aws);
          self.promiseWithAuth('acadadmin/aws/cancel', aws)
            .then( function(x) {
              self.fetchUpcomingAws();
            });
        }, function(ev) {
          console.log( 'NAH');
        });
    },
  },
}
</script>
