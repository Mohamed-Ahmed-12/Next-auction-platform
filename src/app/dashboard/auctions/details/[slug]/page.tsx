"use client";
import { CSVExport } from "@/components/dashboard/CSVExport";
import PageHeader from "@/components/dashboard/PageHeader";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { AllCommunityModule, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';
import AuctionStatusBadge from "@/components/common/AuctionStatusBadge";
import { formatTimestamp } from "@/helpers/dates";
import { useFetch } from "@/hooks/useFetcher";
import { Auction } from "@/types/main";
import { Avatar, Badge, Card, FloatingLabel, TabItem, Tabs } from "flowbite-react";
import { useParams } from "next/navigation"
import { BsPeople } from "react-icons/bs";
import { PiPulse } from "react-icons/pi";
import { RiAuctionLine } from "react-icons/ri";
import { bidColumns } from "@/schemas/tableSchemas/bidSchemas";
import { GiTrophyCup } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import { FaCheckCircle, FaRegStopCircle } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AuctionFullDetails() {
    const { slug } = useParams();
    const { data, error, loading } = useFetch<Auction>(`auction/${slug}`);
    console.log(data)
    // --- AG-GRID CONFIGURATION MEMOS ---

    const defaultColDef = useMemo(() => ({
        editable: true, // Enable editing on all cells
    }), []);

    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    if (loading) {
        return <h2 className="text-center my-20">loading...</h2>
    }
    if (error) {
        return <h2 className="text-center my-20 text-red-600">Error: {error}</h2>
    }
    if (!data) {
        return <h2 className="text-center my-20">No Auction available.</h2>;
    }
    return (
        <>
            <div>
                <h2 className="font-bold text-3xl mb-4">{data.title}</h2>
                <div className="flex items-center space-x-5">
                    <p className="text-gray-500 text-lg">Auction ID: #{data.id}</p>
                    <AuctionStatusBadge stat={'live'} />
                </div>

            </div>
            <Tabs aria-label="Tabs with underline" variant="underline">
                <TabItem active title="Details" >
                    <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 rounded-lg bg-white">
                        <div className="p-4 flex flex-col gap-y-8">
                            <div className="flex flex-col gap-y-4">
                                <h3 className="font-semibold mb-2">Auction Photos</h3>
                                {/* Parent Container (Optional: Add margin/padding as needed) */}
                                <div className="container mx-auto">

                                    {/* COVER IMAGE: Takes full width (w-full) */}
                                    <img
                                        src="/imgs/car.jpg"
                                        alt="Cover"
                                        className="w-full h-auto object-cover mb-4"
                                    />

                                    {/* FLEX CONTAINER for other images */}
                                    <div className="flex gap-4 overflow-auto">

                                        {/* OTHER IMAGE 1: Takes an equal share of space (flex-1) */}
                                        <img
                                            src="/imgs/car.jpg"
                                            alt="Image 1"
                                            className="h-32 object-cover rounded flex-1"
                                        />
                                        <img
                                            src="/imgs/car.jpg"
                                            alt="Image 1"
                                            className="h-32 object-cover rounded flex-1"
                                        />
                                        <img
                                            src="/imgs/car.jpg"
                                            alt="Image 1"
                                            className="h-32 object-cover rounded flex-1"
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col gap-y-4">
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p>
                                    {data.desc}
                                </p>
                            </div>

                        </div>
                        <div className="bg-gray-50 p-4 flex flex-col gap-y-8">
                            <div className="flex flex-col gap-y-4">
                                <h3 className="font-semibold mb-0.5">Basic Information</h3>
                                <FloatingLabel variant="outlined" label="Title" disabled={true} value={data.title} />
                                <FloatingLabel variant="outlined" label="Category" disabled={true} value={data.category.title} />

                            </div>
                            <div className="flex flex-col gap-y-4">
                                <h3 className="font-semibold mb-0.5">Pricing</h3>
                                <FloatingLabel variant="outlined" label="Start Price" disabled={true} value={data.title} />
                                <FloatingLabel variant="outlined" label="Minimum Increment Amount" disabled={true} value={data.category.title} />
                                <FloatingLabel variant="outlined" label="Reserve Price" disabled={true} value={data.category.title} />

                            </div>
                            <div className="flex flex-col gap-y-4">
                                <h3 className="font-semibold mb-0.5">Schedule</h3>
                                <FloatingLabel variant="outlined" label="Start Date" disabled={true} value={""} />
                                <FloatingLabel variant="outlined" label="Expected End Date" disabled={true} value={""} />
                                <FloatingLabel variant="outlined" label="Ended Date" disabled={true} value={formatTimestamp(data.end_at)} />

                            </div>


                        </div>
                    </div>
                </TabItem>
                <TabItem title="Bidding History">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-y-5 col-span-3">

                            <div className="ag-theme-quartz" style={{ height: "100%", width: '100%' }}>
                                <AgGridReact
                                    rowData={data.bids}
                                    columnDefs={bidColumns}
                                    loading={loading} // AG Grid will show its internal loading overlay if this is true
                                    pagination={true}
                                    defaultColDef={defaultColDef}
                                    rowSelection={rowSelection}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-8">
                            <CSVExport columns={bidColumns} modelLabel={'main.Bid'} />

                            <Card className="shadow-none bg-white">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold text-gray-700">Current Bid</h5>
                                    <Badge color="green">
                                        <RiAuctionLine size={20} />
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-bold">$24,200.00</h3>
                            </Card>
                            <Card className="shadow-none bg-white">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold text-gray-700">Total Bids</h5>
                                    <Badge color="blue">
                                        <PiPulse size={20} />
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-bold">24</h3>
                            </Card>
                            <Card className="shadow-none bg-white">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold text-gray-700">Unique Bidders</h5>
                                    <Badge color="indigo">
                                        <BsPeople size={20} />
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-bold">20</h3>
                            </Card>

                        </div>
                    </div>
                </TabItem>
                <TabItem title="Result" >
                    <div className="flex flex-col border border-gray-200 rounded-lg">
                        <div className="bg-green-100 p-6">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-xl text-green-600">Auction Successfully Closed</h3>
                                    <h5 className="text-green-600">Transaction initialized on Oct 24, 2023</h5>
                                </div>
                                <div className="bg-white rounded-full p-2 border border-gray-300">
                                    <GiTrophyCup size={30} color="orange" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white grid grid-cols-1 md:grid-cols-2">
                            <div className="flex flex-col p-6 items-start gap-y-8">
                                <h3 className="text-lg font-semibold">Winning Bidder</h3>
                                <Avatar rounded size="lg">
                                    <div className="space-y-1 font-medium dark:text-white">
                                        <div>Jese Leos</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">email@email.email</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">01149228665</div>
                                    </div>
                                </Avatar>
                                <Card className="shadow-none">
                                    <h3 className="text-sm font-semibold">Shipping Address</h3>
                                    <span>124 El-Haram, Giza, Egypt</span>
                                </Card>
                            </div>
                            <div className="flex flex-col p-6 bg-gray-50">
                                <h3 className="text-lg font-semibold mb-6">Financial Breakdown</h3>
                                <div>
                                    <div className="text-4xl font-bold">$4,200.00</div>
                                    <span className="text-gray-600">Final Hammer Price</span>
                                </div>
                            </div>

                        </div>
                        <div className="bg-gray-100 p-6">
                            <h3 className="text-lg font-semibold mb-6">Transaction Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4">
                                <div className="flex flex-col items-center">
                                        <FaCheckCircle color="green" size={35}/>
                                    <span className="text-green-800 font-semibold">Auction Ended</span>
                                </div>
                                <div className="flex flex-col items-center">
                                        <FaCheckCircle color="green" size={35}/>
                                    <span className="text-green-800 font-semibold">Invoice Sent</span>
                                </div>
                                <div className="flex flex-col items-center">
                                        <GoClockFill color="blue" size={35}/>
                                    <span className="text-blue-800 font-semibold">Payment Pending</span>
                                </div>
                                <div className="flex flex-col items-center">
                                        <FaRegStopCircle color="gray" size={35}/>
                                    <span className="text-gray-800 font-semibold">Shipment</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </TabItem>
                <TabItem title="Audit Log" >
                    <Card className="shadow-none bg-white">

                    </Card>
                </TabItem>
            </Tabs>
        </>
    )
}
