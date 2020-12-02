<template>
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

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="post"
    >
      Validate
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reset Form
    </v-btn>

    <v-btn
      color="warning"
      @click="resetValidation"
    >
      Reset Validation
    </v-btn>
  </v-form>
</template>

<script>
import { db, TimeStamp } from '../../main'
import moment from 'moment'
import firebase from 'firebase'
export default {
  data: () => ({
    valid: true,
    files:[],
    imageRaw:null,
    receivedUrl:'',
    imageUrl:'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    title: '',
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
    checkbox: false
  }),

  methods: {
    async post () {
      const unix = Math.round(+new Date() / 10)

      const docId = unix.toString()

      const theDate = moment(unix).format('Do MMM YY')

      const aDate = firebase.firestore.Timestamp.fromDate(new Date())

      console.log(this.files[0])

      const imgName = this.image.name

      const ext = imgName.slice(imgName.lastIndexOf('.'))

      console.log(ext)

      const storageRef=firebase.storage().ref(`newsfeed/${docId}${ext}`).put(this.image);
        storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          }, error=>{console.log(error.message)},
        ()=>{this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                this.img1 =url;
                console.log(this.img1)
                db
                .collection('newsfeed')
                .doc(docId)
                .set({
                  cat: this.postType,
                  title: this.title,
                  article: this.article,
                  time: aDate,
                  author: this.author,
                  image: url,
                  likes:[],
                  shares:0,
                  show:true
              }).then((done)=>{
                console.log('ALL DONE')
                this.title=''
                this.article=''
                this.author=''
                this.imageUrl=''
                this.files=[]
                this.resetValidation()
              })
              });
            }
          );

      // return firebase.storage().ref('newsfeed/' + docId + ext).
      //   then((fileData) => {
      //     this.receivedUrl = fileData.metadata.downloadURLs[0]

      //     db
      //       .collection('newsfeed')
      //       .doc(docId)
      //       .set({
      //         title: this.title,
      //         article: this.article,
      //         time: aDate,
      //         author: this.author,
      //         image: this.receivedUrl
      //       })
      //   })


    },
    imagePreview() {
      const fileReader = new FileReader()

      fileReader.addEventListener('load',() => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(this.files[0])
      this.image = this.files[0]
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
