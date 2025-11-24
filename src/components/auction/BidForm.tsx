"use client";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from 'formik';
import { Bids, Item } from "@/types/main";

const BidForm = ({
  id,
  data
}: {
  id: string;
  data: Item
}) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwODA0MzMyLCJpYXQiOjE3NjA3MTc5MzIsImp0aSI6IjhmYWFjYTM2YTg1ODRmNGViNzRlNGJkNjY1N2E1NjkwIiwidXNlcl9pZCI6IjEifQ.CFFUMCqE_IwQOkdyjVzsSUqU7qqfbWU6RPRMJhsLvdA'
  const socketRef = useRef<WebSocket | null>(null);
  const latestBidAmount =
    data.bids && data.bids.length > 0
      ? data.bids[0].amount
      : data.start_price;

  console.log(data)
  const [bids, setBids] = useState<Bids[]>([]);
  const [lastBidAmount, setLastBidAmount] = useState(() => Number(latestBidAmount));
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      amount: lastBidAmount + Number(data.min_increment),
    },
    validate: values => {
      const errors: { amount?: string } = {};
      const minAcceptable = lastBidAmount + Number(data.min_increment);
      if (values.amount < minAcceptable) {
        errors.amount = `Bid must be at least ${minAcceptable}`;
      }
      return errors;
    },
    onSubmit: values => {
      const { amount } = values;
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ amount }));
      } else {
        console.warn("WebSocket not connected");
      }
    },
  });

  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/place-bid/${id}/?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.error) {
          setErrorMessage(message.error);
        } else if (message.bid) {
          const bid = message.bid;
          setLastBidAmount(bid.amount);
          formik.setFieldValue("amount", bid.amount + Number(data.min_increment));
          setErrorMessage("");
          setBids((prev) => [bid, ...prev]); // prepend for latest-first
        }
      } catch (err) {
        console.error("Invalid message format:", event.data);
      }
    };


    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [id, data.min_increment]);

  useEffect(() => {
    formik.setFieldValue("amount", lastBidAmount + Number(data.min_increment));
  }, [lastBidAmount, data.min_increment]);

  useEffect(() => {
    setBids(data.bids)
  }, [data.bids])

  return (
    <>
      <div className="mb-2">
        <strong>Start Price:</strong> {data.start_price}<br />
        <strong>Current Bid:</strong> {lastBidAmount}<br />
        <strong>Minimum Increment:</strong> {data.min_increment}
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          type="number"
          name="amount"
          className="border p-2 rounded w-full"
          placeholder="Enter your bid"
          onChange={formik.handleChange}
        // value={formik.values.amount}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Place Bid
        </button>
      </form>

      {formik.errors.amount && (
        <div className="text-red-500 text-sm">{formik.errors.amount}</div>
      )}
      {errorMessage && (
        <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
      )}
      {/* Bids */}
      <h1>bids</h1>
      <ul>
        {bids.map((bid) => (
          <li key={bid.id}>{bid.amount} {bid.created_by} {new Date(bid.created_at).toLocaleString()}</li>
        ))}
      </ul>
    </>
  );
};

export default BidForm;
