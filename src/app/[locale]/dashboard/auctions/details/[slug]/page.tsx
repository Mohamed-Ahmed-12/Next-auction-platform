"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { Gallery, Item } from "react-photoswipe-gallery";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "photoswipe/dist/photoswipe.css";

// UI Framework (Flowbite)
import {
  Tabs, TabItem, Spinner, Card, Avatar, Badge
} from "flowbite-react";

// Icons
import {
  HiInformationCircle, HiChartBar, HiClipboardList,
  HiTrendingUp, HiUsers, HiCurrencyDollar, HiCheckCircle,
  HiOutlineClock, HiTruck, HiReceiptTax
} from "react-icons/hi";
import { HiTrophy } from "react-icons/hi2";
import { GiTrophyCup } from "react-icons/gi";

// Data & Table
import { AgGridReact } from "ag-grid-react";
import { useFetch } from "@/hooks/useFetcher";
import { Auction, AuctionImage } from "@/types/main";
import { bidColumns } from "@/schemas/tableSchemas/bidSchemas";

// Shared Logic & Components
import { formatTimestamp } from "@/helpers/dates";
import PageHeader from "@/components/dashboard/PageHeader";
import AuctionStatusBadge from "@/components/common/AuctionStatusBadge";
import { UniversalExport } from "@/components/dashboard/UniversalExport";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import AuctionGallery from "@/components/auction/AuctionGallery";

/**
 * MAIN COMPONENT: AuctionFullDetails
 * Orchestrates data fetching and tabbed layout
 */
export default function AuctionFullDetails() {
  const { slug } = useParams();
  const locale = useLocale();
  const t = useTranslations("AuctionDetails");

  const { data, error, loading } = useFetch<Auction>(`auction/${slug}`);

  const gridConfig = useMemo(() => ({
    defaultColDef: {
      flex: 1,
      minWidth: 120,
      resizable: true,
      sortable: true,
      filter: true
    },
    rowSelection: { mode: 'multiRow' as const },
  }), []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="xl" color="indigo" />
      <p className="text-gray-500 font-medium animate-pulse italic">Loading Bidroom data...</p>
    </div>
  );

  if (error || !data) return (
    <div className="text-center my-20 p-10 bg-red-50 rounded-3xl border border-red-100 mx-auto max-w-lg shadow-xl shadow-red-100/50">
      <h2 className="text-red-700 font-bold text-xl mb-2">Access Error</h2>
      <p className="text-red-500/80">{error || "This auction listing could not be found."}</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] animate-in fade-in duration-700">
      <PageHeader
        title={data.title}
        description={`Ref: BID-${data.id} • Started: ${new Date(data.start_date).toLocaleDateString()}`}
        breadcrumbs={[
          { label: 'Auctions', href: '/dashboard/auctions' },
          { label: 'Management' }
        ]}
      >
        <AuctionStatusBadge stat={data.status} />
      </PageHeader>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <Tabs aria-label="Auction Control Center" variant="underline" className="px-6 pt-2 border-b border-gray-100">
          <TabItem active title="General Details" icon={HiInformationCircle}>
            <div className="animate-in slide-in-from-bottom-2 duration-500">
              <AuctionDetailsTab data={data} locale={locale} />
            </div>
          </TabItem>

          <TabItem title="Bidding History" icon={HiChartBar}>
            <div className="animate-in slide-in-from-bottom-2 duration-500">
              <BiddingHistoryTab bids={data.bids} gridConfig={gridConfig} locale={locale} />
            </div>
          </TabItem>

          <TabItem title="Auction Result" icon={HiTrophy}>
            <div className="animate-in slide-in-from-bottom-2 duration-500">
              <AuctionResultTab data={data} />
            </div>
          </TabItem>

          <TabItem title="Audit Log" icon={HiClipboardList}>
            <div className="p-20 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center">
                <HiClipboardList size={32} />
              </div>
              <p className="text-gray-400 font-medium italic">System activity logs are being synchronized...</p>
            </div>
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
}

/**
 * SUB-COMPONENT: General Details
 */
function AuctionDetailsTab({ data, locale }: { data: any; locale: string }) {
  const Property = ({ label, value }: { label: string; value: string }) => (
    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white transition-colors">
      <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
        {label}
      </span>
      <p className="text-gray-900 font-bold mt-1 line-clamp-1">{value || "—"}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
      {/* Left column: Visual assets */}
      <div className="lg:col-span-5 space-y-6">
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">
          Visual Assets
        </h3>
        <AuctionGallery images={data.images} />

        {/* Description */}
        <div className="pt-2">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Listing Description
          </h3>
          <div
            className="text-gray-600 text-sm leading-relaxed prose prose-indigo max-w-full"
            dangerouslySetInnerHTML={{ __html: data.desc }}
          />
        </div>
      </div>

      {/* Right column: Metadata */}
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
        <h3 className="col-span-full text-xs font-black text-indigo-600 uppercase tracking-widest">
          Core Metadata
        </h3>
        <Property label="Auction Title" value={data.title} />
        <Property label="Category" value={data.category?.title} />
        <Property label="Start Price" value={`${data.start_price} USD`} />
        <Property label="Reserve Price" value={`${data.reserve_price || "None"} USD`} />
        <Property label="Start Date" value={formatTimestamp(data.start_date, locale)} />
        <Property label="End Date" value={formatTimestamp(data.end_date, locale)} />
      </div>
    </div>
  );
}



/**
 * SUB-COMPONENT: Bidding History
 */
function BiddingHistoryTab({ bids, gridConfig, locale }: any) {
  const Stat = ({ label, value, icon: Icon, color }: any) => (
    <Card className="shadow-none border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="High Bid" value={`$${bids[0]?.amount || 0}`} icon={HiCurrencyDollar} color="green" />
        <Stat label="Total Bids" value={bids.length} icon={HiTrendingUp} color="blue" />
        <Stat label="Unique Bidders" value="20" icon={HiUsers} color="indigo" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
          <h4 className="font-bold text-gray-700">Detailed Bid Log</h4>
          <UniversalExport disabled={bids.length === 0} columns={bidColumns} modelLabel={'main.Bid'} />
        </div>
        <div className="ag-theme-quartz" style={{ height: "450px", width: '100%' }}>
          <AgGridReact
            rowData={bids}
            columnDefs={bidColumns}
            {...gridConfig}
            enableRtl={locale === "ar"}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * SUB-COMPONENT: Auction Result
 */
function AuctionResultTab({ data }: { data: any }) {
  const steps = [
    { label: "Auction Ended", date: "Oct 24", status: "complete", icon: HiCheckCircle },
    { label: "Invoice Sent", date: "Oct 25", status: "complete", icon: HiCheckCircle },
    { label: "Payment Verification", date: "Pending", status: "current", icon: HiOutlineClock },
    { label: "Shipment", date: "-", status: "upcoming", icon: HiTruck },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50/30">
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100/50">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <Badge color="warning" className="mb-3 w-fit">CERTIFIED RESULT</Badge>
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <GiTrophyCup className="text-yellow-300 animate-pulse" />
              Winning Hammer Drop
            </h3>
            <p className="text-emerald-50 opacity-80 mt-2 font-medium max-w-md text-sm">
              The listing has concluded. All legal bids are locked and the transaction sequence has been initiated.
            </p>
          </div>
          <HiCheckCircle className="hidden lg:block opacity-20" size={100} />
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Contract Details</h4>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex items-center gap-4">
                <Avatar rounded size="xl" img="/imgs/avatar.jpg" className="border-2 border-indigo-100 p-1" />
                <div>
                  <h5 className="text-xl font-black text-gray-900 leading-none">Jese Leos</h5>
                  <p className="text-gray-400 text-sm mt-1">Winner (ID: #8821)</p>
                  <div className="flex gap-2 mt-3">
                    <Badge color="indigo">Verified</Badge>
                    <Badge color="success">Funds Ready</Badge>
                  </div>
                </div>
              </div>
              <div className="flex-1 md:border-s md:ps-8 border-gray-100">
                <h6 className="text-[10px] font-black text-gray-400 uppercase mb-2">Shipping Point</h6>
                <p className="text-gray-800 font-bold leading-relaxed">
                  124 El-Haram Street, Giza, EG<br />
                  Postal Code: 12511
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 text-center md:text-left">Transaction Lifecycle</h4>
            <div className="flex flex-col md:flex-row justify-between gap-8 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center text-center z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md transition-all
                    ${step.status === 'complete' ? 'bg-emerald-500 text-white' :
                      step.status === 'current' ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <step.icon size={24} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-tighter ${step.status === 'upcoming' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 mt-1">{step.date}</span>
                  {idx !== steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-gray-50 -z-0" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl ring-1 ring-gray-100 overflow-hidden rounded-3xl">
            <div className="bg-indigo-600 -m-4 p-5 mb-4 text-white">
              <h4 className="font-black uppercase tracking-widest text-xs opacity-80">Final Invoicing</h4>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-400">Hammer Price</span>
                <span className="text-gray-900">$4,200.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-400">Buyer's Premium</span>
                <span className="text-gray-900">$420.00</span>
              </div>
              <hr className="border-dashed border-gray-200" />
              <div className="flex flex-col items-end py-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</span>
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">$4,620.00</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg">
              Confirm Receipt
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
