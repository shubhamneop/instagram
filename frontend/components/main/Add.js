import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Button } from 'native-base';
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import colors from '../colors';
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasPermission(cameraStatus.status === "granted");

      const gallaryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(gallaryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const clearImage = async () => {
    if (image) {
      setImage("");
    }
  }

  if (hasPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {image ? (<><Image source={{ uri: image }} style={{ flex: 1 }} />
        <View style={styles.buttonContainerSave}>
          <Button bordered dark
            style={{
              flex: 1,
              marginRight: 10,
              marginLeft: 5,
              justifyContent: 'center',
              height: 30,
              marginTop: 10
            }} title="Following" onPress={() => navigation.navigate("Save", { image })} >
            <Text style={{ color: colors.lightBlue }}>Save</Text>
          </Button>
          <Button bordered
            style={{
              flex: 1,
              marginRight: 10,
              marginLeft: 5,
              justifyContent: 'center',
              height: 30,
              marginTop: 10,
              color: colors.lightRed,
            }} onPress={() => clearImage()} >
            <Text style={{ color: colors.lightRed }}>Clear</Text>
          </Button>
        </View></>
      ) :
        <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonTake}
              onPress={() => takePicture()}>
              <Text style={styles.text}> Take </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonGallery}
              onPress={() => pickImage()}>
              <Text style={styles.text}> Pick </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  buttonTake: {
    flex: 0.2,
    alignSelf: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    left: Dimensions.get('screen').width / 4,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.light_gray,
  },
  buttonGallery: {
    flex: 0.2,
    alignSelf: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    left: Dimensions.get('screen').width / 2.5,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainerSave: {
    flex: 0.1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

