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
} from "react-native";

export default function Investments() {
    return (
        <SafeAreaView>
            <KeyboardAvoidingView>
                <ScrollView>
                    <View>
                        <View>
                            <Text>Investments</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}