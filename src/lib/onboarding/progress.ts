import { db } from "@/lib/db/client";
import { UserOnboardingProgress, OnboardingStep } from "./steps";

export class OnboardingProgressService {
  async getUserProgress(
    userId: string,
    tenantId: string
  ): Promise<UserOnboardingProgress | null> {
    try {
      const progress = await db.content.findFirst({
        where: {
          type: "onboarding_progress",
          authorId: userId,
          tenantId,
        },
      });

      if (!progress) {
        return null;
      }

      return JSON.parse(progress.content);
    } catch (error) {
      console.error("Get user onboarding progress error:", error);
      return null;
    }
  }

  async createUserProgress(
    userId: string,
    tenantId: string,
    flowId: string,
    currentStep: string
  ): Promise<UserOnboardingProgress> {
    const progress: UserOnboardingProgress = {
      userId,
      tenantId,
      currentStep,
      completedSteps: [],
      skippedSteps: [],
      startedAt: new Date(),
    };

    try {
      await db.content.create({
        data: {
          title: `Onboarding Progress - ${userId}`,
          slug: `onboarding-progress-${userId}`,
          type: "onboarding_progress",
          content: JSON.stringify(progress),
          metadata: {
            description: `User onboarding progress for ${userId}`,
          },
          tenantId,
          authorId: userId,
        },
      });

      return progress;
    } catch (error) {
      console.error("Create user onboarding progress error:", error);
      throw new Error("Failed to create onboarding progress");
    }
  }

  async updateUserProgress(
    userId: string,
    tenantId: string,
    updates: Partial<UserOnboardingProgress>
  ): Promise<UserOnboardingProgress | null> {
    try {
      const existing = await db.content.findFirst({
        where: {
          type: "onboarding_progress",
          authorId: userId,
          tenantId,
        },
      });

      if (!existing) {
        return null;
      }

      const currentProgress = JSON.parse(existing.content);
      const updatedProgress = { ...currentProgress, ...updates };

      await db.content.update({
        where: { id: existing.id },
        data: {
          content: JSON.stringify(updatedProgress),
          updatedAt: new Date(),
        },
      });

      return updatedProgress;
    } catch (error) {
      console.error("Update user onboarding progress error:", error);
      return null;
    }
  }

  async completeStep(
    userId: string,
    tenantId: string,
    stepId: string
  ): Promise<UserOnboardingProgress | null> {
    const progress = await this.getUserProgress(userId, tenantId);
    if (!progress) {
      return null;
    }

    if (!progress.completedSteps.includes(stepId)) {
      progress.completedSteps.push(stepId);
    }

    return this.updateUserProgress(userId, tenantId, {
      completedSteps: progress.completedSteps,
    });
  }

  async skipStep(
    userId: string,
    tenantId: string,
    stepId: string
  ): Promise<UserOnboardingProgress | null> {
    const progress = await this.getUserProgress(userId, tenantId);
    if (!progress) {
      return null;
    }

    if (!progress.skippedSteps.includes(stepId)) {
      progress.skippedSteps.push(stepId);
    }

    return this.updateUserProgress(userId, tenantId, {
      skippedSteps: progress.skippedSteps,
    });
  }

  async setCurrentStep(
    userId: string,
    tenantId: string,
    stepId: string
  ): Promise<UserOnboardingProgress | null> {
    return this.updateUserProgress(userId, tenantId, {
      currentStep: stepId,
    });
  }

  async completeOnboarding(
    userId: string,
    tenantId: string
  ): Promise<UserOnboardingProgress | null> {
    return this.updateUserProgress(userId, tenantId, {
      completedAt: new Date(),
    });
  }

  async resetOnboarding(
    userId: string,
    tenantId: string
  ): Promise<UserOnboardingProgress | null> {
    return this.updateUserProgress(userId, tenantId, {
      currentStep: "",
      completedSteps: [],
      skippedSteps: [],
      startedAt: new Date(),
      completedAt: undefined,
    });
  }

  async getOnboardingStats(tenantId: string): Promise<{
    totalUsers: number;
    completedUsers: number;
    inProgressUsers: number;
    averageCompletionTime: number;
  }> {
    try {
      const allProgress = await db.content.findMany({
        where: {
          type: "onboarding_progress",
          tenantId,
        },
      });

      const totalUsers = allProgress.length;
      const completedUsers = allProgress.filter(
        (progress) => JSON.parse(progress.content).completedAt
      ).length;
      const inProgressUsers = totalUsers - completedUsers;

      const completedProgress = allProgress.filter(
        (progress) => JSON.parse(progress.content).completedAt
      );

      const averageCompletionTime =
        completedProgress.length > 0
          ? completedProgress.reduce((acc, progress) => {
              const data = JSON.parse(progress.content);
              const startTime = new Date(data.startedAt).getTime();
              const endTime = new Date(data.completedAt).getTime();
              return acc + (endTime - startTime);
            }, 0) /
            completedProgress.length /
            (1000 * 60 * 60) // Convert to hours
          : 0;

      return {
        totalUsers,
        completedUsers,
        inProgressUsers,
        averageCompletionTime,
      };
    } catch (error) {
      console.error("Get onboarding stats error:", error);
      return {
        totalUsers: 0,
        completedUsers: 0,
        inProgressUsers: 0,
        averageCompletionTime: 0,
      };
    }
  }
}
