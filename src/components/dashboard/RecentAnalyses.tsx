import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ChevronRight, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { RecentAnalysisRecord } from '../../types/analysis';

interface RecentAnalysesProps {
  records: RecentAnalysisRecord[];
  onSelectRecord?: (record: RecentAnalysisRecord) => void;
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  records,
  onSelectRecord,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Processing'>('All');

  const filtered = records.filter((rec) => {
    const matchesQuery = 
      rec.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      rec.dataset.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="bg-white border border-[#E9EBEF] rounded-xl p-5 shadow-geo">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#E9EBEF] gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#17191D] tracking-tight">
            Recent Analysis Jobs
          </h3>
          <p className="text-xs text-[#777D87] mt-0.5">
            Archived bi-temporal satellite inference records.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A0A5AE]" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search region or ID..."
              className="pl-8 pr-3 py-1 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] text-xs text-[#17191D] placeholder-[#A0A5AE] focus:outline-none focus:border-[#16A765] w-40 sm:w-52 transition-colors"
              id="recent-analyses-search"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2 py-1 rounded-lg bg-[#F7F8FA] border border-[#E9EBEF] text-xs text-[#17191D] focus:outline-none focus:border-[#16A765]"
            id="status-filter-select"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E9EBEF] text-[#777D87] font-medium text-[11px]">
              <th className="py-2.5 px-3">Job ID</th>
              <th className="py-2.5 px-3">Region</th>
              <th className="py-2.5 px-3">Epochs</th>
              <th className="py-2.5 px-3">Sensor</th>
              <th className="py-2.5 px-3">Area Altered</th>
              <th className="py-2.5 px-3">Urban Extent</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9EBEF]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-[#777D87]">
                  No matching analysis records found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-[#F7F8FA] transition-colors group cursor-pointer"
                  onClick={() => onSelectRecord && onSelectRecord(item)}
                >
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#5B9DE8] font-medium">
                    {item.id}
                  </td>
                  <td className="py-2.5 px-3 text-[#17191D] font-medium">
                    {item.location}
                  </td>
                  <td className="py-2.5 px-3 text-[#777D87]">
                    {item.comparisonPeriod}
                  </td>
                  <td className="py-2.5 px-3 text-[#777D87] text-[11px]">
                    {item.dataset}
                  </td>
                  <td className="py-2.5 px-3 text-[#17191D] font-semibold">
                    {item.areaChanged}
                  </td>
                  <td className="py-2.5 px-3 text-[#087D4A] font-medium">
                    {item.urbanExpansion}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      item.status === 'Completed'
                        ? 'bg-[#EAF8F0] text-[#087D4A]'
                        : 'bg-[#FFF8E6] text-[#B76E00]'
                    }`}>
                      {item.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3 text-[#16A765]" />
                      ) : (
                        <Clock className="w-3 h-3 text-[#F2994A]" />
                      )}
                      {item.status}
                    </span>
                    {item.isDemo && (
                      <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-[#F3F4F6] text-[#777D87] font-mono">
                        Demo
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      className="p-1 rounded text-[#A0A5AE] group-hover:text-[#17191D] transition-colors"
                      title="Inspect analysis"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
