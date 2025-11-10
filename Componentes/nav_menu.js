import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import { usarTheme } from "../Context/ThemeContext";
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation, useRoute } from "@react-navigation/native"; 


export default function Nav_Menu() {

    const navigation = useNavigation();
    const route = useRoute();

    const { tema } = usarTheme();

    
    const screenName = route.name || "Menu";

    return (
        <View style={[
            styles.menu_nav, 
            { backgroundColor: tema.nav }
        ]}>
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={() => navigation.toggleDrawer()} 
                    style={styles.btn_menu}
                >
                    <Icon name="menu" color={tema.texto} size={34} />
                </TouchableOpacity>
                
                {/* Usamos a variável de tela segura */}
                <Text style={{color: tema.texto, fontSize: 22, marginLeft: 12, fontWeight: "bold"}}>{screenName}</Text>

            </View>
            
            <View style={styles.container_img}>
                <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 22 }}>
                    FEED
                    <Text style={{ color: "#2D7BFF" }}>HUB</Text>
                </Text>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
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
        width: '100%',
        height: 60,
        
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    btn_menu: {
        width: 24,
        marginLeft: 20,
    },

    logo: {
        width: '30%',
        height: '60%',
    }
});