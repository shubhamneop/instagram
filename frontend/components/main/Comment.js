import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creater);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creater, false);
        } else {
          comments[i].user = user;
        }
      }

      setComments(comments);
    }
    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creater: firebase.auth().currentUser.uid,
        text,
      });
    props.navigation.navigate("Feed");
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.view}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Comment...."
          onChangeText={(text) => setText(text)}
        />
        <Button title="Comment" onPress={() => onCommentSend()} />
      </View>
    </View>
  );
}
const mapStateToProps = (store) => ({
  users: store.usersState.users,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchUsersData,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(Comment);

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
