import { cn } from "@/lib/utils";

/**
 * ClickableCard component.
 *
 * This component renders a clickable card that centers its content both
 * horizontally and vertically using `justify-content: center` and `align-items: center`.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.isClicked=false] - Determines the styling of the card when clicked.
 * @param {string} [props.className] - Optional additional class names for the card.
 * @param {React.ReactNode} [props.children] - Optional children elements to be rendered inside the card.
 * @param {() => void} props.onClick - The function to be called when the card is clicked.
 *
 * The rendered clickable card component.
 */
const ClickableCard = ({
  isClicked = false,
  className,
  children,
  onClick,
}: {
  isClicked?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        `px-2 py-4 rounded-2xl flex flex-col justify-center items-center text-blue-950 cursor-pointer`,
        isClicked ? "shadow-button-down bg-[#D2DFFB]" : "shadow-button-up",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ClickableCard;
