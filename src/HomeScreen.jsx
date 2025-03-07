import React, { useEffect, useState } from "react";
import axios from "axios";
import { Base_url } from "./Base_URL";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AirbnbRating } from "react-native-ratings";
import Booking_model from "./Booking_model";
 import  DateTimePicker  from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Error_model from "./Error_model";


const HomeScreen = ({ navigation }) => {
  const [patientName, setPatientName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reasonForBooking, setReasonForBooking] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  
  const [loading, setLoading] = useState(false); // Loader state

  const getEmail = async () => {
    try {
      AsyncStorage.getItem("email").then((email) => {
        setEmail(email);
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getEmail();
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loader
    try {
      
        if (
          patientName &&
          contactNo &&
          appointmentDate &&
          appointmentTime &&
          reasonForBooking &&
          feedbackRating > 0
        ) {
          const response = await axios.post(
            `${Base_url}/userAppointment/appointment`,
            {
              FullName: patientName,
              Email: email,
              PhoneNo: contactNo,
              Date_of_Appointment: appointmentDate,
              Time_of_Appointment: appointmentTime,
              Reason_for_booking: reasonForBooking,
              Feedback_Rating: feedbackRating,
            }
          );
          if (response.status === 200) {
            setModalVisible(true);
            setPatientName("");
            setContactNo("");
            setAppointmentDate("");
            setAppointmentTime("");
            setReasonForBooking("");
            setFeedbackRating(0);
          }
        } else {
          Alert.alert("Please fill all the fields");
        }
     
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Appointment already booked for this time slot.");
        setErrorShow(true);
      }else{
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleConfirm = (event, selectedDate) => {
    setOpen(false); // Close the picker
    const formatted = selectedDate.toLocaleDateString("en-US");
    setAppointmentDate(formatted);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {errorShow ? (
          <Error_model
            isVisible={errorShow}
            errorMessage={errorMessage}
            onClose={() => setErrorShow(false)}
          />
        ) : !modalVisible ? (
          <>
            <Text style={styles.header}>Book Your Appointment</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Patient Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#6c757d"
                value={patientName}
                onChangeText={(text) => setPatientName(text)}
              />

              <Text style={styles.label}>Contact No.</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your contact number"
                keyboardType="numeric"
                placeholderTextColor="#6c757d"
                value={contactNo}
                onChangeText={(text) => setContactNo(text)}
              />

              <Text style={styles.label}>Date of Appointment</Text>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Select appointment date"
                  placeholderTextColor="#6c757d"
                  value={appointmentDate}
                  editable={false}
                />
              </TouchableOpacity>
              {open && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleConfirm}
                />
              )}

              <Text style={styles.label}>Time of Appointment</Text>
              <Picker
                selectedValue={appointmentTime}
                style={styles.picker}
                onValueChange={(itemValue) => setAppointmentTime(itemValue)}
              >
                <Picker.Item label="Select Time Slot" value="" />
                <Picker.Item label="9:00 AM" value="9:00 AM" />
                <Picker.Item label="10:00 AM" value="10:00 AM" />
                <Picker.Item label="11:00 AM" value="11:00 AM" />
                <Picker.Item label="12:00 PM" value="12:00 PM" />
                <Picker.Item label="1:00 PM" value="1:00 PM" />
                <Picker.Item label="2:00 PM" value="2:00 PM" />
                <Picker.Item label="3:00 PM" value="3:00 PM" />
                <Picker.Item label="4:00 PM" value="4:00 PM" />
                <Picker.Item label="5:00 PM" value="5:00 PM" />
              </Picker>

              <Text style={styles.label}>Reason for Booking</Text>
              <TextInput
                style={styles.input}
                placeholder="Reason for appointment"
                value={reasonForBooking}
                onChangeText={(text) => setReasonForBooking(text)}
              />

              <Text style={styles.label}>Rate Your Experience</Text>
              <AirbnbRating
                count={5}
                defaultRating={feedbackRating}
                onFinishRating={(rating) => setFeedbackRating(rating)}
                size={20}
                showRating={false}
              />

              {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <Booking_model
            isVisible={modalVisible}
            onClose={handleCloseModal}
            feedbackRating={feedbackRating}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "black",
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color:"#6c757d"
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
