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
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Expenses() {
    return (
        <SafeAreaView className="h-full bg-red-200">
            <KeyboardAvoidingView>
                <View>
                    <View className="flex-row justify-end ">
                        <TouchableOpacity
                            className="self-end bg-blue-500 p-2 rounded-xl"
                            onPress={() => alert("New Expenses")}>
                            <Text className="text-lg font-bold">New Expenses</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView className="bg-blue-200">
                    <View>
                        <Text className="text-xl font-bold">Monthly Budget: 69420</Text>
                        <Text className="text-xl font-bold">Monthly Expenses: 69696</Text>
                    </View>
                    <View>
                        <Text className="text-lg font-bold">Important
                            <TouchableOpacity onPress={() => alert("Important Add")}>
                                <MaterialCommunityIcons name="plus-thick" size={30} color="black" />
                            </TouchableOpacity>
                        </Text>
                        <Text className="text-lg font-bold">Food
                            <TouchableOpacity onPress={() => alert("Food Add")}>
                                <MaterialCommunityIcons name="plus-thick" size={30} color="black" />
                            </TouchableOpacity>
                        </Text>
                        <Text className="text-lg font-bold mt-2">Others
                            <TouchableOpacity onPress={() => alert("Others Add")}>
                                <MaterialCommunityIcons name="plus-thick" size={30} color="black" />
                            </TouchableOpacity>
                        </Text>
                    </View>
                    <View className="mt-4 mb-8">
                        <TouchableOpacity onPress={() => alert("Calculate Expenses")}>
                            <Text>Calculate Expenses</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}