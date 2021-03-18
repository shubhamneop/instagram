import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import colors from '../../colors';

export default function PostComments({ post, navigation }) {
  return (
    <TouchableOpacity
      style={{ marginTop: 5, marginStart: 15, marginBottom: 5 }}
      onPress={() => navigation.navigate("Comment", {
        postId: post.id,
        uid: post.user.uid,
      })}>
      <Text style={{ color: colors.textFaded2 }}>
        View all {post.commentCount} comments
      </Text>
    </TouchableOpacity>
  );
}
