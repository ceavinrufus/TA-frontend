import React, { Suspense } from "react";
import ReservationDetailsPage from "./reservation-details.page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <Suspense>
      <ReservationDetailsPage id={id} />
    </Suspense>
  );
}
