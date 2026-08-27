import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { useState, useCallback } from "react";
import { Alert } from "react-native";

export const useChatInput = () => {
  const [inputText, setInputText] = useState("");
  const { showActionSheetWithOptions } = useActionSheet();

  const handleAttachPress = useCallback(() => {
    const options = ["카메라로 촬영", "앨범에서 선택", "취소"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: {
            // 카메라 촬영
            const permissionResult =
              await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
              Alert.alert("권한 필요", "카메라 접근 권한이 필요합니다.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              quality: 0.7,
            });

            if (!result.canceled) {
              // eslint-disable-next-line no-console
              console.log("촬영된 사진 URI:", result.assets[0].uri);
              // TODO: [API] 이미지 업로드
              Alert.alert(
                "알림",
                "사진 촬영 완료!\n(서버 업로드 API 연동 필요)",
              );
            }
            break;
          }

          case 1: {
            // 앨범 선택
            const permissionResult =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
              Alert.alert("권한 필요", "사진첩 접근 권한이 필요합니다.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              quality: 0.7,
            });

            if (!result.canceled) {
              // eslint-disable-next-line no-console
              console.log("선택된 사진 URI:", result.assets[0].uri);
              // TODO: [API] 이미지 업로드
              Alert.alert(
                "알림",
                "사진 선택 완료!\n(서버 업로드 API 연동 필요)",
              );
            }
            break;
          }

          default:
            break;
        }
      },
    );
  }, [showActionSheetWithOptions]);

  return {
    inputText,
    setInputText,
    handleAttachPress,
  };
};
