"use client"
import AuctionCalendar from '@/components/dashboard/Calendar'
import { useFetch } from '@/hooks/useFetcher'
import React from 'react'

export default function AuctionCalendarPage() {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const { data, error, loading } = useFetch<any[]>(
    `dashboard/auctions-bydate/?date=${date}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading calendar data.</div>;
  if (!data) return <div>No data available.</div>;

  // Transform backend data into calendar event format
  const events = data.map(ev => ({
    title: `${ev.title.slice(0, 20)}.. (${ev.type})`,
    start: new Date(ev.start_date),
    end: new Date(ev.end_date),
    type: ev.type
  }));

  return (
    <>
      <h1 className="text-indigo-600 font-bold text-2xl">Auction Calendar</h1>
      <AuctionCalendar events={events} />
    </>
  );
}
