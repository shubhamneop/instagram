import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from '../../colors';
import firebase from 'firebase';
require('firebase/firestore');

export default function PostLikes({ post }) {
  const [likeCount, setLikeCount] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .doc(post.user.uid)
      .collection("userPosts")
      .doc(post.id)
      .collection("likes")
      .onSnapshot((snapshot) => {
        let likes = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        setLikeCount(likes);
      })
  }, []);

  return (
    <TouchableOpacity
      onPress={() => console.log('Pressed Post Likes')}
      style={{ marginLeft: 15, marginTop: 10, marginEnd: 15 }}>
      <Text style={{ color: colors.text, fontWeight: 'bold' }}>
        {likeCount.length} likes{' '}
      </Text>
    </TouchableOpacity>
  );
}
