import React from "react";
import CreateListingProgressBar from "./components/CreateListingProgressBar";

/**
 * CreateListingLayout component
 *
 * This component serves as a layout wrapper for the create listing page.
 * It provides a consistent structure and styling for the page, including
 * a progress bar and a main content area for child components.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 *
 * @returns {JSX.Element} The rendered layout component.
 */
const CreateListingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CreateListingProgressBar />
      {children}
    </>
  );
};

export default CreateListingLayout;
