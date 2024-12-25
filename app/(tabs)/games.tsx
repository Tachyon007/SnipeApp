import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';

const games = () => {

    //Typescript Def for game data
    interface Game {
        game_id: number;
        issued_at: string;
        game_code: string;
        admin_user_id: number;
        game_status: number;
        player_count: number;
    }

    const [games, setGames] = useState<Game[]>([]);

    const [userId, setUserId] = useState(5);
    const [userName, setUserName] = useState("Tachyon");

    const [modalVisible, setModalVisible] = useState(false);
    const [newGameName, setNewGameName] = useState("");

    const [joinGameModalVis, setJoinGameModalVis] = useState(false);
    const [joinGameCode, setJoinGameCode] = useState("");

    const renderItem = ({ item }: { item: Game }) => (
        <View style={styles.card}>
          <Text style={styles.title}>Game ID: {item.game_id}</Text>
          <Text>Issued At: {item.issued_at}</Text>
          <Text>Game Code: {item.game_code}</Text>
          <Text>Admin User ID: {item.admin_user_id}</Text>
          <Text>Game Status: {item.game_status === 0 ? 'Inactive' : 'Active'}</Text>
          <Text>Player Count: {item.player_count}</Text>


          <TouchableOpacity style={styles.modalButton} onPress={()=>{leaveGame(item.game_id)}}>
            <Text style={styles.modalButtonText}>leave game</Text>
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

    //fetched user's games
    const getGameData = async () => {
        //check if parameters are valid

        //fetch data
        try {
        const response = await fetch('https://snipeapi.azurewebsites.net/api/getGamesList?id='+userId, {
            method: 'Get'
        });
        const data = await response.text();

        if (data.length > 0 && data.charAt(0) === '[') {

            let gamesData = JSON.parse(data);
            gamesData.reverse();
            setGames(gamesData);
        
        } else {
            //Error getting data
            console.log(data);
        }
        } catch (error) {
        //Error getting data
        }
    };

    //create game
    const makeGame = async (gameName: String) => {
        //check if parameters are valid
        if(gameName.length < 4){
            return;
        }

        //fetch data
        try {
        const response = await fetch('https://snipeapi.azurewebsites.net/api/createGame?' + gameName +'&userName=' + userName, {
            method: 'Get'
        });
        const data = await response.text();

        if (data.length > 0 && data.charAt(0) === '{') {

            console.log(data);
            setModalVisible(false);
            getGameData();
        
        } else {
            //Error getting data
            console.log(data);
        }
        } catch (error) {
            console.log("Error making game");
        }
    };

    //leave game
    const leaveGame = async (gameId: number) => {
        //check if parameters are valid

        //fetch data
        try {
        const response = await fetch('https://snipeapi.azurewebsites.net/api/leaveGame?userId='+userId+'&gameId='+gameId, {
            method: 'Get'
        });
        const data = await response.text();

        if (data.length > 0 && data.charAt(0) === 'S') {
            console.log(data);
            getGameData();
        
        } else {
            //Error getting data
            console.log(data);
        }
        } catch (error) {
            console.log("Error leaving game");
        }
    };

    //leave game
    const joinGame = async (joinCode: String) => {

        //sanitize param
        joinCode = joinCode.trim();

        //check if parameters are valid        
        if(joinCode.length != 4){
            return;
        }

        //fetch data
        try {
        const response = await fetch('https://snipeapi.azurewebsites.net/api/joinGame?userId='+userId+'&gameCode='+joinCode, {
            method: 'Get'
        });
        const data = await response.text();
        console.log('https://snipeapi.azurewebsites.net/api/joinGame?userId='+userId+'&gameCode='+joinCode);

        if (data.length > 0 && data.charAt(0) === '1') {
            console.log("join game --> " + data);
            setJoinGameModalVis(false);
            getGameData();
        
        } else {
            //Error getting data
            console.log("join game --> " + data);
        }
        } catch (error) {
            console.log("Error leaving game");
        }
    };



    //fetch data once
    useEffect(() => {
        async function fetchData() {
            let rawSignInData = await getData('signInData');
            if(rawSignInData == undefined){
              console.log("UNDEF ERROR: useEffect games list fetch");
            }
            let jsonData = JSON.parse(rawSignInData + "");

            console.log(parseInt(jsonData.user_id), jsonData.username);
            setUserId(parseInt(jsonData.user_id));
            setUserName(jsonData.username);
            //get game list
            getGameData();
        }

        fetchData();
    }, []);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={()=>{getGameData()}}>
            <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={()=>{setModalVisible(true)}}>
            <Text style={styles.buttonText}>Create Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={()=>{setJoinGameModalVis(true)}}>
            <Text style={styles.buttonText}>Join Game</Text>
            </TouchableOpacity>
        </View>


      <FlatList
        data={games}
        keyExtractor={(item) => item.game_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>No games found.</Text>
          </View>
      }
      />



    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Game</Text>
            <TextInput
              style={styles.input}
              placeholder="Game Name"
              value={newGameName}
              onChangeText={setNewGameName}
            />
          
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={()=>{makeGame(newGameName)}}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>




      <Modal
        visible={joinGameModalVis}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setJoinGameModalVis(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Game</Text>
            <TextInput
              style={styles.input}
              placeholder="Game Code"
              value={joinGameCode}
              onChangeText={setJoinGameCode}
            />
          
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={()=>{joinGame(joinGameCode)}}>
                <Text style={styles.modalButtonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setJoinGameModalVis(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#6200ea',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default games;
