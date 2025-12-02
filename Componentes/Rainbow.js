import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { supabase } from "../Supabase";
export default function Rainbow({ children, style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const color = anim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      "#00FFF0",
      "#008CFF",
      "#7D00FF",
      "#FF00A8",
      "#FFB800",
      "#00FFF0",
    ],
  });

  return (
    <Animated.Text style={[{ color, fontWeight: "bold" }, style]}>
      {children}
    </Animated.Text>
  );
}
