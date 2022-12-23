import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Title,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

// The following are required for access to the camera:
// expo install expo-image-picker
// expo install expo-permissions

const ImageSelector = (props) => {
  //for the database
  [dataForDatabase, setDataForDatabase] = useState({});
  [dataFromDatabase, setDataFromDatabase] = useState("");
  //image uri
  const [selectedImage, setSelectedImage] = useState(
    "https://getwallpapers.com/wallpaper/full/a/e/9/825536-download-purple-wallpaper-desktop-1920x1200.jpg"
  );
  const [showSave, setShowSave] = useState(false);
  //text input
  const [text1, setText] = useState("Input");
  const [textToNote, setTextToNote] = useState("");
  //open the database
  const db = SQLite.openDatabase("myTestDB");

  const [newPathImage, setNewPathImage] = useState();

  useEffect(
    () => {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS pictureTable  (id INTEGER PRIMARY KEY NOT NULL, imageName TEXT, imageUrl TEXT);",
          [],
          () => console.log("TABLE CREATED!"),
          (_, result) => console.log("TABLE CREATE failed:" + result)
        );
      });

      // retrieve the current contents of the DB tables we want
      // retrieveFromDatabase();
    },
    // add [] as extra argument to only have this fire on mount and unmount (or else it fires every render/change)
    []
  );

  //setting the data
  /*
    onNameChangeHandler = (value) => {
        setDataForDatabase(prevState => ({ ...prevState, imageName: value }));
      }
    
      onImageUrlChangeHandler = (value) => {
        setDataForDatabase(prevState => ({ ...prevState, imageUrl: value }));
      }
      */

  saveToDatabase = async () => {
    // transaction(callback, error, success)
    db.transaction((tx) => {
      // executeSql(sqlStatement, arguments, success, error)

      tx.executeSql(
        "INSERT INTO pictureTable (imageName, imageUrl) values (?, ?)",
        [text1, selectedImage],

        (_, { rowsAffected }) =>
          rowsAffected > 0
            ? console.log("ROW INSERTED!")
            : console.log("INSERT FAILED!"),
        (_, result) => console.log("INSERT failed:" + result)
      );
    });
    if (selectedImage !== null) {
      fileMoveHandler();
      setTextToNote(textToNote.concat(text1 + " "));
    }
  };

  //save images long term in local storage
  const fileMoveHandler = async () => {
    const fileName = selectedImage.split("/").pop();
    const newPathImage = FileSystem.documentDirectory + fileName;
    console.log("FileSystem:", newPathImage);
    setNewPathImage(newPathImage);
    console.log("newPathImage", newPathImage);
    try {
      await FileSystem.moveAsync({
        from: selectedImage,
        to: newPathImage,
      });
    } catch (err) {
      console.log("Error:", err);
      Alert.alert("Can't move this file.", "Try again!", [{ text: "Okay" }]);
    }
  };

  retrieveFromDatabase = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM pictureTable",
        [],
        (_, { rows }) => {
          console.log("ROWS RETRIEVED!");
          // clear data currently stored
          setDataFromDatabase("");
          let entries = rows._array;
          entries.forEach((entry) => {
            setDataFromDatabase(
              (prev) => prev + `${entry.imageName}, ${entry.imageUrl}\n`
            );
            //Alert.alert(`Id: ${entry.id} Imagename: ${entry.imageName} ImageURL: ${entry.imageUrl}`);
          });
        },
        (_, result) => {
          console.log("SELECT failed!");
          console.log(result);
        }
      );
    });
  };

  const verifyPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (
      cameraResult.status !== "granted" &&
      libraryResult.status !== "granted"
    ) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const retrieveImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return false;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    //setting image uri
    const i = image.assets[0].uri;
    if (!image.canceled) {
      setSelectedImage(i);
      console.log("Image selected was " + i);
      Alert.alert("Selected an image");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={retrieveImageHandler}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.imageStyle}
          ></Image>
          <Text>Touch the photo here to choose a photo</Text>
        </TouchableOpacity>
        <TextInput
          onchangeText={(v) => setText(v)}
          numberOfLines={4}
          style={styles.inputStyle}
        ></TextInput>
        <Button
          style={styles.button}
          title="Save data into database"
          onPress={() => {
            saveToDatabase();
          }}
        />
        <Button
          style={styles.button}
          title="Retrieve data from the database"
          onPress={() => {
            retrieveFromDatabase();
            Alert.alert("URI : " + selectedImage + "Note: " + textToNote);
            Alert.alert("Note: " + textToNote);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 260,
  },
  buttonContainer: {
    backgroundColor: "#949CCE",
    borderRadius: 30,
  },
  button: {
    paddingVertical: 25,
    width: "100%",
  },
  imageStyle: {
    width: 400,
    height: 150,
    borderRadius: 30,
  },
  inputStyle: {
    backgroundColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "black",
  },
  fontHeader: {
    fontSize: 30,
  },
});

export default ImageSelector;
