import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const ConfirmPictureModal = ({
  picUri,
  onConfirm,
  onReject,
  visible,
  onClose,
}: {
  picUri: string;
  onConfirm: () => void;
  onReject: () => void;
  visible: boolean;
  onClose: () => void;
}) => {


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Display the Picture */}
          <Image source={{ uri: picUri }} style={styles.picture} />

          {/* Confirm and Reject Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Text style={styles.buttonText}>✖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>✔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  picture: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ConfirmPictureModal;
