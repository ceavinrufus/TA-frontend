/**
 * UserAvatar Component
 *
 * A component that generates a unique, deterministic avatar for a user based on their wallet address.
 * Uses the 'boring-avatars' library to create visually appealing, consistent avatars that are
 * tied to the user's wallet address.
 *
 * Features:
 * - Generates unique avatars based on wallet address
 * - Supports multiple avatar styles (marble, beam, pixel, sunset, ring, bauhaus)
 * - Customizable size
 * - Consistent colors across the application
 *
 * @param {Object} avatarProps - Component props
 * @param {string} avatarProps.walletAddress - The user's wallet address used to generate the avatar
 * @param {"marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus"} avatarProps.typeOfAvatar - The style of avatar to generate
 * @param {number} avatarProps.size - The size of the avatar in pixels
 * @returns {JSX.Element} A div containing the generated avatar
 */

import { avatarColors } from "@/lib/ui/ui-utils";
import Avatar from "boring-avatars";

export interface AvatarProps {
  walletAddress: string;
  typeOfAvatar: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
  size: number;
}

/// This component renders the boring avatar for a user based on their wallet address
export function UserAvatar(avatarProps: AvatarProps) {
  const size = avatarProps.size;
  const height = `h-[${size}]`;
  const width = `w-[${size}]`;
  return (
    <div
      className={`overflow-hidden ${height} ${width} border-[1px] border-white rounded-full`}
    >
      <Avatar
        name={avatarProps.walletAddress}
        variant={avatarProps.typeOfAvatar}
        colors={avatarColors}
        size={avatarProps.size}
      />
    </div>
  );
}
