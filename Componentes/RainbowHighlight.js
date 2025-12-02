import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import { supabase } from "../Supabase";
export default function RainbowHighlight({ children, style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "rgba(0, 150, 255, 0.18)", // azul
      "rgba(255, 0, 150, 0.18)", // rosa
    ],
  });

  return (
    <Animated.View style={[styles.box, { backgroundColor: bgColor }, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
