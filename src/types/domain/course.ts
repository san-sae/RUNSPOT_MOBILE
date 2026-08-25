import type { RoutePoint } from "../api/session-detail";

import type { Session } from "@/src/types/api/createSession";

type CourseCoreProps = Pick<
  Session,
  "title" | "locationName" | "targetDistanceKm" | "avgPaceSec" | "markers"
>;

export interface PastCourse extends CourseCoreProps {
  id: number;
  createdAt: string;
  address: string;
  thumbnailUrl?: string;
  routePolyline: RoutePoint[];
}
