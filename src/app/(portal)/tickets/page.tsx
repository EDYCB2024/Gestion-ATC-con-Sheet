import React from "react";
import { getCases } from "@/lib/google-sheets";
import { TicketsList } from "@/components/tickets/TicketsList";

export default async function TicketsPage() {
  const allCases = await getCases();
  
  return (
    <TicketsList initialTickets={allCases} />
  );
}
