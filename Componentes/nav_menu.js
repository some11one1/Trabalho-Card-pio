import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
            
            <TouchableOpacity 
                onPress={() => navigation.toggleDrawer()} 
                style={styles.btn_menu}
            >
                <Icon name="menu" color={tema.texto} size={24} />
            </TouchableOpacity>
            
            {/* Usamos a variável de tela segura */}
            <Text style={{color: tema.texto}}>{screenName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    text_white: {
        // Estilos para texto branco, se necessário
    },

    menu_nav: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        flexDirection: 'row'
    },

    btn_menu: {
        width: 24,
        marginLeft: 20,
        // Adicione um padding horizontal (ex: paddingRight) aqui se precisar de mais espaço após o ícone
    }
});