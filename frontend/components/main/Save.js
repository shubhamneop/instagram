import React, { useState } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet } from "react-native";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import Loader from "../Loader";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props, { navigation }) {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    setLoading(true);
    const uri = props.route.params.image;
    const response = await fetch(uri);

    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transfree:${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
      setLoading(false);
    };
    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadUrl) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadUrl,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        setLoading(false);
        props.navigation.popToTop();
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader loading={loading} />
      <Image source={{ uri: props.route.params.image }} style={{ flex: 1 }} />
      <TextInput
        style={styles.inputStyle}
        placeholder="Write a caption...."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    marginTop: 5,
    marginBottom: 10,
    color: "#040707",
    paddingRight: 30,
  },
  view: {
    marginTop: 15,
    padding: 15,
  },
});
