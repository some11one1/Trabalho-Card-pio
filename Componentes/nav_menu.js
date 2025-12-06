import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import { usarTheme } from "../Context/ThemeContext";
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";




export default function Nav_Menu() {

    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();

    const { tema } = usarTheme();


    const screenName = route.name || "Menu";

    return (
        <View style={[
            styles.menu_nav,
            { backgroundColor: tema.nav, height: height * 0.1, width: width * 1 }
        ]}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.toggleDrawer()}
                    style={[styles.btn_menu, { width: width * 0.08 }]}
                >
                    <Icon name="menu" color={tema.texto} size={34} />
                </TouchableOpacity>

                {/* Usamos a variável de tela segura */}
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ color: tema.texto, fontSize: width * 0.05, marginLeft: 12, fontWeight: "bold", maxWidth: width * 0.5 }}>{screenName}</Text>

            </View>

            <View style={styles.container_img}>
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ color: "#ffffff", fontWeight: "bold", fontSize: width * 0.05, maxWidth: width * 0.7 }}>
                    FEED
                    <Text style={{ color: "#2D7BFF" }}>HUB</Text>
                </Text>
                <Image
                    source={require('../assets/logo.png')}
                    style={{ width: width * 0.1, height: height * 0.05, marginLeft: 10 }}
                    resizeMode='contain'
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
    },

    container_img: {
        flexDirection: 'row',
        alignItems: "center",
        width: 150
    },

    text_white: {
        // Estilos para texto branco, se necessário
    },

    menu_nav: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    btn_menu: {
        marginLeft: 20,
    },
});