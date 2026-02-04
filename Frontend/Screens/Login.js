import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
    KeyboardAvoidingView,
    ScrollView,
    View, 
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    Pressable,
    Image,
} from "react-native";

export default function Login() {
    return (
        <SafeAreaView>
            <KeyboardAvoidingView>
                <ScrollView>
                    <View>
                        {/* Login Inputs */}
                        <View>
                            <Text>Login</Text>
                            <Text>Username</Text>
                            <TextInput placeholder="Username"/>
                            <Text>Password</Text>
                            <TextInput placeholder="Password" secureTextEntry/>
                            <TouchableOpacity onPress={() => alert("Login")}>
                                <Text>Login</Text>
                            </TouchableOpacity>
                            <Text>Don't have an account yet?
                                <Pressable onPress={() => alert("Sign Up")}>
                                    <Text>Sign Up</Text>
                                </Pressable>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}