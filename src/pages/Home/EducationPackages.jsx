import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Users,
  GraduationCap,
  Star,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { base_url } from "../../constants";

export default function EducationPackages() {
  const [isVisible, setIsVisible] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${base_url}/user/packages/select_packages.php`
        );

        if (response.data.status === "success" && response.data?.message) {
          setPackages(response.data?.message);
        } else {
          setError("فشل في تحميل الباقات");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // WhatsApp contact function
  const handleWhatsAppContact = (packageName, price) => {
    const phoneNumber = "96566654045";
    const message = `مرحباً، أرغب في الاشتراك في ${packageName} بسعر ${price} د.ك`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // Get icon based on package title or index
  const getPackageIcon = (title, index) => {
    if (title.includes("التأسيس") || title.includes("الابتدائي")) {
      return BookOpen;
    } else if (title.includes("الإعدادي")) {
      return Users;
    } else if (title.includes("الثانوي")) {
      return GraduationCap;
    }
    // Fallback to index-based icons
    const icons = [BookOpen, Users, GraduationCap];
    return icons[index % icons.length];
  };

  // Determine if package is popular (middle one)
  const isPopular = (index, total) => {
    return total === 3 && index === 1;
  };

  return (
    <div
      style={{
        direction: "rtl",
      }}
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden border-b-[5px] border-[#ffd700]"
    >
      {/* Mobile/Tablet Background */}
      <div className="lg:hidden absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b003b] via-[#450240] to-[#450240]"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        ></div>
      </div>

      {/* Desktop Split Background */}
      <div className="hidden lg:grid absolute inset-0 lg:grid-cols-2">
        {/* Left Side - Enhanced Gradient */}
        <div className="bg-gradient-to-br from-[#3b003b] via-[#370034] to-[#260023] relative">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#ffd700] rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Side - Enhanced Image */}
        <div
          className="relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#3b003b]/70 to-[#3b003b]/95"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center py-12 md:py-16 lg:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content - Enhanced */}
            <div
              className={`text-white transition-all duration-700 md:duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 md:-translate-x-8"
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffd700]/20 to-[#ffd700]/10 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 md:mb-8 border border-[#ffd700]/40 shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffd700]" />
                <span className="text-sm sm:text-base font-bold text-[#ffd700]">
                  باقات التعليم
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 leading-tight">
                باقات{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffed4a]">
                  التعليم
                </span>
              </h1>

              <div
                className="space-y-4 sm:space-y-5 md:space-y-6 text-base sm:text-lg leading-relaxed"
                dir="rtl"
              >
                <p className="text-gray-100 font-medium">
                  <span className="text-[#ffd700] font-bold text-xl">
                    نقدم لكم باقات تعليمية متنوعة
                  </span>{" "}
                  تناسب جميع المراحل الدراسية من التأسيس حتى الثانوية العامة
                </p>

                <p className="hidden sm:block text-gray-200 font-medium">
                  نوفر تعليماً عالي الجودة في المواد الأساسية: العربي والإنجليزي
                  والرياضيات والعلوم، مع إمكانية الدروس الخصوصية أونلاين
                </p>

                <p className="sm:hidden text-gray-200 font-medium">
                  تعليم عالي الجودة في المواد الأساسية مع دروس خصوصية أونلاين
                </p>
              </div>
            </div>

            {/* Right Side - Enhanced Educational Packages */}
            <div
              className={`transition-all duration-700 md:duration-1000 delay-200 md:delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4 md:translate-x-8"
              }`}
            >
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#ffd700] animate-spin mx-auto mb-4" />
                    <p className="text-white font-bold">
                      جاري تحميل الباقات...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                  <p className="text-white font-bold mb-2">⚠️ خطأ</p>
                  <p className="text-gray-200">{error}</p>
                </div>
              )}

              {/* Mobile Packages - Enhanced Compact Cards */}
              {!loading && !error && (
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {packages.map((packageItem, index) => {
                    const Icon = getPackageIcon(packageItem.title, index);
                    return (
                      <div
                        key={packageItem.package_id}
                        className={`group bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-md rounded-xl p-4 border border-[#ffd700]/40 transition-all duration-500 hover:border-[#ffd700] hover:shadow-xl hover:shadow-[#ffd700]/20 flex flex-col justify-between ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{
                          transitionDelay: `${(index + 1) * 100 + 300}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2" dir="rtl">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#ffd700]/25 to-[#ffd700]/10 rounded-lg flex items-center justify-center border border-[#ffd700]/30 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-5 h-5 text-[#ffd700]" />
                          </div>
                          <span className="bg-gradient-to-r from-[#ffd700] to-[#ffed4a] text-[#3b003b] px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                            {packageItem.price} د.ك
                          </span>
                        </div>
                        <h3
                          className="text-white font-bold text-sm mb-1"
                          dir="rtl"
                        >
                          {packageItem.title}
                        </h3>
                        <p
                          className="text-gray-200 text-xs font-medium mb-3"
                          dir="rtl"
                        >
                          {packageItem.descrebtion}
                        </p>
                        <button
                          onClick={() =>
                            handleWhatsAppContact(
                              packageItem.title,
                              packageItem.price
                            )
                          }
                          className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffed4a] hover:from-[#ffed4a] hover:to-[#ffd700] text-[#3b003b] py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#ffd700]/40 hover:scale-105"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>اشترك الآن</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Desktop Packages */}
              {!loading && !error && (
                <div className="hidden lg:block space-y-8">
                  {packages.map((packageItem, index) => {
                    const Icon = getPackageIcon(packageItem.title, index);
                    const popular = isPopular(index, packages.length);

                    return (
                      <div
                        key={packageItem.package_id}
                        className={`group relative flex items-start gap-6 gap-reverse transition-all duration-700 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4"
                        }`}
                        style={{
                          transitionDelay: `${(index + 1) * 200 + 600}ms`,
                        }}
                      >
                        {/* Popular Badge */}
                        {popular && (
                          <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#ffd700] to-[#ffed4a] text-[#3b003b] px-4 py-1 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>الأكثر طلباً</span>
                          </div>
                        )}

                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#ffd700]/25 to-[#ffd700]/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#ffd700]/40 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#ffd700]/30 transition-all duration-300">
                            <Icon className="w-8 h-8 text-[#ffd700]" />
                          </div>
                        </div>

                        <div
                          className="text-white bg-gradient-to-r from-black/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-[#ffd700]/20 group-hover:border-[#ffd700]/50 transition-all duration-300 flex-1"
                          dir="rtl"
                        >
                          <div className="flex items-center gap-3 gap-reverse mb-2">
                            <h3 className="text-xl font-bold">
                              {packageItem.title}
                            </h3>
                            <span className="bg-gradient-to-r from-[#ffd700] to-[#ffed4a] text-[#3b003b] px-3 py-1 rounded-full text-sm font-bold shadow-md">
                              {packageItem.price} د.ك شهرياً
                            </span>
                          </div>
                          <p className="text-gray-100 font-medium leading-relaxed mb-4 text-base">
                            {packageItem.descrebtion}
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-[#ffd700] text-base font-bold">
                              {packageItem.per_subject_price} د.ك للمادة الواحدة
                            </p>
                            <button
                              onClick={() =>
                                handleWhatsAppContact(
                                  packageItem.title,
                                  packageItem.price
                                )
                              }
                              className="flex items-center gap-2 bg-gradient-to-r from-[#ffd700] to-[#ffed4a] hover:from-[#ffed4a] hover:to-[#ffd700] text-[#3b003b] px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#ffd700]/50 hover:scale-105 group/btn"
                            >
                              <MessageCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                              <span>اشترك الآن</span>
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
