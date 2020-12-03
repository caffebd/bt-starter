<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-card-title class="pa-2">
        {{ isEdit ? 'Edit News...' : 'Add News' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- task form -->

  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
  <h2>Bhai Thamen News</h2>

    <v-radio-group
      v-model="postType"
      row
    >
      <v-radio
        label="Warning"
        value="warn"
      ></v-radio>
      <v-radio
        label="News"
        value="news"
      ></v-radio>
      <v-radio
        label="Info"
        value="info"
      ></v-radio>
    </v-radio-group>

    <v-text-field
      v-model="title"
      outlined
      :counter="80"
      :rules="titleRules"
      label="Title"
      required
    ></v-text-field>




        <v-textarea
          v-model="article"
          clearable
          auto-grow
          outlined
          rows="7"
          row-height="15"
          :counter="6000"
          :rules="articleRules"
          label="Article"
          required
        ></v-textarea>



    <v-text-field
      v-model="author"
      outlined
      :counter="40"
      :rules="authorRules"
      label="Author"
      required
    ></v-text-field>

     <v-file-input
    v-model="files"
    color="deep-purple accent-4"
    counter
    label="File input"
    multiple
    placeholder="Select your files"
    prepend-icon="mdi-paperclip"
    outlined
    @change="imagePreview"
    :show-size="1000"
  >
    <template v-slot:selection="{ index, text }">
      <v-chip
        v-if="index < 2"
        color="deep-purple accent-4"
        dark
        label
        small
      >
        {{ text }}
      </v-chip>

      <span
        v-else-if="index === 2"
        class="overline grey--text text--darken-3 mx-2"
      >
        +{{ files.length - 2 }} File(s)
      </span>
    </template>
  </v-file-input>
  <v-flex xs12 sm6 offset-sm3>
    <img :src="imageUrl" height="150">

  </v-flex>
    </v-form>
      <v-divider></v-divider>

      <v-card-actions class="pa-2">
        <v-btn outlined @click="close">{{ $t('common.cancel') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="post">{{ $t('common.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

/*
|---------------------------------------------------------------------
| TODO Compose Component
|---------------------------------------------------------------------
|
| Compose new tasks editor
*/
import moment from 'moment'
import { db } from '../../../main'
import firebase from 'firebase'
export default {
  data () {
    return {
      dialog: false,
      title: '',
      article: '',
      time: '',
      author: '',
      likes:[],
      shares:0,
      events:[],
      incidentDate:'',
      foundEvents:[],
      show:true,
      iAmEditing:false,
      taskLabels: [],
      search: null,
      id:'',
      valid: true,
      files:[],
      imageRaw:null,
      receivedUrl:'',
      imageUrl:'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      title: '',
      sortDate:'',
      article:'',
      author:'',
      postType:'warn',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => (v && v.length <= 80) || 'Title must be less than 80 characters'
      ],
      articleRules: [
        (v) => !!v || 'Article text is required',
        (v) => (v && v.length <= 6000) || 'Article must be less than 6000 characters'
      ],
      authorRules: [
        (v) => !!v || 'Author name is required',
        (v) => (v && v.length <= 40) || 'Name must be less than 40 characters'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false,
      imageChanged:false

    }
  },
  computed: {
    ...mapState('newsfeed-app', ['newsfeedlabels']),
    isEdit() {
      if (this.id!=null){
        console.log(this.id)
        if (this.id==''){
          return false
        }else{
          return true
        }
      }

    }
  },
  methods: {
    ...mapMutations('newsfeed-app', ['updateNewsfeed', 'addNewsfeed']),
    open(task, editing) {
      console.log('OPEN')
      if (task) {
        this.task = task
        this.iAmEditing = true
        this.id = this.task.id
        this.author = this.task.author
        this.title = this.task.title
        this.article = this.task.article
        this.time = this.task.time
        this.image = this.task.image
        this.taskLabels = this.task.labels
        this.likes = this.task.likes
        this.shares = this.task.shares
        this.postType = this.task.labels[0]
        this.imageUrl = this.task.image
        this.show = this.task.show
        this.sortDate = this.task.sortDate
      } else {
        this.iAmEditing = false
        this.id = ''
        this.task = {}
        this.author = ''
        this.title = ''
        this.article = ''
        this.time = ''
        this.image = ''
        this.taskLabels = []
        this.likes = []
        this.shares = 0
        this.postType = 'news'
        this.imageUrl = ''
        this.show = true
      }

      this.dialog = true
    },
    close() {
      this.dialog = false
    },
    save() {
      const { title, article, taskLabels, author, imageUrl, show, id, time, sortDate } = this
      const taskEdit = {
        title,
        article,
        author,
        image: imageUrl,
        labels: taskLabels,
        show
      }

      if (this.iAmEditing == true) {
        this.updateNewsfeed({
          ...this.task,
          ...taskEdit
        })
      } else {
        console.log ('PASS URL '+sortDate)
        const taskNew = {
        sortDate,
        id,
        title,
        article,
        author,
        time,
        image: imageUrl,
        labels: taskLabels,
        likes:[],
        shares:0,
        show
      }
        this.addNewsfeed(taskNew)
      }

      this.close()
    },
    filter (item, queryText, itemText) {
      const hasValue = (val) => val !== null ? val : ''

      const text = hasValue(item.title)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },


    async post () {

      if (this.iAmEditing==false){
      const unix = Date.now()

      this.sortDate = unix

      this.id = this.sortDate.toString()

      const theDate = moment(unix).format('Do MMM YY')

      this.time = firebase.firestore.Timestamp.fromDate(new Date())

      this.taskLabels=[]
      this.taskLabels.push(this.postType)

      }else{

        this.taskLabels=[]
        this.taskLabels.push(this.postType)

        console.log('doc id '+this.id)
      }

      if (this.imageChanged){



      const imgName = this.image.name

      const ext = imgName.slice(imgName.lastIndexOf('.'))

      const uniqueTime = new Date().getTime()


      const storageRef=firebase.storage().ref(`newsfeed/${this.id}${uniqueTime}${ext}`).put(this.image);
        storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          }, error=>{console.log(error.message)},
        ()=>{this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                this.imageUrl = url;
                console.log(this.id)
                console.log(this.taskLabels[0])
                console.log(this.title)
                console.log(this.article)
                console.log(this.time)
                console.log(this.author)
                console.log(this.imageUrl)
                console.log(this.likes)
                console.log(this.shares)
                console.log(this.show)

                db
                .collection('newsfeed')
                .doc(this.id)
                .set({
                  cat: this.taskLabels[0],
                  title: this.title,
                  article: this.article,
                  time: this.time,
                  author: this.author,
                  image: this.imageUrl,
                  likes:this.likes,
                  shares:this.shares,
                  show:this.show
              })
              this.save()
              });
            }
          );

      } else {

          db
          .collection('newsfeed')
          .doc(this.id)
          .set({
            cat: this.taskLabels[0],
            title: this.title,
            article: this.article,
            time: this.time,
            author: this.author,
            image: this.image,
            likes:this.likes,
            shares:this.shares,
            show:this.show

      }).then((done)=>{
                this.save()
              })
      }

    },
    imagePreview() {
      const fileReader = new FileReader()

      fileReader.addEventListener('load',() => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(this.files[0])
      this.image = this.files[0]

      this.imageChanged = true
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
