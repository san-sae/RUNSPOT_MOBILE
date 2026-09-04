import { GetMarkersParams } from "../types/api/search";

export const sessionKeys = {
  all: ["session"] as const,
  detail: (id: number | string) => [...sessionKeys.all, "detail", id] as const,
  summary: (id: number | string) =>
    [...sessionKeys.all, "summary", id] as const,
};

export const attendanceKey = {
  all: (sessionId: number) => ["attendance", sessionId] as const,
};

export const mapKeys = {
  all: ["mapMarkers"] as const,
  markers: (bounds: GetMarkersParams | null) =>
    bounds
      ? ([
          ...mapKeys.all,
          bounds.leftX,
          bounds.leftY,
          bounds.rightX,
          bounds.rightY,
        ] as const)
      : ([...mapKeys.all, "no-bounds"] as const),
};

export const myPageKeys = {
  all: ["myPage"] as const,
  profile: () => [...myPageKeys.all, "profile"] as const,
  createdRuns: () => [...myPageKeys.all, "createdRuns"] as const,
  appliedRuns: () => [...myPageKeys.all, "appliedRuns"] as const,
  historyRuns: () => [...myPageKeys.all, "historyRuns"] as const,
};

export const searchKeys = {
  all: ["sessions", "search"] as const,
  query: (debouncedQuery: string) =>
    [...searchKeys.all, debouncedQuery] as const,
};

export const nearbyKeys = {
  all: ["nearbySessions"] as const,
  location: (x: number, y: number) => [...nearbyKeys.all, x, y] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};
