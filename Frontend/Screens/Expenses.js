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

export default function Expenses() {
    return (
        <SafeAreaView>
            <KeyboardAvoidingView>
                <ScrollView>
                    <View>
                        <View>
                            <TouchableOpacity onPress={() => alert("New Expenses")}>
                                <Text>New Expenses</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text>Monthly Budget: 69420</Text>
                            <Text>Monthly Expenses: 69696</Text>
                        </View>
                        <View>
                            <Text>Important
                                <TouchableOpacity onPress={() => alert("Important Add")}>
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </Text>
                            <Text>Food
                                <TouchableOpacity onPress={() => alert("Food Add")}>
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </Text>
                            <Text>Others
                                <TouchableOpacity onPress={() => alert("Others Add")}>
                                    <Text>+</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => alert("Calculate Expenses")}>
                                <Text>Calculate Expenses</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}