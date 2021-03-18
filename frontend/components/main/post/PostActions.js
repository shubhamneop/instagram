import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import images from '../../../res/images';
import firebase from 'firebase';
require("firebase/firestore");

function tapToLike(likeIcon) {
  if (likeIcon) {
    return images.redHeart;
  } else {
    return images.like;
  }
}
function tapToBookmark(bookmarkIcon) {
  if (bookmarkIcon % 2 === 0) {
    return images.bookmarkWhite;
  } else {
    return images.bookmark;
  }
}

export default function PostActions({ post, navigation }) {
  const [likeIcon, setLikeIcon] = React.useState(1);
  const [bookmarkIcon, setBookmarkIcon] = React.useState(1);

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
  return (
    <View style={Styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={() => { post.currentUserLike ? onDislikePress(post.user.uid, post.id) : onLikePress(post.user.uid, post.id) }}>
          <Image source={tapToLike(post.currentUserLike)} style={Styles.actionIcons} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Comment", {
          postId: post.id,
          uid: post.user.uid,
        })}>
          <Image source={images.comment} style={Styles.actionIcons} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Pressed Direct Message')}>
          <Image source={images.direct_message} style={Styles.actionIcons} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setBookmarkIcon(bookmarkIcon + 1)}>
        <Image
          source={tapToBookmark(bookmarkIcon)}
          style={Styles.actionIcons}
        />
      </TouchableOpacity>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    //paddingStart: 20,
    marginEnd: 15,
    marginTop: 15,
  },
  actionIcons: {
    width: 23,
    height: 23,
    marginStart: 15,
  },
});
