<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-dialog v-model="dialog" width="1000">
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
                <h2>Bhai Thamen Places</h2>

                <v-radio-group v-model="postType" row>
                  <v-radio label="Food" value="food"></v-radio>
                  <v-radio label="Shop" value="shop"></v-radio>
                  <v-radio label="Pharmacy" value="pharmacy"></v-radio>
                  <v-radio label="Doctors" value="doctor"></v-radio>
                  <v-radio label="Beauty" value="beauty"></v-radio>
                  <v-radio label="Toilets" value="toilet"></v-radio>
                  <v-radio label="Clubs" value="club"></v-radio>
                  <v-radio label="Gyms" value="gym"></v-radio>
                </v-radio-group>

                <v-text-field
                  v-model="nameEN"
                  outlined
                  label="Name English"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="nameBN"
                  clearable
                  outlined
                  label="Name Bangla"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="typeEN"
                  outlined
                  label="Type English"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="typeBN"
                  outlined
                  label="Type Bangla"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="locationDescEN"
                  outlined
                  label="Location EN"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="locationDescBN"
                  outlined
                  label="Location BN"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="location.latitude"
                  outlined
                  label="Latitude"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="location.longitude"
                  outlined
                  label="Longitude"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="phone"
                  outlined
                  label="Phone"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="website"
                  outlined
                  label="Wesbite"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="social"
                  outlined
                  label="Social"
                  required
                ></v-text-field>

                <v-textarea
                  v-model="detailsEN"
                  outlined
                  auto-grow
                  row-height="10"
                  label="details EN"
                  required
                ></v-textarea>

                <v-textarea
                  v-model="detailsBN"
                  outlined
                  auto-grow
                  row-height="10"
                  label="details BN"
                  required
                ></v-textarea>

                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    v-model="selectedPrice"
                    :items="priceTypes"
                    label="Outlined style"
                    dense
                    outlined
                  ></v-select>
                </v-col>

                <div
                  v-for="(facilitytextField, g) in facilitytextFieldsEN"
                  :key="'A' + g"
                  class="text-fields-row"
                >
                  <v-text-field
                    outlined
                    label="Facility EN"
                    v-model="facilitytextField.value"
                  ></v-text-field>

                  <v-btn @click="removeRowEN(g)" class="error">delete</v-btn>
                </div>

                <v-btn @click="addRowEN" class="primary">add row</v-btn>

                <div
                  v-for="(facilitytextField, i) in facilitytextFieldsBN"
                  :key="'B' + i"
                  class="text-fields-row"
                >
                  <v-text-field
                    outlined
                    label="Facility BN"
                    v-model="facilitytextField.value"
                  ></v-text-field>

                  <v-btn @click="removeRowBN(i)" class="error">delete</v-btn>
                </div>
              </v-form>

              <v-btn @click="addRowBN" class="primary">add row</v-btn>

              <v-row>
                <v-col
                  v-for="anImage in imageUrls"
                  v-bind:key="anImage.id"
                  class="d-flex child-flex"
                  cols="4"
                >
                  <v-img :src="anImage" aspect-ratio="1" class="grey lighten-2">
                    <span @click="deleteImage(anImage)"
                      ><v-icon left color="red" large class="pa-1"
                        >mdi-delete-circle</v-icon
                      ></span
                    >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
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
        </v-col>
      </v-row>
    </v-container>
  </div>
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
        maxFiles: 1,
      },
      selectedPrice: "",
      priceTypes: [
        "Free",
        "Low cost",
        "Reasonable",
        "Expensive",
        "Not sure about the price",
        "Not applicable",
      ],
      loading: false,
      dialog: false,
      facilitytextFieldsEN: [{ value: "" }],
      facilitytextFieldsBN: [{ value: "" }],
      title: "",
      nameEN: "",
      nameBN: "",
      phone: "",
      price: "",
      social: "",
      website: "",
      detailsEN: "",
      detailsBN: "",
      facilitiesEN: "",
      facilitiesBN: "",
      locationDescBN: "",
      locationDescEN: "",
      location: "",
      typeEN: "",
      typeBN: "",
      time: "",
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
    ...mapState("safeplaces-app", ["safeplaceslabels"]),
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
    ...mapMutations("safeplaces-app", ["updateSafeplaces", "addSafeplaces"]),
    addRowEN() {
      //console.log(this.facilitytextFields[0].value);
      this.facilitytextFieldsEN.push({
        value: "",
      });
    },

    addRowBN() {
      //console.log(this.facilitytextFields[0].value);
      this.facilitytextFieldsBN.push({
        value: "",
      });
    },
    removeRowEN(index) {
      this.facilitytextFieldsEN.splice(index, 1);
    },

    removeRowBN(index) {
      this.facilitytextFieldsBN.splice(index, 1);
    },
    open(task, editing) {
      console.log("OPEN");
      if (task) {
        this.task = task;
        this.iAmEditing = true;
        this.id = this.task.id;
        this.completed = this.task.completed;
        this.nameEN = this.task.nameEN;
        this.nameBN = this.task.nameBN;
        this.locationDescBN = this.task.locationDescBN;
        this.locationDescEN = this.task.locationDescEN;
        this.detailsEN = this.task.detailsEN;
        this.detailsBN = this.task.detailsBN;
        this.social = this.task.social;
        this.website = this.task.website;
        this.phone = this.task.phone;
        this.typeEN = this.task.typeEN;
        this.typeBN = this.task.typeBN;
        this.location = this.task.location;
        this.time = this.task.time;
        this.imageUrls = this.task.images;
        this.taskLabels = this.task.labels;
        this.postType = this.task.labels[0];
        this.files.push("saved");
        this.show = this.task.show;
        this.sortDate = this.task.sortDate;
      } else {
        this.iAmEditing = false;
        this.id = "";
        this.completed = "";
        this.nameEN = "";
        this.nameBN = "";
        this.locationDescBN = "";
        this.locationDescEN = "";
        this.detailsEN = "";
        this.detailsBN = "";
        this.social = "";
        this.website = "";
        this.phone = "";
        this.typeEN = "";
        this.typeBN = "";
        this.location = "";
        this.time = "";
        this.imageUrls = [];
        this.taskLabels = [];
        this.postType = "";
        this.files.push("saved");
        this.show = true;
        this.sortDate = "";
      }

      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    save() {
      const {
        postType,
        nameEN,
        nameBN,
        locationDescBN,
        locationDescEN,
        location,
        typeEN,
        typeBN,
        phone,
        website,
        social,
        detailsEN,
        detailsBN,
        selectedPrice,
        facilitytextFields,
        imageUrls,
        show,
        id,
        time,
        sortDate,
      } = this;
      const taskEdit = {
        nameEN,
        nameBN,
        locationDescBN,
        locationDescEN,
        location,
        typeEN,
        typeBN,
        phone,
        website,
        social,
        detailsEN,
        detailsBN,
        selectedPrice,
        facilitytextFields,
        show,
        id,
        time,
        sortDate,
        completed: false,
        images: imageUrls,
        labels: [postType],
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
          nameEN,
          nameBN,
          locationDescBN,
          locationDescEN,
          location,
          typeEN,
          typeBN,
          phone,
          website,
          social,
          detailsEN,
          detailsBN,
          selectedPrice,
          facilitytextFields,
          show,
          id,
          time,
          sortDate,
          completed: false,
          images: imageUrls,
          labels: [postType],
        };
        this.imageChanged = false;
        this.addSafeplaces(taskNew);
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

          const theDate = moment(unix).format("Do MMM YY");

          this.time = firebase.firestore.Timestamp.fromDate(new Date());

          this.taskLabels = [];
          this.taskLabels.push(this.postType);
        } else {
          this.taskLabels = [];
          this.taskLabels.push(this.postType);

          console.log("doc id " + this.id);
        }

        const uniqueTime = new Date().getTime();

        if (this.imageChanged) {
          this.loading = true;
          this.image = this.$refs.imgDropzone.getAcceptedFiles();
          console.log(this.image);
          const imgName = this.image[0].name;

          const ext = imgName.slice(imgName.lastIndexOf("."));

          const uniqueTime = new Date().getTime();

          const storageRef = firebase
            .storage()
            .ref(`safeplaces/${this.postType}${uniqueTime}${ext}`)
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
                this.imageUrl = url;
                console.log(this.id);
                console.log(this.taskLabels[0]);
                console.log(this.nameEN);
                console.log(this.nameBN);
                console.log(this.locationDescBN);
                console.log(this.locationDescEN);
                console.log(this.imageUrls);
                console.log(this.location);
                console.log(this.type);
                console.log(this.phone);
                console.log(this.website);
                console.log(this.social);
                console.log(this.detailsEN);
                console.log(this.detailsBN);
                console.log(this.selectedPrice);
                console.log(this.facilitytextFields);

                db.collection("safeplaces")
                  .doc("dhaka")
                  .collection(this.postType)
                  .doc()
                  .set({
                    nameBN: this.nameBN,
                    nameEN: this.nameEN,
                    phone: this.phone,
                    price: this.selectedPrice,
                    raters: 0,
                    rating: 0,
                    reports: [],
                    social: this.social,
                    time: uniqueTime,
                    typeBN: this.typeBN,
                    typeEN: this.typeEN,
                    website: this.website,
                    completed: false,
                    detailsEN: this.detailsEN,
                    detailsBN: this.detailsBN,
                    facilitiesBN: this.facilitytextFields,
                    facilitiesEN: this.facilitytextFields,
                    show: true,
                  });
                if (this.$refs.imgDropzone) {
                  this.$refs.imgDropzone.removeAllFiles();
                }
                this.loading = false;
                this.save();
              });
            }
          );
        } else {
          if (this.iAmEditing) {
            this.loading = true;
            db.collection("safeplaces")
              .doc("dhaka")
              .collection(this.postType)
              .doc(this.id)
              .update({
                nameBN: this.nameBN,
                nameEN: this.nameEN,
                phone: this.phone,
                price: this.selectedPrice,
                raters: 0,
                rating: 0,
                reports: [],
                social: this.social,
                time: uniqueTime,
                typeBN: this.typeBN,
                typeEN: this.typeEN,
                website: this.website,
                completed: false,
                detailsEN: this.detailsEN,
                detailsBN: this.detailsBN,
                facilitiesBN: this.facilitytextFields,
                facilitiesEN: this.facilitytextFields,
                show: true,
              })
              .then((done) => {
                if (this.$refs.imgDropzone) {
                  this.$refs.imgDropzone.removeAllFiles();
                }
                this.loading = false;
                this.save();
              });
          } else {
            this.loading = true;
            db.collection("safeplaces")
              .doc("dhaka")
              .collection(this.postType)
              .doc()
              .set({
                nameBN: this.nameBN,
                nameEN: this.nameEN,
                phone: this.phone,
                price: this.selectedPrice,
                raters: 0,
                rating: 0,
                reports: [],
                social: this.social,
                time: uniqueTime,
                typeBN: this.typeBN,
                typeEN: this.typeEN,
                website: this.website,
                completed: false,
                detailsEN: this.detailsEN,
                detailsBN: this.detailsBN,
                facilitiesBN: this.facilitytextFieldsBN,
                facilitiesEN: this.facilitytextFieldsEN,
                show: true,
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

      db.collection("safeplaces").doc(this.id).update({
        image: "",
      });

      if (this.imageChanged) {
        if (this.$refs.imgDropzone) {
          this.$refs.imgDropzone.removeAllFiles();
        }
      }
      this.imageUrl = "";

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

<style lang="scss" scoped>
.text-fields-row {
  display: flex;
}
</style>
