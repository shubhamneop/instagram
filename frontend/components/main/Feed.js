import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");
import colors from '../colors';
import Post from './post/Post';

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (
      props.userFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
  }, [props.userFollowingLoaded, props.feed]);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  const getLikeCount = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        console.log("check like", following);
      })
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item, index }) => (
              <>
                <Post post={item} key={index} navigation={props.navigation} />
                <Text style={{ backgroundColor: colors.white }}></Text>
              </>
            )}
          />
        </View>
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  container: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 6,
    marginStart: 10,
    marginEnd: 10,
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personImage: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  personName: {
    color: colors.text,
    marginStart: 10,
    fontWeight: 'bold',
  },
  placeName: {
    color: colors.text,
    marginStart: 10,
    fontSize: 12,
  },
  iconMore: {
    height: 15,
    width: 15,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  userFollowingLoaded: store.usersState.userFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
