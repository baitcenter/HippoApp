<template>
   <f7-page ptr @ptr:refresh="refreshForum">

     <f7-navbar title="Notice Board" back-link="Back">
       <f7-nav-right>
         <f7-link class="searchbar-enable" 
                  data-searchbar=".searchbar-notice" 
                  icon-ios="f7:search" icon-aurora="f7:search" icon-md="material:search"
                                                               >
         </f7-link>
       </f7-nav-right>

       <f7-searchbar expandable
                     class="searchbar-notice"
                     paceholder="Search in items" 
                     search-item="div.card"
                     search-container=".card-list"
                     search-in=".card-header, .card-content">
       </f7-searchbar>
     </f7-navbar>

     <f7-fab position="right-bottom" 
             slot="fixed" 
             color="blue"
             @click="postToForum">
       <f7-icon ios="f7:add" aurora="f7:add" md="material:add"></f7-icon>
       <f7-icon ios="f7:close" aurora="f7:close" md="material:close"></f7-icon>
     </f7-fab>

    <!-- Popup for updating. . -->
    <f7-popup :opened="updatePopup" ref="update_popup" @popup:closed="updatePopup=false">
      <f7-page>
        <f7-navbar title="Post to forum">
          <f7-nav-right>
            <f7-link popup-close>Cancel</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list id="forum_post" form-store-data no-hairlines-md>
           <f7-list-item smart-select
                         :value="item.tags"
                         :smart-select-params="{ 
                             openIn: 'popover'
                             , pageTitle: 'Tags for your post'
                             , routableModals: false
                         }" 
                 >
                <select name="tags" v-model="item.tags" multiple>
                   <option v-for="tag in alltags" :value="tag">{{tag}}</option>
                </select>
              <div slot="title" style="font-size:x-small"
                 >Select at least one tag</div>
           </f7-list-item>

           <f7-list-input title="Informative title"
                          placeholder="Informative title"
                          :value="item.title"
                          @input="item.title = $event.target.value"
                          required validate>
           </f7-list-input>


           <f7-list-input title="Description"
                          :value="item.description"
                          placeholder="Optional description"
                          @input="item.description = $event.target.value"
                          :resizable="true"
                          type="textarea" 
                          >
           </f7-list-input>

           <f7-list-item>
              <f7-button raised fill
                         popup-close
                         @click="deleteCard(item.id)"
                         >Delete
              </f7-button>
              <f7-button raised fill
                         popup-close
                         @click="postToForumSubmit()"
                         >Submit
              </f7-button>
           </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-popup>

    <!-- Popup for positing . -->
    <f7-popup :opened="postPopup" ref="post_popup" @popup:closed="postPopup = false">
      <f7-page>
         <f7-navbar title="Post to forum">
            <f7-nav-right>
               <f7-link popup-close>Cancel</f7-link>
            </f7-nav-right>
         </f7-navbar>

         <f7-block>
            <f7-list id="forum_post" form-store-data no-hairlines-md>
               <f7-list-item smart-select
                             :value="item.tags"
                             :smart-select-params="{ 
                                 openIn: 'popover'
                                 , pageTitle: 'Tags for your post'
                                 , routableModals: false
                             }" 
                     >
                    <select name="tags" v-model="item.tags" multiple>
                       <option v-for="tag in alltags" :value="tag">{{tag}}</option>
                    </select>
                    <div slot="title" style="font-size:x-small"
                       >Select at least one tag</div>
               </f7-list-item>

               <f7-list-input title="Informative title"
                              placeholder="Informative title"
                              :value="item.title"
                              @input="item.title = $event.target.value"
                              required 
                              validate
                              >
               </f7-list-input>


               <f7-list-input title="Description"
                              :value="item.description"
                              placeholder="Optional description"
                              @input="item.description = $event.target.value"
                              :resizable="true"
                              type="textarea" 
                              >
               </f7-list-input>

               <f7-list-item>
                  <f7-button raised fill
                             popup-close
                             @click="postToForumSubmit()"
                             >Submit
                  </f7-button>
               </f7-list-item>
            </f7-list>
         </f7-block>
      </f7-page>
    </f7-popup>

  <f7-popup :opened="commentPopup" @popup:closed="commentPopup = false">
     <f7-page>
        <f7-navbar title="Comments">
           <f7-nav-right>
              <f7-link popup-close>Cancel</f7-link>
           </f7-nav-right>
        </f7-navbar>

        <f7-block>
           <f7-list no-hairlines>
              <f7-list-input label="Add comment"
                             :value="thisComment.comment"
                             @input="thisComment.comment = $event.target.value"
                             :resizable="true"
                             required
                             type="textarea" 
                             >
              </f7-list-input>
              <f7-list-item>
                 <f7-button raised 
                            popup-close
                            fill 
                            @click="addComment()" 
                            slot="after"
                            >
                            Submit
                 </f7-button>
                 <f7-button raised popup-close slot="title">Cancel</f7-button>
              </f7-list-item>
           </f7-list>
        </f7-block>
        <f7-block>
           <f7-block-title small>Existing comments</f7-block-title>
           <f7-list media-list no-hairlines>
              <!-- Existing comments. -->
              <f7-list-item v-for="(c, key) in comments"
                            :key="key"
                            :text="c.comment"
                            :footer="'By ' + c.commenter"
                            style="background-color:Ivory"
                            >
                <f7-link v-if="c.commenter===getLogin()"
                         slot="after"
                         @click="deleteComment(c.id)"
                         >Delete
                </f7-link>
              </f7-list-item>
           </f7-list>
        </f7-block>

     </f7-page>
  </f7-popup>

    <!-- Show current cards -->
    <f7-card v-if="board!='all'">
       <f7-button small raised 
                  slot="content"
                  v-if="! subscriptions.includes(board)"
                  @click="subcribeToForum(board)">
         Subscribe
       </f7-button>
       <f7-button small raised 
                  slot="content"
                  v-else
                  @click="unsubcribeToForum(board)">
         Unsubscribe
       </f7-button>
    </f7-card>

    <f7-row noGap>
      <f7-card v-for="(card, key) in filterCards(forumCards)" 
               :key="key" class="col-100 medium-45">

        <f7-card-header>
          <div>
            <span v-for="(tag,key) in card.tags" :key="key">
              <f7-link :href="'/noticeboards/'+tag"> b/{{tag}}</f7-link>&nbsp;
            </span>
            <span style="color:gray; font-size:small;">
              /Posted by <tt>{{card.created_by}}</tt>
              {{datetime2Moment(card.created_on).fromNow()}}
            </span>
            <span style="font-size:small;color:gray"
                  v-if="card.last_modified_on!=card.created_on">
              /Modified {{datetime2Moment(card.last_modified_on).fromNow()}}.
            </span>
          </div>
        </f7-card-header>
        <f7-card-content>
          <div> {{card.title}} </div>
          <span v-html="card.description"></span>
          <f7-row class="align-content-center">
            <f7-col>
              <f7-button small @click="updateCard(card)"
                         v-if="getLogin() == card.created_by">
                Update
              </f7-button>
            </f7-col>
            <f7-col>
              <f7-button small @click="showCommentPopup(card)">
                ({{card.num_comments}}) Comment
              </f7-button>
            </f7-col>
          </f7-row>
        </f7-card-content>
      </f7-card>
    </f7-row>

  </f7-page>
</template>

<script>
import moment from 'moment';

export default {
   data() {
      const self = this;
      return {
         board: self.$f7route.params.boardName,
         forumCards: [],
         postPopup: false,
         subscriptions: [],  // Subscriptions
         commentPopup: false,
         updatePopup: false,
         thisComment: { 
            external_id: '' 
            , comment: ''
         },
         comments: [],
         alltags: [],
         item: {
            id: 0,
            title : '',
            description: '',
            created_by: '',
            tags: [],
            num_comments: 0,
         },
      };
   },
   mounted() {
      const self = this;
     self.getAllForumTags();
     self.getForumPosts();
     self.getSubscriptions();
   },
   methods: { 
      // METHODS:
     getForumPosts: function() {
       const self = this;
       const app = self.$f7;
       app.preloader.show();
       self.promiseWithAuth( "/forum/list/100", []).then(
         function(x) {
           var res = JSON.parse(x.data).data;
           self.forumCards = res;
           self.saveStore('forum.cards', self.forumCards);
           app.preloader.hide();
         }
       );
       setTimeout(() => app.preloader.hide(), 2000);
     },
     getSubscriptions: function() {
       const self = this;

       self.promiseWithAuth( "/forum/subscriptions", []).then(
         function(x) {
           var res = JSON.parse(x.data).data;
           self.subscriptions = res;
           self.saveStore('forum.subscriptions', self.subscriptions);
         }
       )
     },
     filterCards: function() {
       const self = this;
       if(self.board == 'all')
         return self.forumCards;
       return self.forumCards.filter(x => x.tags.includes(self.board) );
     },
     getAllForumTags: function() {
       console.log( "Getting forum tags." );
       const self = this;
       self.promiseWithAuth("/forum/alltags", []).then(
         function(x) {
           var res = JSON.parse(x.data).data;
           self.alltags = res;
           self.saveStore('forum.alltags', self.alltags);
         }
       );
     },
     fetchAllTags: function() {
       const self = this;
       self.postWithPromise('/forum/alltags').then(
         function(x) {
           self.alltags = JSON.parse(x.data).data;
           self.saveStore('forum.alltags', self.alltags);
         }
       );
     },
     refreshForum: function(ev, done) {
       const self = this;
       setTimeout( () =>  {
         self.getForumPosts();
         self.fetchAllTags();
         self.getSubscriptions();
         done();
       }, 1000);
     },
     postToForum: function() {
       const self = this;
       self.postPopup = true;
     },
     postToForumSubmit: function() {
       const self = this;
       setTimeout(() => self.sendRequest('/forum/post', self.item), 500);
       self.commentPopup = false;
       setTimeout(() => self.getForumPosts(), 1000);
     },
     showCommentPopup: function( item ) {
       const self = this;

       self.thisComment.external_id = "forum." + item.id;

       // Get all previous comments to show as well.
       setTimeout( () => {
         self.promiseWithAuth("/comment/get/forum."+item.id).then(
           function(x) {
             let res = JSON.parse(x.data).data;
             self.comments = res;
           }
         )}, 1000);
       self.commentPopup = true;
     },
     addComment: function() {
       const self = this;
       setTimeout( () => {
         self.promiseWithAuth("/comment/post", self.thisComment)
       }, 1000);
     },
     subcribeToForum: function(boardName) {
       const self = this;
       console.log('Subscribing to ' + boardName);
       self.sendRequest('/forum/subscribe/'+boardName);
       self.subscriptions.push(boardName);
     },
     unsubcribeToForum: function(boardName) {
       const self = this;
       const app = self.$f7;
       if( boardName != 'emergency')
       {
         console.log('Unsubscribing from ' + boardName);
         self.sendRequest('/forum/unsubscribe/'+boardName);
         self.subscriptions = self.subscriptions.filter(x => x != boardName);
       }
       else
       {
         app.dialog.alert("You can't unsubscribe emergency", "OK");
         return;
       }
     },
     updateCard: function(card) {
       const self = this;
       self.item = card;
       console.log("Updating card ", card);
       self.updatePopup = true;
     },
     deleteCard: function(cid) {
       const self = this;
       self.sendRequest('/forum/delete/' + cid );

       // Remove the card from the list.
       self.forumCards = self.forumCards.filter( c => c.id != cid );
       self.saveStore('forum.cards', self.forumCards);
     },
   },
};
</script>
