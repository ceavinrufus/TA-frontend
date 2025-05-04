"use client";

import React, { useState, useEffect } from "react";

import { getAllDispute } from "@/lib/api/dispute";
import DisputeCard from "./DisputeCard";

const AdminDispute = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = (await getAllDispute()) as { data: Dispute[] };
        setDisputes(response.data);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };

    fetchDisputes();
  }, []);

  if (!disputes.length) {
    return <div className="p-4">No disputes found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resolve Disputes</h1>
      <div className="space-y-4">
        {disputes.map((dispute) => (
          <DisputeCard key={dispute.id} initialData={dispute} />
        ))}
      </div>
    </div>
  );
};

export default AdminDispute;
