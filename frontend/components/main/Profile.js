import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Icon, Container, Content, Header, Left, Body, Right, Button, Spinner } from 'native-base';
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");
import colors from '../colors';

const { width, height } = Dimensions.get('window');

function Profile(props) {
  const [userPost, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollwoing] = useState(false);
  const [userFollowing, setUserFollowing] = useState([]);

  useEffect(() => {
    const { currentUser, posts, following } = props;
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
      setUserFollowing(following);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
      firebase
        .firestore()
        .collection("following")
        .doc(props.route.params.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot) => {
          let following = snapshot.docs.map((doc) => {
            const id = doc.id;
            return id;
          });
          setUserFollowing(following);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollwoing(true);
    } else {
      setFollwoing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  const openDetail = () => {
    props.navigation.navigate('Feed');
  };

  if (user == null) {
    return <View />;
  }

  return (

    <Container style={{ flex: 1 }}>
      <Content>
        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>

          <View style={{ flex: 3, marginBottom: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.countable}>{userPost.length}</Text>
                <Text style={{ fontSize: 13, color: 'gray' }}>posts</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.countable}>{userFollowing.length}</Text>
                <Text style={{ fontSize: 13, color: 'gray' }}>followers</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.countable}>{userFollowing.length}</Text>
                <Text style={{ fontSize: 13, color: 'gray' }}>following</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                <>
                  {following ? (
                    <Button bordered dark
                      style={{
                        flex: 1,
                        marginRight: 10,
                        marginLeft: 5,
                        justifyContent: 'center',
                        height: 30,
                        marginTop: 10
                      }} title="Following" onPress={() => onUnfollow()} >
                      <Text>Following</Text>
                    </Button>
                  ) : (
                      <Button bordered dark
                        style={{
                          flex: 1,
                          marginRight: 10,
                          marginLeft: 5,
                          justifyContent: 'center',
                          height: 30,
                          marginTop: 10
                        }} title="Follow" onPress={() => onFollow()} >
                        <Text>Follow</Text>
                      </Button>
                    )}
                </>
              ) : (
                  <Button bordered dark small icon
                    style={{
                      flex: 1,
                      marginRight: 10,
                      marginLeft: 5,
                      justifyContent: 'center',
                      height: 30,
                      marginTop: 10
                    }} onPress={() => onLogout()}>
                    <Icon name="settings" />
                  </Button>
                )}


            </View>
          </View>
        </View>

        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPost}
          renderItem={({ item, index }) => (
            <View key={index} style={{ width: width / 3, height: width / 3, margin: 0.5, borderWidth: 1 }}>
              <TouchableOpacity style={{ flex: 1, display: 'flex' }}
              >
                <Image source={{ uri: item.downloadUrl }} style={{ flex: 1 }} />
              </TouchableOpacity>
            </View>
          )}
        />

      </Content>
    </Container>
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
  userEmail: {
    color: colors.fullDarkBlue,
    fontSize: 15
  },
  countable: {
    fontWeight: 'bold',
    fontSize: 15
  }
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
  feed: store.usersState.feed,
});

export default connect(mapStateToProps, null)(Profile);
