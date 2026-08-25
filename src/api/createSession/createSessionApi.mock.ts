import type {
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/src/types/api/createSession";
import { PastCourse } from "@/src/types/domain/course";

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

export const MOCK_PAST_COURSES: PastCourse[] = [
  {
    id: 1,
    title: "여의도 한강공원 코스",
    createdAt: "2023-10-25T07:00:00",
    targetDistanceKm: 5.0,
    avgPaceSec: 330,
    locationName: "여의도 한강공원 멀티플라자",
    address: "서울시 영등포구 여의도 한강공원 일대 수변 길",
    routePolyline: [
      { x: 126.93, y: 37.52 },
      { x: 126.94, y: 37.53 },
    ],
    markers: [],
  },
  {
    id: 2,
    title: "올림픽공원 아침 러닝",
    createdAt: "2023-10-20T06:30:00",
    targetDistanceKm: 7.2,
    avgPaceSec: 345,
    locationName: "올림픽공원",
    address: "서울시 송파구 올림픽로 424",
    routePolyline: [
      { x: 127.12, y: 37.51 },
      { x: 127.13, y: 37.52 },
    ],
    markers: [],
  },
];
