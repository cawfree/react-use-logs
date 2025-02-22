import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Logs, { useLogs, useLogLevelContext } from "react-use-logs";

function Levels() {
  const logs = useLogs();
  const { levels } = useLogLevelContext();
  return (
    <View>
      {levels.map((level: string, i: number) => (
        <TouchableOpacity
          key={i}
          onPress={(e) => logs[level]("Hello", "World", e)}
        >
          <Text>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.levels}>
        <Text style={styles.title}>Custom:</Text>
        <Logs levels={["good", "bad", "ugly"]} level="good">
          <Levels />
        </Logs>
      </View>

      <Logs>
        <View style={styles.levels}>
          <Text style={styles.title}>Defaults:</Text>
          <Levels />
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Disabled:</Text>
          <Logs disabled levels={["info"]}>
            <Levels />
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Info and up:</Text>
          <Logs level="info">
            <Levels />
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Only Error:</Text>
          <Logs level="error">
            <Levels />
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Custom Middleware:</Text>
          <Logs
            middleware={[
              async (level, [...messages], next) => {
                alert(level);
                next();
              },
            ]}
          >
            <Levels />
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Custom (Merged):</Text>
          <Logs levels={["good", "bad", "ugly"]}>
            <Levels />
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Disabled state inheritance:</Text>
          <Logs disabled>
            <Logs disabled={false}>
              <Levels />
            </Logs>
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Level inheritance:</Text>
          <Logs level="warn">
            <Logs level="trace">
              <Levels />
            </Logs>
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Disabled state inheritance (non-strict):</Text>
          <Logs disabled strict={false}>
            <Logs disabled={false}>
              <Levels />
            </Logs>
          </Logs>
        </View>
        <View style={styles.levels}>
          <Text style={styles.title}>Level inheritance:</Text>
          <Logs level="warn" strict={false}>
            <Logs level="trace">
              <Levels />
            </Logs>
          </Logs>
        </View>
      </Logs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  levels: {
    flexDirection: "column",
    padding: 10,
  },
  title: { fontWeight: "bold" },
});
