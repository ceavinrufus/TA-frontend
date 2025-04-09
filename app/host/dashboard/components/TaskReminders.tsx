"use client";

import React from "react";
import ClickableCard from "../../components/ClickableCard";
import Link from "next/link";
import ResponsiveIcon from "@/components/icons/ResponsiveIconBuilder";
import { useRouter } from "next/navigation";
import { useHostStore } from "../../store/host-store";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskCardProps {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const TaskCard = ({
  title,
  description,
  linkText,
  linkHref,
}: TaskCardProps) => {
  const router = useRouter();
  return (
    <ClickableCard
      className="p-6 items-start justify-between gap-3 w-[385px]"
      onClick={() => {
        router.replace(linkHref);
      }}
    >
      <div className="flex flex-col justify-start gap-3">
        <p className="host-page-h2-primary-blue !text-red2">{title}</p>
        <p>{description}</p>
      </div>
      <Link className="flex items-center gap-1" href={linkHref}>
        {linkText} <ResponsiveIcon icon="icon-arrow-forward" sizeDesktop={16} />
      </Link>
    </ClickableCard>
  );
};

/**
 * TaskReminders Component
 *
 * A component that displays task reminders for hosts based on their verification and profile completion status.
 * Shows loading skeletons while data is being fetched.
 *
 * @component
 * @example
 * ```tsx
 * <TaskReminders />
 * ```
 *
 * @returns {JSX.Element} A section containing task reminder cards or loading state
 *
 * @dependencies
 * - useHostStore - Custom hook for accessing host data and loading state
 * - ClickableCard - Component for clickable card UI
 * - Skeleton - Component for loading animation
 * - TaskCard - Component for displaying individual task information
 *
 * @remarks
 * The component checks for two types of tasks:
 * 1. Verification task - Shown when host is not verified
 * 2. Profile completion task - Shown when host profile is incomplete
 *
 * If no tasks are present, displays "No tasks to complete" message
 */
const TaskReminders = () => {
  const { host, isLoading } = useHostStore();

  const tasks = [];

  // Add verification task if host is not verified
  if (host) {
    if (!host.is_verified) {
      tasks.push({
        title: "Finish your verification",
        description:
          "Complete your verification process to start hosting and earning on our platform.",
        linkText: "To verify",
        linkHref: "/host/verification", // adjust the path as needed
      });
    }

    // Add profile completion task if profile is not complete
    if (!host.is_profile_complete) {
      tasks.push({
        title: "Complete your host profile",
        description:
          "Fill in your profile details to increase trust and attract more guests.",
        linkText: "To review",
        linkHref: "/host/profile", // adjust the path as needed
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="host-page-h2-primary-blue">Task Reminders</h2>
      <div className="flex gap-6">
        {isLoading ? (
          Array(2)
            .fill(null)
            .map((_, index) => (
              <ClickableCard
                key={index}
                onClick={() => {}}
                className="items-start p-6 rounded-lg w-[385px]"
              >
                <Skeleton className="h-6 w-48 mb-3 rounded"></Skeleton>
                <Skeleton className="h-4 w-72 rounded"></Skeleton>
                <Skeleton className="h-4 w-24 mt-3 rounded"></Skeleton>
              </ClickableCard>
            ))
        ) : tasks.length !== 0 ? (
          tasks.map((task, index) => (
            <TaskCard
              key={index}
              title={task.title}
              description={task.description}
              linkText={task.linkText}
              linkHref={task.linkHref}
            />
          ))
        ) : (
          <p>No tasks to complete.</p>
        )}
      </div>
    </div>
  );
};

export default TaskReminders;
