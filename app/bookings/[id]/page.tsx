import React, { Suspense } from "react";
import BookingDetailsPage from "./booking-details.page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <Suspense>
      <BookingDetailsPage id={id} />
    </Suspense>
  );
}
