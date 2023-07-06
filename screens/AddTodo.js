import * as React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlice";
import * as Notifications from "expo-notifications";
import SetTheme from "../utils/ThemeManager";

export default function AddTodo() {
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState(new Date(Date.now()));
  const [isToday, setIsToday] = React.useState(false);
  const [withAlert, setWithAlert] = React.useState(false);
  const [show, setShow] = React.useState(false);
  // const [listTodos, setListTodos] = React.useState([]);
  const listTodos = useSelector((state) => state.todos.todos);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const addTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: name,
      hour: isToday
        ? date.toISOString()
        : new Date(date).getTime() + 24 * 60 * 60 * 1000,
      isToday: isToday,
      isCompleted: false,
    };
    try {
      await AsyncStorage.setItem(
        "Todos",
        JSON.stringify([...listTodos, newTodo])
      );
      dispatch(addTodoReducer(newTodo));
      console.log("Todo saved correctly");
      if (withAlert) {
        await scheduleTodoNotification(newTodo);
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const scheduleTodoNotification = async (todo) => {
    // set trigger time to todo.hour if todo.isToday === true else set trigger time to todo.hour + 24 hours
    // const trigger = todo.isToday ? todo.hour : new Date(todo.hour).getTime() + 24 * 60 * 60 * 1000;
    const trigger = new Date(todo.hour);
    const triggerTime = new Date(date).getTime() - 11 * 60 * 1000;
    const triggerTimeSecondary = new Date(date).getTime() - 60 * 60 * 1000;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Do not forget to have your ${todo.text}`,
          body: todo.text,
        },
        trigger,
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Do not forget to have your ${todo.text}`,
          body: todo.text,
        },
        trigger: triggerTime,
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Do not forget to have your ${todo.text}`,
          body: todo.text,
        },
        trigger: triggerTimeSecondary,
      });
      console.log("Notification scheduled");
    } catch (e) {
      alert("The notification failed to schedule, make sure the hour is valid");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (Platform.OS === "android") {
      setShow(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add a Reminder</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Task"
            placeholderTextColor="#00000030"
            onChangeText={(text) => {
              setName(text);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={{ display: "flex" }}>
            <Text style={styles.inputTitle}>Hour</Text>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={styles.selectButton}
            >
              <Text
                style={{
                  color: SetTheme.lightTheme.buttonColor,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
              >
                Select Date
              </Text>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              value={date}
              mode={"time"}
              is24Hour={true}
              onChange={onChange}
              style={{ width: "80%" }}
            />
          )}
        </View>
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: 0, alignItems: "center" },
          ]}
        >
          <View>
            <Text style={styles.inputTitle}>Today</Text>
            <Text
              style={{
                color: "#00000040",
                fontSize: 12,
                maxWidth: "84%",
                paddingBottom: 10,
              }}
            >
              If you disable today, the task will be considered as tomorrow
            </Text>
          </View>
          <Switch
            trackColor={{
              true: SetTheme.lightTheme.switchOnColor,
              false: SetTheme.lightTheme.switchOffColor,
            }}
            value={isToday}
            onValueChange={(value) => {
              setIsToday(value);
            }}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: 0, alignItems: "center" },
          ]}
        >
          <View>
            <Text style={styles.inputTitle}>Alert</Text>
            <Text
              style={{
                color: "#00000040",
                fontSize: 12,
                maxWidth: "85%",
                paddingBottom: 10,
              }}
            >
              You will receive an alert at the time you set for this reminder
            </Text>
          </View>
          <Switch
            trackColor={{
              true: SetTheme.lightTheme.switchOnColor,
              false: SetTheme.lightTheme.switchOffColor,
            }}
            value={withAlert}
            onValueChange={(value) => {
              setWithAlert(value);
            }}
          />
        </View>

        <TouchableOpacity onPress={addTodo} style={styles.button}>
          <Text style={{ color: SetTheme.lightTheme.buttonColor }}>Done</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
    color: SetTheme.lightTheme.textColor,
  },
  textInput: {
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    width: "80%",
    backgroundColor: SetTheme.lightTheme.inputBackground,
  },
  container: {
    flex: 1,
    backgroundColor: SetTheme.lightTheme.containerBackground,
    paddingHorizontal: 30,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    color: SetTheme.lightTheme.textColor,
  },
  inputContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 30,
  },
  button: {
    marginTop: 30,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SetTheme.lightTheme.buttonBackground,
    height: 46,
    borderRadius: 11,
  },
  selectButton: {
    backgroundColor: SetTheme.lightTheme.buttonBackground,
    marginTop: 20,
    borderRadius: 11,
  },
});
