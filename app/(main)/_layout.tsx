import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

import { colors, fontSizes, fontWeights } from "@/src/constants";

type IonName = ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IonName) {
  return function TabBarIcon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: {
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.bold,
          color: colors.gray600,
        },
        headerShadowVisible: true,
        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: colors.gray200,
          backgroundColor: colors.bg,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarLabel: "홈",
          headerShown: false,
          tabBarIcon: tabIcon("home"),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "탐색",
          tabBarLabel: "탐색",
          tabBarIcon: tabIcon("search"),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "채팅",
          tabBarLabel: "채팅",
          tabBarIcon: tabIcon("chatbubbles-outline"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: "마이",
          tabBarLabel: "마이",
          tabBarIcon: tabIcon("person-outline"),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
