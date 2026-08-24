import type {
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/src/types/api/createSession";

export const createSession = async (
  _requestBody: CreateSessionRequest,
): Promise<CreateSessionResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: 1,
    hostUserId: 1,
    status: "OPEN",
    title: "한강 모닝 러닝",
    runType: "LSD",
    locationName: "여의도 한강공원",
    locationX: 126.9347,
    locationY: 37.5285,
    routePolyline: [
      { x: 126.9347, y: 37.5285 },
      { x: 126.935, y: 37.529 },
    ],
    targetDistanceKm: 5.0,
    avgPaceSec: 360,
    startAt: "2026-02-10T07:00:00",
    capacity: 10,
    genderPolicy: "MIXED",
    markers: [
      {
        id: 1,
        x: 126.9347,
        y: 37.5285,
        title: "반환점",
        description: "여기서 돌면서 잠시 휴식 예정입니다.",
      },
    ],
    description: "열심히 하실 분들을 원합니다.",
  };
};
