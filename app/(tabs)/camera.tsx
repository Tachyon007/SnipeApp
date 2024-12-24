
import { StyleSheet, TouchableOpacity, Text, View, Button, Pressable } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
//import EditScreenInfo from '@/components/EditScreenInfo';
//import Camera from '../../components/Camera';
//import { CameraView, useCameraPermissions, PermissionStatus, PermissionResponse } from 'expo-camera';
//import { TabActions, TabRouter } from '@react-navigation/native';
//import { Link } from 'expo-router';
//import * as FileSystem from 'expo-file-system';


export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snipe Camssss</Text>

      <View style={styles.circlereticle}>
      <View style={styles.horizontalLine} />
      <View style={styles.verticalLine} />
      </View>
    </View>)
    
}

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