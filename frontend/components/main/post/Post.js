import React from 'react';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostActions from './PostActions';
import PostLikes from './PostLikes';
import PostText from './PostText';
import PostComments from './PostComments';

export default function Post({ post, navigation }) {
  return (
    <React.Fragment>
      <PostHeader post={post} navigation={navigation} />
      <PostImage post={post} navigation={navigation} />
      <PostActions navigation={navigation} post={post} />
      <PostLikes post={post} navigation={navigation} />
      <PostText post={post} navigation={navigation} />
      <PostComments post={post} navigation={navigation} />
    </React.Fragment>
  );
}
