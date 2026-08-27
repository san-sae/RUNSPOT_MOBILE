import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";

import { Button } from "../common/button/Button";

import { EmptyState } from "./EmptyState";
import { MyPageCard } from "./MyPageCard";
import { styles } from "./styles/Sections.styles";

import ChatIcon from "@/src/assets/icon/my-page/chat.svg";
import CheckIcon from "@/src/assets/icon/my-page/check.svg";
import MannerIcon from "@/src/assets/icon/my-page/manner.svg";
import Chip from "@/src/components/common/chip";
import { colors } from "@/src/constants/index";
import { AGEGROUPMAP, GENDER_MAP } from "@/src/constants/mappings";
import {
  CreatedRunning,
  RunningStatus,
  UserProfile,
} from "@/src/types/api/mypage";
import {
  AppliedRunningsResponse,
  RecentRunningsResponse,
} from "@/src/types/api/mypage";
import { formatDate } from "@/src/utils/date";

export interface SectionsProps<T> {
  data?: T;
  isFetching: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export const ProfileSection = ({
  data: profile,
  isFetching,
  isError,
  onRetry,
}: SectionsProps<UserProfile>) => {
  if (isFetching && !profile) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>내 정보를 불러오는 중</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>
        <Button variant="outline" size="sm" onPress={onRetry}>
          다시 시도
        </Button>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          {/* 회색 기본 아바타 */}
          <View style={[styles.avatar, { backgroundColor: colors.gray300 }]}>
            <Text style={styles.avatarText}>?</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>알 수 없는 사용자</Text>
            <Text style={styles.demographics}>
              사용자 정보를 확인할 수 없습니다
            </Text>
          </View>
        </View>

        {/* 하단 통계는 모두 0으로 기본값 처리 */}
        <View style={styles.statsGrid}>
          <StatBox label="주간 러닝" value="평균 0회" />
          <StatBox label="평균 페이스" value="-" />
          <StatBox label="총 러닝" value="0회" />
          <StatBox label="누적 거리" value="0km" />
        </View>
      </View>
    );
  }

  // 매핑 데이터에 없으면 원본 데이터를 그대로 보여줌
  const displayGender = GENDER_MAP[profile.gender] || profile.gender;
  const displayAge = AGEGROUPMAP[profile.ageGroup] || profile.ageGroup;

  // 이름이 없을 경우 에러 처리
  const displayName = profile.name || "런닝메이트";
  const avatarChar = displayName.charAt(0);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarChar}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text
            style={styles.demographics}
          >{`${displayAge} · ${displayGender}`}</Text>
          <Chip
            icon={<MannerIcon width={14} height={14} />}
            label={`매너온도 ${profile.mannerTemp ?? 36.5}°C`}
            color="red"
            size="small"
            style={styles.mannerChip}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatBox
          label="주간 러닝"
          value={`평균 ${profile.weeklyRuns ?? 0}회`}
        />
        <StatBox label="평균 페이스" value={profile.avgPaceMinPerKm ?? "-"} />
        <StatBox label="총 러닝" value={`${profile.totalRuns ?? 0}회`} />
        <StatBox
          label="누적 거리"
          value={`${profile.totalDistanceKm ?? 0}km`}
        />
      </View>
    </View>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const getRunStatusText = (run: CreatedRunning) => {
  switch (run.status) {
    case "OPEN":
      return `모집 중 (${run.currentParticipants}/${run.capacity}명)`;
    case "CLOSED":
      return "모집 마감";
    case "IN_PROGRESS":
      return "러닝 진행 중";
    case "FINISHED":
      return "러닝 종료 (평가 대기)";
    default:
      return "";
  }
};

export const CreatedRunsSection = ({
  data: runs = [],
  isFetching,
  isError,
  onRetry,
}: SectionsProps<CreatedRunning[]>) => {
  const router = useRouter();

  const handleManageRun = (
    sessionId: number,
    runTitle: string,
    status: RunningStatus,
  ) => {
    switch (status) {
      case "OPEN":
        // 모집 중인 상태: 참여자 관리 페이지
        router.push({
          pathname: "/manage-participants",
          params: { id: sessionId, title: runTitle },
        });
        break;

      case "CLOSED":
        // 마감된 상태: 출석 페이지
        router.push({
          pathname: "/attendance",
          params: { id: sessionId, title: runTitle },
        });
        break;

      case "IN_PROGRESS":
        // 러닝 진행 중인 상태: 출석 체크/관리 페이지
        router.push({
          pathname: "/manage-attendance",
          params: { id: sessionId, title: runTitle },
        });
        break;

      default:
        console.warn("알 수 없는 러닝 상태입니다:", status);
        break;
    }
  };

  const handleRateMembers = (sessionId: number) => {
    router.push({
      pathname: "/member-rating",
      params: { sessionId },
    });
  };

  if (isFetching && runs.length === 0) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>내가 만든 러닝을 불러오는 중</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>
        <Button variant="outline" size="sm" onPress={onRetry}>
          다시 시도
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>내가 만든 러닝</Text>
      {runs.length === 0 ? (
        <EmptyState text="생성한 러닝이 없습니다." />
      ) : (
        <View style={styles.cardListWrapper}>
          {runs.map((run) => (
            <MyPageCard
              key={run.id}
              title={run.title}
              subtitle={getRunStatusText(run)}
              rightElement={
                run.status === "FINISHED" ? (
                  <Button
                    variant="outlinePrimary"
                    size="sm"
                    onPress={() => handleRateMembers(run.id)}
                  >
                    평가하기
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={() =>
                      handleManageRun(run.id, run.title, run.status)
                    }
                  >
                    관리
                  </Button>
                )
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const AppliedRunsSection = ({
  data,
  isFetching,
  isError,
  onRetry,
}: SectionsProps<AppliedRunningsResponse>) => {
  const router = useRouter();
  const runs = data?.appliedRunnings || [];

  const handleOpenChat = (runningId: number) => {
    router.push(`/chat/group/${runningId}`);
  };

  if (isFetching && runs.length === 0) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>최근 신청 내역을 불러오는 중</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>
        <Button variant="outline" size="sm" onPress={onRetry}>
          다시 시도
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>신청한 러닝</Text>
      {runs.length === 0 ? (
        <EmptyState text="신청한 러닝이 없습니다." />
      ) : (
        <View style={styles.cardListWrapper}>
          {runs.map((run) => (
            <MyPageCard
              key={run.runningId}
              title={run.title}
              subtitle={`${formatDate(run.date)} ${run.time}`}
              rightElement={
                <View style={styles.rightActionStack}>
                  <Chip
                    label={
                      run.approveStatus === "APPROVED"
                        ? "참여 확정"
                        : "승인 대기"
                    }
                    color={
                      run.approveStatus === "APPROVED" ? "success" : "warning"
                    }
                    size="small"
                  />

                  {run.chatEnabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      wrapperStyle={{
                        alignSelf: "stretch",
                        alignItems: "center",
                      }}
                      onPress={() => handleOpenChat(run.runningId)}
                    >
                      <ChatIcon
                        width={16}
                        height={16}
                        color={colors.textSecondary}
                      />
                    </Button>
                  )}
                </View>
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const RecentHistorySection = ({
  data,
  isFetching,
  isError,
  onRetry,
}: SectionsProps<RecentRunningsResponse>) => {
  const runs = data?.recentRunnings || [];
  const router = useRouter();

  const handleRateHost = (sessionId: number) => {
    router.push({
      pathname: "/host-rating",
      params: { sessionId },
    });
  };

  if (isFetching && runs.length === 0) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>최근 참여 내역을 불러오는 중</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.sectionContainer, styles.centerBox]}>
        <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>
        <Button variant="outline" size="sm" onPress={onRetry}>
          다시 시도
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>최근 참여 내역</Text>
      {runs.length === 0 ? (
        <EmptyState text="최근 참여 내역이 없습니다." />
      ) : (
        <View style={styles.cardListWrapper}>
          {runs.map((run) => (
            <MyPageCard
              key={run.runningId}
              title={run.title}
              subtitle={
                run.resultStatus === "DONE" && (
                  <View style={styles.subtitleWithIcon}>
                    <CheckIcon width={14} height={14} color={colors.success} />
                    <Text style={styles.subtitleText}>완료</Text>
                  </View>
                )
              }
              leftElement={
                <View style={styles.dateBox}>
                  <Text style={styles.dateBoxText}>{formatDate(run.date)}</Text>
                </View>
              }
              rightElement={
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => handleRateHost(run.runningId)}
                >
                  평가하기
                </Button>
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};
