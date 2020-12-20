<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-card-title class="pa-2">
        {{ isEdit ? "Edit News..." : "Add News" }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- task form -->

      <v-form ref="form" v-model="valid" lazy-validation>
        <h2>Bhai Thamen News</h2>

        <v-radio-group v-model="postType" row>
          <v-radio label="Warning" value="warn"></v-radio>
          <v-radio label="News" value="news"></v-radio>
          <v-radio label="Info" value="info"></v-radio>
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
      </v-form>

      <v-row>
        <v-col
          v-for="anImage in imageUrls"
          v-bind:key="anImage.id"
          class="d-flex child-flex mt-4 md-3 xs-6"
          cols="6"
        >
          <v-img :src="anImage" aspect-ratio="1" class="grey lighten-2">
            <span @click="deleteImage(anImage)"
              ><v-icon left color="red" large class="pa-1"
                >mdi-delete-circle</v-icon
              ></span
            >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <vue-dropzone
        id="imgDropzone"
        ref="imgDropzone"
        :options="dropzoneOptions"
        @vdropzone-complete="afterComplete"
        @vdropzone-processing="dzoneProcessing"
      ></vue-dropzone>

      <v-card-actions class="pa-2">
        <v-btn outlined @click="close">{{ $t("common.cancel") }}</v-btn>
        <v-spacer></v-spacer>
        <!-- <v-btn color="primary" @click="post">{{ $t("common.save") }}</v-btn> -->

        <v-btn
          :loading="loading"
          :disabled="loading"
          color="blue"
          class="ma-2 white--text"
          @click="post"
        >
          Save Post
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

/*
|---------------------------------------------------------------------
| TODO Compose Component
|---------------------------------------------------------------------
|
| Compose new tasks editor
*/
import moment from "moment";
import { db } from "../../../main";
import firebase from "firebase";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 250,
        thumbnailHeight: 250,
        addRemoveLinks: true,
        acceptedFiles: ".jpg, .jpeg, .png",
        maxFiles: 3,
      },
      loading: false,
      dialog: false,
      title: "",
      article: "",
      time: "",
      author: "",
      likes: [],
      shares: 0,
      events: [],
      incidentDate: "",
      foundEvents: [],
      show: true,
      iAmEditing: false,
      taskLabels: [],
      search: null,
      id: "",
      valid: true,
      files: [],
      imageRaw: null,
      receivedUrl: "",
      image: "",
      imageUrls: [],
      title: "",
      completed: "",
      sortDate: "",
      article: "",
      author: "",
      postType: "warn",
      titleRules: [
        (v) => !!v || "Title is required",
        (v) => (v && v.length <= 80) || "Title must be less than 80 characters",
      ],
      articleRules: [
        (v) => !!v || "Article text is required",
        (v) =>
          (v && v.length <= 6000) ||
          "Article must be less than 6000 characters",
      ],
      authorRules: [
        (v) => !!v || "Author name is required",
        (v) => (v && v.length <= 40) || "Name must be less than 40 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      select: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
      imageChanged: false,
    };
  },
  computed: {
    ...mapState("newsfeed-app", ["newsfeedlabels"]),
    isEdit() {
      if (this.id != null) {
        console.log(this.id);
        if (this.id == "") {
          return false;
        } else {
          return true;
        }
      }
    },
  },
  methods: {
    ...mapMutations("newsfeed-app", ["updateNewsfeed", "addNewsfeed"]),
    open(task, editing) {
      console.log("OPEN");
      if (task) {
        this.task = task;
        this.iAmEditing = true;
        this.id = this.task.id;
        this.completed = this.task.completed;
        this.author = this.task.author;
        this.title = this.task.title;
        this.article = this.task.article;
        this.time = this.task.time;
        this.image = this.task.image;
        this.taskLabels = this.task.labels;
        this.likes = this.task.likes;
        this.shares = this.task.shares;
        this.postType = this.task.labels[0];
        this.imageUrls = this.task.images;
        this.files.push("saved");
        this.show = this.task.show;
        this.sortDate = this.task.sortDate;
      } else {
        this.iAmEditing = false;
        this.id = "";
        this.task = {};
        this.author = "";
        this.title = "";
        this.article = "";
        this.time = "";
        this.image = "";
        this.taskLabels = [];
        this.likes = [];
        this.shares = 0;
        this.completed = false;
        this.postType = "news";
        this.imageUrls = [];
        this.show = true;
      }

      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    save() {
      const {
        title,
        article,
        taskLabels,
        completed,
        author,
        imageUrls,
        show,
        id,
        time,
        sortDate,
      } = this;
      const taskEdit = {
        title,
        article,
        author,
        completed,
        images: imageUrls,
        labels: taskLabels,
        show,
      };

      if (this.iAmEditing == true) {
        this.updateNewsfeed({
          ...this.task,
          ...taskEdit,
        });
        this.imageChanged = false;
      } else {
        console.log("PASS URL " + sortDate);
        const taskNew = {
          sortDate,
          id,
          title,
          article,
          completed,
          author,
          time,
          images: imageUrls,
          labels: taskLabels,
          likes: [],
          shares: 0,
          show,
        };
        this.imageChanged = false;
        this.addNewsfeed(taskNew);
      }

      this.close();
    },
    filter(item, queryText, itemText) {
      const hasValue = (val) => (val !== null ? val : "");

      const text = hasValue(item.title);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },

    async post() {
      if (this.valid == true) {
        if (this.iAmEditing == false) {
          const unix = Date.now();

          this.sortDate = unix;

          this.id = this.sortDate.toString();

          const theDate = moment(unix).format("Do MMM YY");

          this.time = firebase.firestore.Timestamp.fromDate(new Date());

          this.taskLabels = [];
          this.taskLabels.push(this.postType);
        } else {
          this.taskLabels = [];
          this.taskLabels.push(this.postType);

          console.log("doc id " + this.id);
        }

        if (this.imageChanged) {
          this.loading = true;
          this.image = this.$refs.imgDropzone.getAcceptedFiles();
          console.log(this.image);
          const imgName = this.image[0].name;

          const ext = imgName.slice(imgName.lastIndexOf("."));

          const uniqueTime = new Date().getTime();

          let photoDone = 0;

          for (var i = 0; i < this.images.length; i++) {
            const storageRef = firebase
              .storage()
              .ref(`newsfeed/${this.id}${uniqueTime}${ext}`)
              .put(this.image[0]);
            storageRef.on(
              `state_changed`,
              (snapshot) => {
                this.uploadValue =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              },
              (error) => {
                console.log(error.message);
              },
              () => {
                this.uploadValue = 100;
                storageRef.snapshot.ref.getDownloadURL().then((url) => {
                  this.imageUrls.push(url);
                  photoDone++;

                  if (photoDone == this.images.length) {
                    db.collection("newsfeed").doc(this.id).set({
                      cat: this.taskLabels[0],
                      title: this.title,
                      article: this.article,
                      time: this.time,
                      author: this.author,
                      images: this.imageUrls,
                      likes: this.likes,
                      shares: this.shares,
                      show: this.show,
                    });
                    if (this.$refs.imgDropzone) {
                      this.$refs.imgDropzone.removeAllFiles();
                    }
                    this.loading = false;
                    this.save();
                  }
                });
              }
            );
          }
        } else {
          this.loading = true;
          db.collection("newsfeed")
            .doc(this.id)
            .set({
              cat: this.taskLabels[0],
              title: this.title,
              article: this.article,
              time: this.time,
              author: this.author,
              images: this.imageUrls,
              likes: this.likes,
              shares: this.shares,
              show: this.show,
            })
            .then((done) => {
              if (this.$refs.imgDropzone) {
                this.$refs.imgDropzone.removeAllFiles();
              }
              this.loading = false;
              this.save();
            });
        }
      }
    },
    imagePreview() {
      const fileReader = new FileReader();

      if (this.files.length > 0) {
        fileReader.addEventListener("load", () => {
          this.imageUrl = fileReader.result;
        });
        fileReader.readAsDataURL(this.files[0]);
        this.image = this.files[0];
        this.imageChanged = true;
      } else {
        this.image = "";
        this.imageUrl = "";
        this.imageChanged = false;
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async dzoneProcessing(file) {
      this.loading = true;
    },
    deleteImage(img) {
      console.log(img);

      let myimage = firebase.storage().refFromURL(img);

      var ind = this.imageUrls.indexOf(img);

      this.imageUrls.splice(ind, 1);

      db.collection("newsfeed").doc(this.id).update({
        images: this.imageUrls,
      });

      myimage
        .delete()
        .then(function () {
          console.log("image deleted");
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
          console.log("an error occurred");
        });
    },
    async afterComplete(file) {
      try {
        //const imageName = uuid.v1();
        var metaData = {
          contentType: "image/png",
        };

        //this.image = this.$refs.imgDropzone.getAcceptedFiles()

        this.imageChanged = true;

        this.loading = false;

        console.log("image done");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
