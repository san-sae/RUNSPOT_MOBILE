import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { hydrateAccessToken, hydrateRefreshToken } from "@/src/api/authToken";
import { setUnauthorizedHandler } from "@/src/api/axiosInstance";
import { LoadingScreen } from "@/src/components/common/loading/LoadingScreen";
import { StackHeaderBack } from "@/src/components/header";
import { colors } from "@/src/constants";
import { usePushNotifications } from "@/src/hooks/notification/usePushNotifications";
import {
  handleNotificationRouting,
  NotificationRoutePayload,
  parseString,
  parseId,
} from "@/src/utils/notificationRouting";

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authReady, setAuthReady] = useState(false);

  usePushNotifications();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.clear();
      router.replace("/(auth)/login");
    });
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const [token] = await Promise.all([
          hydrateAccessToken(),
          hydrateRefreshToken(),
        ]);
        if (!isMounted) return;

        const isAuthRoute = segments[0] === "(auth)";
        if (!token && !isAuthRoute) {
          router.replace("/(auth)/login");
        }
      } finally {
        if (isMounted) {
          setAuthReady(true);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!authReady) return;

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data && typeof data.type === "string") {
          const payload: NotificationRoutePayload = {
            type: data.type,
            relatedId: parseId(data.relatedId),
            title: parseString(data.title),
            message: parseString(data.message),
          };

          handleNotificationRouting(payload, router);
        }
      });
    return () => {
      responseListener.remove();
    };
  }, [authReady, router]);

  if (!authReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                flex: 1,
                backgroundColor: colors.bgSecondary,
              },
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
            <Stack.Screen
              name="create-session"
              options={{
                headerShown: true,
                title: "러닝 모임 만들기",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen name="search-result" />
            <Stack.Screen
              name="session-detail"
              options={{
                headerShown: true,
                title: "상세 정보",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen
              name="manage-participants"
              options={{
                headerShown: true,
                title: "참여자 관리",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen
              name="attendance"
              options={{
                headerShown: true,
                title: "출석 체크",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen
              name="manage-attendance"
              options={{
                headerShown: true,
                title: "참여자 관리",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen
              name="host-rating"
              options={{
                headerShown: true,
                title: "호스트 평가",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen
              name="member-rating"
              options={{
                headerShown: true,
                title: "멤버 평가",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                headerShown: true,
                title: "알림",
                headerLeft: () => <StackHeaderBack />,
              }}
            />
          </Stack>
        </ActionSheetProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
