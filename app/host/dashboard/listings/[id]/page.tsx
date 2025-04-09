import React, { Suspense } from "react";
import EditListingPage from "./edit-listing.page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <Suspense>
      <EditListingPage id={id} />
    </Suspense>
  );
}
