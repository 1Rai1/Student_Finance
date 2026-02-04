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

export default function Register() {
    return (
        <SafeAreaView>
            <KeyboardAvoidingView>
                <ScrollView>
                    <View>
                        {/* Register Inputs */}
                        <View>
                            <Text>Register</Text>
                            <Text>Username</Text>
                            <TextInput placeholder="Username"/>
                            <Text>Email</Text>
                            <TextInput placeholder="Email"/>
                            <Text>Password</Text>
                            <TextInput placeholder="Password" secureTextEntry/>
                            <TouchableOpacity onPress={() => alert("Register")}>
                                <Text>Register</Text>
                            </TouchableOpacity>
                            <Text>Already have an account?
                                <Pressable onPress={() => alert("Sign In")}>
                                    <Text>Sign In</Text>
                                </Pressable>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}