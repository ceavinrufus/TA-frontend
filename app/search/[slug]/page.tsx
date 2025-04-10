import React, { Suspense } from "react";
import ListingDetailPage from "./listing-detail.page";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <Suspense>
      <ListingDetailPage slug={slug} />
    </Suspense>
  );
}
