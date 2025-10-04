import React from "react";
import "./style.css";
import NagahLogo from "../../assets/logo/log.png";
import AboutUsImg from "../../assets/why_us.png";

export const OurStory = () => {
  return (
    <div className="our_story">
      <div
        className="group w-full cursor-pointer transform transition-all duration-500 hover:scale-100 "
        // onClick={() => navigate(`/offer-lesson/teacher/${item?.teacher_id}`)}
      >
        <div
          className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
          style={{
            background:
              "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
            border: "3px solid transparent",
            minHeight: "400px",
          }}
        >
          {/* Animated border glow effect */}
          <div
            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
            style={{
              background: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
              filter: "blur(8px)",
              transform: "scale(1.05)",
            }}
          />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />

          {/* Content container */}
          <div className="relative z-10 flex flex-col justify-center items-center p-8 h-full">
            {/* Decorative elements */}
            <div
              className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: "#ffd700" }}
            />
            <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping" />
            <div className="absolute bottom-6 left-4 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" />

            {/* Profile Image Container */}
            <div className="relative mb-6 group/image">
              <div
                className="relative w-65 h-65 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110"
                style={{
                  border: "4px solid #ffd700",
                }}
              >
                <img src={NagahLogo} alt="" />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating badge */}
              <div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-purple-900 shadow-lg animate-bounce border-2 border-white"
                style={{ backgroundColor: "#ffd700" }}
              >
                ★
              </div>

              <div
                className="absolute inset-0 rounded-full border border-yellow-400/30 animate-pulse"
                style={{ transform: "scale(1.2)" }}
              />
              <div
                className="absolute inset-0 rounded-full border border-yellow-400/20 animate-pulse"
                style={{ transform: "scale(1.4)", animationDelay: "0.5s" }}
              />
            </div>

            <div
              className="absolute top-12 left-8 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-20 right-16 w-1 h-1 bg-yellow-500/30 rounded-full animate-bounce"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          {/* Corner decorations */}
          <div
            className="absolute top-0 right-0 w-16 h-16 opacity-20"
            style={{
              background:
                "linear-gradient(225deg, #ffd700 0%, transparent 70%)",
              clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-12 h-12 opacity-15"
            style={{
              background: "linear-gradient(45deg, #ffd700 0%, transparent 70%)",
              clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
            }}
          />
        </div>
      </div>

      {/* <img src={AboutUsImg} alt="" /> */}

      <span style={{ width: "100%", direction: "rtl" }}>
        <span
          className="main-text"
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            textShadow: "rgb(226 194 80) 3px 0px 0px",
          }}
        >
          من نحن ؟
        </span>
        <p style={{ color: "white" }}>
          في قلب التميز والإبداع، تأسست أكاديمية نجاح برؤية واضحة: تمكين الأفراد
          من تحقيق طموحاتهم وتطوير مهاراتهم في بيئة تعليمية حديثة ومتطورة. نحن
          نؤمن بأن التعليم هو المفتاح الحقيقي للنجاح، ولهذا نوفر برامج تدريبية
          متخصصة تلبي احتياجات السوق الحديثة وتعزز من قدرات المتعلمين. <br />{" "}
          بدأت رحلتنا بفكرة بسيطة لكنها قوية: كل شخص لديه القدرة على النجاح إذا
          حصل على الأدوات والتوجيه الصحيحين. من هنا، انطلقت أكاديمية نجاح لتكون
          أكثر من مجرد منصة تعليمية، بل مجتمعًا يدعم الطلاب، ويحفزهم على التميز،
          ويقودهم نحو مستقبل مشرق.
        </p>
        <span
          className="main-text"
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            textShadow: "rgb(226 194 80) 3px 0px 0px",
          }}
        >
          لماذا أكاديمية نجاح؟
        </span>
        <ul style={{ listStyle: "none", color: "white" }}>
          <li>✅ محتوى تعليمي شامل يناسب جميع المستويات والمجالات.</li>
          <li>✅ مدربون محترفون بخبرة عملية حقيقية.</li>
          <li>
            ✅ أساليب تعليمية حديثة تجمع بين التعلم التفاعلي والتقنيات الذكية.
          </li>
          <li>✅ شهادات معتمدة تعزز من فرصك في سوق العمل.</li>
        </ul>
      </span>
    </div>
  );
};
