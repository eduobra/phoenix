"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext"; // import your auth hook
import { useGetTelemetry } from "@/query";

interface TelemetryData {
  TimeGenerated: string;
  Message: string;
  process: string;
  module: string;
  trace_id: string;
  status_code: string;
  input: string;
  session_id: string;
  latency_ms: string | null;
  cpu_before: string | null;
  cpu_after: string | null;
  mem_before: string | null;
  mem_after: string | null;
  response_size_bytes: string | null;
  request_size_bytes: string | null;
}

interface TelemetryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TelemetryModal({ open, onClose }: TelemetryModalProps) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the access token from auth store
  const token = useAuth((state) => state.userData?.accessToken);
  console.log("telemetry",token)
  
  const telemetryQuery = useGetTelemetry(token);
  const queryPayload = {
    query: `AppTraces 
      | extend props = todynamic(Properties) 
      | extend data = todynamic(tostring(props.data)) 
      | extend payload = todynamic(data.payload) 
      | where Message == 'Connected to LangGraph API (non-stream)' 
      | project TimeGenerated, Message, process = props.process, module = props.module, trace_id = props.trace_id, status_code = data.status_code, input = payload.input, session_id = payload.session_id, latency_ms = data.latency_ms, cpu_before = data.cpu_before, cpu_after = data.cpu_after, mem_before = data.mem_before, mem_after = data.mem_after, response_size_bytes = data.response_size_bytes, request_size_bytes = data.request_size_bytes 
      | top 10 by TimeGenerated desc`,
  };

    const fetchTelemetry = async () => {
        setLoading(true);

        try {
            const response = await telemetryQuery.mutateAsync({
            payload: queryPayload, 
            authorization: `Bearer ${token}`,
            });

            if (response?.data) setTelemetryData(response.data);
        } catch (err) {
            console.error("Telemetry error:", err);
        } finally {
            setLoading(false);
        }
    };


  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
      <div className="bg-background rounded-3xl shadow-xl w-full max-w-[950px] h-[90vh] flex flex-col overflow-hidden animate-modalIn">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-card-foreground-800">Telemetry Monitor</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTelemetry}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="text-card-foreground-500 hover:text-card-foreground-700 text-2xl"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 border-b text-sm text-card-foreground-700">
          {loading ? "Loading telemetry..." : `Showing ${telemetryData.length} records`}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-card-50 sticky top-0 z-10">
              <tr>
                <th className="border px-2 py-1 text-left">Time</th>
                <th className="border px-2 py-1 text-left">Message</th>
                <th className="border px-2 py-1 text-left">Process</th>
                <th className="border px-2 py-1 text-left">Module</th>
                <th className="border px-2 py-1 text-left">Latency (ms)</th>
                <th className="border px-2 py-1 text-left">CPU (%)</th>
                <th className="border px-2 py-1 text-left">Memory (MB)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : telemetryData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No telemetry data available
                  </td>
                </tr>
              ) : (
                telemetryData.map((item, idx) => {
                  const cpu = parseFloat(item.cpu_after ?? "0");
                  const memBefore = parseInt(item.mem_before ?? "0");
                  const memAfter = parseInt(item.mem_after ?? "0");
                  const memUsagePercent =
                    memBefore > 0 ? Math.min(100, (memAfter / memBefore) * 100) : 0;

                  return (
                    <tr key={idx} className="hover:bg-card-100">
                      <td className="border px-2 py-1">{new Date(item.TimeGenerated).toLocaleString()}</td>
                      <td className="border px-2 py-1">{item.Message}</td>
                      <td className="border px-2 py-1">{item.process}</td>
                      <td className="border px-2 py-1">{item.module}</td>
                      <td className="border px-2 py-1">{item.latency_ms ?? "-"}</td>
                      <td className="border px-2 py-1">
                        <div className="w-full bg-card-100 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${cpu}%` }}
                          />
                        </div>
                        <span className="text-xs">{cpu.toFixed(1)}%</span>
                      </td>
                      <td className="border px-2 py-1">
                        <div className="w-full bg-card-100 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${memUsagePercent}%` }}
                          />
                        </div>
                        <span className="text-xs">{memAfter} / {memBefore} Bytes</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null;
}
