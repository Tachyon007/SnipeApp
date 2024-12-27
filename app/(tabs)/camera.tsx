
import { StyleSheet, TouchableOpacity, Text, View, Button, Pressable } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
//import EditScreenInfo from '@/components/EditScreenInfo';
//import Camera from '../../components/Camera';
import { CameraView, useCameraPermissions, PermissionStatus, PermissionResponse } from 'expo-camera';
//import { TabActions, TabRouter } from '@react-navigation/native';
import { Link } from 'expo-router';
import * as FileSystem from 'expo-file-system';


export default function TabTwoScreen() {

  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef<CameraView | null>(null); // create a reference to the camera


  const handleBase64Img = async (imgString: String) => {
    if(imgString.length < 50){//More sanity checks?
      console.log("b64 too short?");
      return;
    }

    console.log("Img String Length: " + imgString.length);
    console.log(imgString.substring(0, 100)); // Print the first 100 characters
    
    try { 

      console.log("[Total b64 chars]: " + imgString.length);

      //Send data to our endpoint
      await fetch( 
          'https://snipeapi.azurewebsites.net/api/ImageUpload_V2', 
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },

            //Set content of message
            body: JSON.stringify({
              base64: imgString,
            })
          })
          //Proccess the response, check if it worked
          .then(response => { 
            response.text() 
            .then(data => { 
              //Check for success
              console.log(data);
            });
          })
  } 
  catch (error) { 
    //setSignUpResponse('There was an error');
    console.log(error);
  } 
  }

  const uploadByteArr = async (byteArr: any) => {
    console.log("Uploading Image:\nLength: " + byteArr.length);

    await fetch( 
      'https://snipeapi.azurewebsites.net/api/ImageUpload_V3', 
      {
        method: 'POST',
        headers: {
         "Content-Type": "application/octet-stream",
        },
        body: byteArr,
      })
      .then(response => { 
        response.text() 
        .then(data => { 
          console.log("IMAGE UPLOAD RESPONSE:\n");
          console.log(data);
        });
      })
  }
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        //const photo = await cameraRef.current.takePictureAsync();
        //console.log("photo taken", photo.base64);

        cameraRef.current.takePictureAsync({quality: 0.1, imageType: "jpg"}).then(async (photo) => {
          try {
            if (photo == null) {
              return;
            }

            const photoURI = photo.uri;

            // Read the file as base64
            const base64Data = await FileSystem.readAsStringAsync(photoURI, {
              encoding: FileSystem.EncodingType.Base64
            });

            //const binaryImageData = atob(base64Data).split('').map(char => char.charCodeAt(0));
            //const byteArr = new Uint8Array(binaryImageData);

            const byteArr = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

            console.log("\n\n ----- New system test -----");
            console.log("byte len: \t" + byteArr.length);
            console.log("first 20: \t" + byteArr.toString().substring(0, 20));
            uploadByteArr(byteArr);

          } catch (error) {
            console.error('Error uploading image:', error);
          }
        });
        
      } catch (error) {
        console.log("error taking picture", error);
      }
    }
  }
 
const denyPermission = () => {
    setHasPermission(false);
  };
 
  useEffect(() => {
    (async () => {
      const PermissionResponse = await useCameraPermissions();
      if (PermissionStatus.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  if (!hasPermission) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color:'white' }}>We need your permission to show the camera
        </Text>
          <Button onPress={ () =>{setHasPermission(true)}} title="Yes" >
        </Button>
        <Pressable onPress={()=>{denyPermission}}>
          <Text style={styles.captureButtonText}>No</Text>
        </Pressable>
      </View>
    );
  }
else {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snipe Camssss</Text>
     
    
        <CameraView ref={cameraRef} style={styles.cameraContainer}>
        <View>
      
      <TouchableOpacity onPress={()=>{handleCapture()}} style={styles.captureButton}>
        <Text style={styles.captureButtonText}>Snipe</Text>
      </TouchableOpacity>
      </View>
      </CameraView>

      <View style={styles.circlereticle}>
      <View style={styles.horizontalLine} />
      <View style={styles.verticalLine} />
      </View>
    </View>)
    
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  camera:{
    flex:1,
    borderRadius:20,
    borderColor:"red"
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10
  },
  captureButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginTop: '85%'
  },
  captureButtonText: {
    color: 'white',
    textAlign:'center',
    marginTop:10,
    fontSize: 20
  },

  squarereticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  circlereticle: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 100,
    height: 100,
    borderRadius: 50, // Make it a circle
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center'
  },

  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  verticalLine: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  }

})