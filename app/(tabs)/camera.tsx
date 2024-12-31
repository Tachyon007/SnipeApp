
import { StyleSheet, TouchableOpacity, Text, View, Button, Pressable, Modal, FlatList } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
//import EditScreenInfo from '@/components/EditScreenInfo';
//import Camera from '../../components/Camera';
import { CameraView, useCameraPermissions, PermissionStatus, PermissionResponse } from 'expo-camera';
//import { TabActions, TabRouter } from '@react-navigation/native';
import { Link } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmPictureModal from '../../components/pictureModal';


//__bring_game_info --> feed

export default function TabTwoScreen() {

  interface GameMember {
    user_id: number;
    issued_at: string;
    username: string;
    admin_user_id: number;
    game_status: number;
    player_count: number;
  }

  //picture stuff
  const [picModalVisible, setPicModalVisible] = useState(false);
  const [picUri, setPicUri] = useState("");

  //Game Select
  const [userId, setUserId] = useState(0);
  const [gameIds, setGameIds] = useState<number[] | undefined>([]);
  
  const [gameDetailsModalVis, setGameDetailsModalVis] = useState(false);
  const [gameDetails, setGameDetails] = useState([]); 

  const [currentGameTarget, setCurrentGameTarget] = useState<string | undefined>();

  //game id
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  

  //select current game and refresh game players
  const handleSelect = async (id: number) => {

    if(id == selectedId){
      setIsModalVisible(false);
      return;
    }

    //update current game details

    let gameDetailsArr = await getGameDetails(id);
    console.log("\n\nFETCHING NEW GAME DETAILS:\n" + gameDetailsArr);
  
    setCurrentGameTarget(gameDetailsArr[0].username);
    setGameDetails(gameDetailsArr);


    setSelectedId(id);
    setIsModalVisible(false);
  };


  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef<CameraView | null>(null); // create a reference to the camera

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
            
            //uploadByteArr(byteArr);
            setPicUri(photoURI);
            setPicModalVisible(true);
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



//fetch data once
const renderGameMember = ({ item }: { item: GameMember }) => (
      <View style={styles.card}>
         <TouchableOpacity style={styles.modalButton} 
         onPress={()=>{
            setCurrentGameTarget(item.username);
            setGameDetailsModalVis(false);
          }}>
            <Text style={styles.buttonText}>{item.username}</Text>
          </TouchableOpacity>
      </View>
  );

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('Retrieved data:', value);
      return value;
    }
  } catch (e) {
    console.error('Failed to fetch data', e);
  }
};

const getGameData = async (user_id: number) => {
  //check if parameters are valid

  //fetch data
  try {
  const response = await fetch('https://snipeapi.azurewebsites.net/api/getGamesList?id='+user_id, {
      method: 'Get'
  });
  const data = await response.text();

  if (data.length > 0 && data.charAt(0) === '[') {

      let gamesData = JSON.parse(data);
      //console.log(gamesData);
      let gameIds: number[] = [];
      for(let i = 0; i < gamesData.length; i++){
        gameIds.push(gamesData[i].game_id);
      }

      //sort
      gameIds.sort();
      
      return gameIds;
  
  } else {
      //Error getting data
      console.log(data);
  }
  } catch (error) {
  //Error getting data
  }
};

const getGameDetails = async (game_id: number) => {

  //fetch data
  try {
  const response = await fetch('https://snipeapi.azurewebsites.net/api/getGameDetails?id=' + game_id, {
      method: 'Get'
  });
  const data = await response.text();

  if (data.length > 0 && data.charAt(0) === '[') {
      console.log("game details : " + game_id +" --> \n" + data);
      
      return JSON.parse(data);
  } else {
      //Error getting data
      console.log("game details --> " + data);
  }
  } catch (error) {
      console.log("getting game details");
  }

};
    useEffect(() => {
        async function fetchData() {
            let rawSignInData = await getData('signInData');
            if(rawSignInData == undefined){
              console.log("UNDEF ERROR: camera useEffect games list fetch");
              return;
            }
            let jsonData = JSON.parse(rawSignInData + "");
            let currentUserId = parseInt(jsonData.user_id);

            console.log("Camera: " + currentUserId, jsonData.username);

            //fetch games
            let idArr = await getGameData(currentUserId);
            if(idArr == undefined || idArr.length == 0){
              console.log("Error getting game data");
              return;
            }

            //fetch game details

            let gameDetailsArr = await getGameDetails(idArr[0]);
            console.log(gameDetailsArr);
          
            setCurrentGameTarget(gameDetailsArr[0].username);
            setGameDetails(gameDetailsArr);
            setSelectedId(idArr[0]);
            setUserId(currentUserId);
            setGameIds(idArr);
            
           
            
        }

        fetchData();
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
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedId ? `ID: ${selectedId}` : "Choose an ID"}
          </Text>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setGameDetailsModalVis(true)}
        >
          <Text style={styles.buttonText}>
            {currentGameTarget ? `Target: ${currentGameTarget}` : "Choose a target"}
          </Text>
      </TouchableOpacity>

        <CameraView ref={cameraRef} style={styles.cameraContainer}>
        <View>
      
      <TouchableOpacity onPress={()=>{handleCapture()}} style={styles.captureButton}>
        <Text style={styles.captureButtonText}>Snipe</Text>
      </TouchableOpacity>
      </View>
      </CameraView>




      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={gameIds}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>ID: {item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <Modal
              visible={gameDetailsModalVis}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setGameDetailsModalVis(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select a Target:</Text>
      
                  <FlatList
                    data={gameDetails}
                    keyExtractor={(item) => (""+item.user_id)}
                    renderItem={renderGameMember}
                    ListEmptyComponent={
                      <View style={{ padding: 20, alignItems: 'center' }}>
                          <Text>No player data found.</Text>
                      </View>
                  }
                  />
              
                </View>
              </View>
      </Modal>

      <ConfirmPictureModal
        picUri={picUri}
        visible={picModalVisible}
        onConfirm={()=>{setPicModalVisible(false)}}
        onReject={()=>{setPicModalVisible(false)}}
        onClose={() => setPicModalVisible(false)}
      />





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


  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  buttonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
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
    height: '80%',
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