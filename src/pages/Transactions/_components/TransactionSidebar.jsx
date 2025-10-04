import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  BarChart3,
} from "lucide-react";

const TransactionSidebar = ({
  recivedTransaction = [],
  paiedTransaction = [],
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const Sum = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      return acc + parseFloat(transaction.amount || 0);
    }, 0);
  };

  const receivedTotal = Sum(recivedTransaction);
  const paidTotal = Sum(paiedTransaction);
  const currentBalance = receivedTotal - paidTotal;

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate percentage
  const receivedPercentage =
    receivedTotal > 0 ? (receivedTotal / (receivedTotal + paidTotal)) * 100 : 0;
  const paidPercentage =
    paidTotal > 0 ? (paidTotal / (receivedTotal + paidTotal)) * 100 : 0;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block lg:w-[25%] lg:sticky lg:top-6 lg:self-start space-y-6"
        style={{ maxHeight: "calc(100vh - 3rem)" }}
      >
        {/* Main Balance Card */}
        <div className="relative bg-gradient-to-br from-[#ffd700] via-[#ffed4a] to-[#ffc700] rounded-3xl p-8 overflow-hidden shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10">
            {/* Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wallet className="w-7 h-7 text-[#0f0820]" />
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 text-[#0f0820] ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {/* Balance */}
            <div className="mb-2">
              <p
                className="text-[#0f0820]/70 text-sm font-semibold mb-2"
                dir="rtl"
              >
                الرصيد الإجمالي
              </p>
              <h2 className="text-5xl font-black text-[#0f0820] mb-1" dir="rtl">
                {currentBalance.toLocaleString("ar-KW", {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </h2>
              <p className="text-[#0f0820]/60 text-lg font-bold">KWD</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#0f0820]/10">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownRight className="w-4 h-4 text-green-600" />
                  <p className="text-[#0f0820]/70 text-xs font-semibold">
                    وارد
                  </p>
                </div>
                <p className="text-[#0f0820] text-lg font-black">
                  {recivedTransaction.length}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                  <p className="text-[#0f0820]/70 text-xs font-semibold">
                    صادر
                  </p>
                </div>
                <p className="text-[#0f0820] text-lg font-black">
                  {paiedTransaction.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Received Stats */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold" dir="rtl">
                  إجمالي المستلم
                </p>
                <p className="text-white text-sm">
                  <span className="font-black text-xl">
                    {recivedTransaction.length}
                  </span>{" "}
                  عملية
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-3xl font-black text-emerald-400 mb-1" dir="rtl">
              {receivedTotal.toLocaleString("ar-KW", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </h3>
            <p className="text-white/40 text-sm font-bold">KWD</p>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${receivedPercentage}%` }}
            ></div>
          </div>
          <p className="text-white/40 text-xs mt-2 text-right" dir="rtl">
            {receivedPercentage.toFixed(1)}% من الإجمالي
          </p>
        </div>

        {/* Paid Stats */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold" dir="rtl">
                  إجمالي المدفوع
                </p>
                <p className="text-white text-sm">
                  <span className="font-black text-xl">
                    {paiedTransaction.length}
                  </span>{" "}
                  عملية
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="text-3xl font-black text-rose-400 mb-1" dir="rtl">
              {paidTotal.toLocaleString("ar-KW", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </h3>
            <p className="text-white/40 text-sm font-bold">KWD</p>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${paidPercentage}%` }}
            ></div>
          </div>
          <p className="text-white/40 text-xs mt-2 text-right" dir="rtl">
            {paidPercentage.toFixed(1)}% من الإجمالي
          </p>
        </div>

        {/* Quick Info */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#ffd700]" />
            <h3 className="text-white font-bold" dir="rtl">
              معلومات سريعة
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-white/60 text-sm" dir="rtl">
                إجمالي المعاملات
              </span>
              <span className="text-white font-bold">
                {recivedTransaction.length + paiedTransaction.length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-white/60 text-sm" dir="rtl">
                متوسط الإيداع
              </span>
              <span className="text-emerald-400 font-bold">
                {recivedTransaction.length > 0
                  ? (receivedTotal / recivedTransaction.length).toFixed(3)
                  : "0.000"}{" "}
                KWD
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-white/60 text-sm" dir="rtl">
                متوسط السحب
              </span>
              <span className="text-rose-400 font-bold">
                {paiedTransaction.length > 0
                  ? (paidTotal / paiedTransaction.length).toFixed(3)
                  : "0.000"}{" "}
                KWD
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#0f0820] z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Same content as desktop but in mobile */}
          {/* Main Balance Card */}
          <div className="relative bg-gradient-to-br from-[#ffd700] via-[#ffed4a] to-[#ffc700] rounded-3xl p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#0f0820]" />
                </div>
                <button
                  onClick={handleRefresh}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-[#0f0820] ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              <p
                className="text-[#0f0820]/70 text-sm font-semibold mb-2"
                dir="rtl"
              >
                الرصيد الإجمالي
              </p>
              <h2 className="text-4xl font-black text-[#0f0820] mb-1" dir="rtl">
                {currentBalance.toLocaleString("ar-KW", {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </h2>
              <p className="text-[#0f0820]/60 text-base font-bold">KWD</p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#0f0820]/10">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <ArrowDownRight className="w-3 h-3 text-green-600" />
                    <p className="text-[#0f0820]/70 text-xs font-semibold">
                      وارد
                    </p>
                  </div>
                  <p className="text-[#0f0820] text-base font-black">
                    {recivedTransaction.length}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <ArrowUpRight className="w-3 h-3 text-red-600" />
                    <p className="text-[#0f0820]/70 text-xs font-semibold">
                      صادر
                    </p>
                  </div>
                  <p className="text-[#0f0820] text-base font-black">
                    {paiedTransaction.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Stats Cards */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs" dir="rtl">
                  إجمالي المستلم
                </p>
                <p className="text-emerald-400 font-black text-xl">
                  {receivedTotal.toFixed(3)}{" "}
                  <span className="text-sm">KWD</span>
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                style={{ width: `${receivedPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs" dir="rtl">
                  إجمالي المدفوع
                </p>
                <p className="text-rose-400 font-black text-xl">
                  {paidTotal.toFixed(3)} <span className="text-sm">KWD</span>
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full"
                style={{ width: `${paidPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TransactionSidebar;
