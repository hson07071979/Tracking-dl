/* =====================================================================
   SƠN STUDY KIT — nội dung học (giáo trình từng buổi) · bản 05/10/2026
   File này chỉ chứa DỮ LIỆU. index.html đọc nó để:
     • gắn mỗi buổi học vào đúng block trong lịch (block có field `cur`)
     • dựng tab Study Kit (tài liệu tải về, tiến độ, buổi kế tiếp)
   Muốn sửa nội dung: dùng nút "🤖 Đổi app bằng AI" trong app (không cần sửa file).
   Mỗi buổi: id · t (tên) · mat (tài liệu [nhãn, link]) · how (các bước) ·
             q (câu hỏi mang sang AI) · out (đầu ra bắt buộc) · by (hạn mềm)
   Link tài liệu dạng "@KEY#trang" = file PDF trong study/files/ (tự tìm theo tên).
   ===================================================================== */

/* ---------- 1. Kho file tải về ---------- */
/* key → cách nhận ra file trong thư mục study/files/ của repo (khớp theo từ khoá trong tên file) */
const KIT_FILES = [
  { key:"TN", g:"IF", match:["theory"],              name:"IF Midterm Theory Note",            pages:23,  desc:"Lý thuyết Ch.1, 2, 3, 5, 6, 7 — bản tóm tắt giữa kỳ", nlm:"IF – Midterm" },
  { key:"ME", g:"IF", match:["midterm","exam"],      name:"IF Midterm Exam – Term 1/2025",     pages:18,  desc:"30+ câu đề giữa kỳ cũ (có trong kho đề) — dùng làm mock 1", nlm:"IF – Midterm" },
  { key:"CQ", g:"IF", match:["calculation"],         name:"IF Calculation Questions (lời giải)",pages:38, desc:"Lời giải bài tính Ch.1–2, 5, 6, 7, 9, 10, 13, 14, 16", nlm:"IF – Midterm + Final" },
  { key:"FR", g:"IF", match:["final","revision"],    name:"IF Final Revision",                 pages:48,  desc:"Part A: lý thuyết + MCQ theo chương · Part B: bài tính dài (trang 48)", nlm:"IF – Final" },
  { key:"TB", g:"IF", match:["testbank"],            name:"IF Testbank (Eiteman 15e, 18 chương)",pages:339,desc:"Kho MCQ theo chương — trang bắt đầu mỗi chương ghi trong từng buổi", nlm:"IF – Midterm + Final" }
];
KIT_FILES.forEach(f=>f.sec=f.sec||"IF · Tài liệu ôn thi");
[1,2,3,5,6,7,9,10,13,14,16,17].forEach(c=>KIT_FILES.push({key:"SL"+c,g:"IF",sec:"IF · Slide giảng viên (PDF)",match:["slide","ch"+c+" "],name:"Slide Ch."+c,pages:0,desc:"Slide GV (đổi sang PDF để nạp NotebookLM/Gemini)",nlm:"IF – theo chương"}));
KIT_FILES.push({key:"DQ",g:"IF",sec:"IF · Slide giảng viên (PDF)",match:["discussion"],name:"Discussion Questions (case theo tuần)",pages:0,desc:"Câu hỏi thảo luận theo tuần",nlm:"IF – Midterm + Final"});
KIT_FILES.push({key:"SO",g:"IF",sec:"IF · Slide giảng viên (PDF)",match:["subject","outline"],name:"Subject Outline ECON3014",pages:0,desc:"Đề cương môn: lịch, cách chấm",nlm:"—"});
/* link ngoài (không đưa lên repo): BFN — slide GV ghi rõ không phát tán, nên chỉ link tới Drive của thầy (mở bằng tài khoản trường) */
const KIT_LINKS=[
  {sec:"BFN · Slide & tài liệu GV (Google Drive của thầy Tuấn)",name:"Banking and Finance S3.2026 — thư mục môn",url:"https://drive.google.com/drive/folders/17-dcLE-jjcVffLwjqrzRMZGxNqiCc4zT",desc:"Subject outline, danh sách nhóm, đề tài thuyết trình"},
  {sec:"BFN · Slide & tài liệu GV (Google Drive của thầy Tuấn)",name:"Textbook Slides (Saunders & Cornett) — slide từng chương",url:"https://drive.google.com/drive/folders/1q-S2kwpHOCQBh0Ha4ifFQ5Lp8qlGQKo1",desc:"Tải chương cần học → File → Tải xuống PDF → nạp NotebookLM"},
  {sec:"BFN · Slide & tài liệu GV (Google Drive của thầy Tuấn)",name:"Topics for presentation.pdf",url:"https://drive.google.com/file/d/1k_zG_zuFsxOgDQUj4bb4mEoKAAZhgaIv/view",desc:"Danh sách đề tài thuyết trình nhóm"},
  {sec:"BFN · Slide & tài liệu GV (Google Drive của thầy Tuấn)",name:"Subject Outline FINC3022",url:"https://drive.google.com/file/d/1KOv1LVZ77t0lifxk309uhjYDQOjy2Kqr/view",desc:"Đề cương môn BFN"}
];
/* trang bắt đầu từng chương trong Testbank (để mở thẳng #page=) */
const TB_PAGE = {1:1,2:20,3:38,4:62,5:80,6:100,7:119,8:142,9:155,10:173,11:190,12:206,13:223,14:245,15:270,16:288,17:307,18:323};

/* ---------- 2. Nhóm giáo trình (hiện trong tab Study Kit) ---------- */
const KIT_GROUPS = [
  { g:"IF",    name:"International Finance · ECON3014", ico:"🌐", track:"IF",
    note:"Mid T6 23/10 09:00 D401 (30 MCQ, 90', closed book) · Final CN 29/11 13:00 (MCQ + short answer + bài tính dài, 2h). IF được dùng AI nhưng phải khai báo nếu dùng trong bài nộp." },
  { g:"BF",    name:"Banking & Finance · FINC3022", ico:"🏦", track:"BF",
    note:"Thuyết trình nhóm T6 23/10 (chỉ chuẩn bị từ 16/10) · Report 40% · Final T4 2/12 09:00 (calculator + 1 tờ A4 viết tay 2 mặt). ⚠️ BFN CẤM AI trong mọi bài chấm điểm." },
  { g:"IELTS", name:"IELTS Academic 7.0 · thi cuối 12/2026", ico:"📝", track:"IELTS",
    note:"Xuất phát ~6.25–6.5, phân bổ đều 4 kỹ năng. Đề: Cambridge 15–20 (làm TRÊN MÁY vì thi CD-IELTS). Mỗi tuần: 1 Listening · 1 Reading · 1 Writing · 1 Speaking · 1 buổi luyện dạng · 1 buổi viết lại + từ vựng." },
  { g:"MACRO", name:"Macro → Micro (top-down + business model)", ico:"🧭", track:"MACRO",
    note:"Top-down là xương sống, business model là phần quyết định. 9 module: khung tư duy → tăng trưởng → tiền tệ → lạm phát/tỷ giá → tài khoá & thị trường → vĩ mô→ngành → business model → bottom-up → ghép thành luận điểm đầu tư." },
  { g:"CH",    name:"Kênh TikTok/YouTube '5 phút đọc báo'", ico:"🎬", track:"CH",
    note:"2 tuần nghiên cứu rồi mới ra video. Nguồn tin: bản tin sáng NSI-tin — CHỈ dùng tab Tin web, KHÔNG BAO GIỜ dùng nội dung nhóm Zalo kín lên kênh." },
  { g:"BRK",   name:"Học nghề broker → quản lý tài sản", ico:"🎧", track:"BRK",
    note:"2–3h/tuần xem người đi trước làm nghề. Mỗi buổi: 40' xem có chủ đích + 20' ghi 3 thứ copy được / 1 thứ không làm / 1 việc áp dụng tuần này." },
  { g:"TRADE", name:"Học lại PP giao dịch", ico:"📈", track:"TRADE",
    note:"10 bài, T2 + T4 16:15. Trang luật riêng chỉ chủ tài khoản mở được." }
];

/* tiện: dựng link tài liệu */
const tb = (ch, lbl) => [lbl || ("Testbank Ch." + ch + " (trang " + TB_PAGE[ch] + ")"), "@TB#" + TB_PAGE[ch]];
const note = ch => ["Bài tóm tắt Ch." + ch + " (tự viết lại từ slide)", "study/if/ch" + String(ch).padStart(2, "0") + ".html"];

/* ---------- 3. Giáo trình ---------- */
const KIT = {};

/* ===== IF — ôn MIDTERM (16 buổi × 2h, hạn mềm 22/10) rồi FINAL ===== */
KIT.if = { name:"IF — Midterm → Final", g:"IF", track:"IF", sessions:[
 { id:"ifm01", ph:"Midterm", by:"2026-10-22", t:"Ch.1 + Ch.2 — MNE & International Monetary System",
   mat:[["Theory Note trang 1–7","@TN#1"], note(1), note(2), tb(1), tb(2)],
   how:["25' đọc Theory Note trang 1–7, gạch: 3 phase of globalization, twin agency problems, comparative advantage, Eurocurrency/LIBOR→SOFR.",
        "20' Ch.2: gold standard → Bretton Woods → floating; Impossible Trinity (chọn 2 trong 3: ổn định tỷ giá, tự do vốn, độc lập tiền tệ); các chế độ tỷ giá (currency board, dollarization, crawling peg).",
        "45' làm 30 MCQ Testbank Ch.1 + Ch.2 (chọn câu lẻ) KHÔNG nhìn note, bấm giờ.",
        "30' chữa: mỗi câu sai ghi 1 dòng vào Error log (dạng câu / vì sao sai / bẫy là gì)."],
   q:["Giải thích Impossible Trinity bằng ví dụ Việt Nam: SBV đang hy sinh góc nào?","Vì sao twin agency problems giới hạn financial globalization? Cho 1 ví dụ thật."],
   out:"30 MCQ có điểm + ≥5 dòng Error log + sơ đồ 1 trang Impossible Trinity" },
 { id:"ifm02", ph:"Midterm", by:"2026-10-22", t:"Ch.3 — Balance of Payments + J-curve",
   mat:[["Theory Note trang 8–11","@TN#8"], note(3), tb(3), ["Đề mid 2025 câu 10, 11, 33, 34 (BoP Việt Nam, J-curve)","@ME#5"]],
   how:["20' đọc: cấu trúc BoP (Current / Capital / Financial account, Net errors & omissions, Official reserves), dấu +/−.",
        "20' tự lập bảng BoP Việt Nam từ đề mid 2025 câu 10–11: tính CA, FA, overall balance.",
        "15' J-curve 3 giai đoạn (currency contract → pass-through → quantity adjustment) — vẽ tay.",
        "50' 25 MCQ Testbank Ch.3, chữa ngay."],
   q:["Một đợt FDI vào ồ ạt ghi vào account nào, và ảnh hưởng tỷ giá thế nào?","Tôi tính current account từ bảng sau, soát giúp từng dấu (dán bảng)."],
   out:"Bảng BoP VN tự tính đúng + hình J-curve vẽ tay + 25 MCQ có điểm" },
 { id:"ifm03", ph:"Midterm", by:"2026-10-22", t:"Ch.5 — FX market: quote, bid-ask, cross rate, forward premium",
   mat:[["Theory Note trang 12–16","@TN#12"], note(5), ["Calculation Q — Ch.5 (Problem 2, 4, 7, 8, 14–16)","@CQ#1"], tb(5)],
   how:["20' nắm: direct vs indirect quote, bid/ask, % spread, cross rate (nhân/chia sao cho triệt tiêu đơn vị), forward premium/discount (annualized).",
        "45' làm lại Ch.5 Problem 2, 4, 7, 8, 14, 15, 16 trong Calculation Q — che lời giải, làm xong mới mở.",
        "35' đề mid 2025 câu 1–4 (bảng USD/VND bid-ask) + 15 MCQ Testbank Ch.5.",
        "20' viết thẻ công thức: forward premium = (F−S)/S × 360/n × 100 (đọc đúng chiều theo cách niêm yết!)."],
   q:["Khi niêm yết VND/USD thì forward premium của VND đọc ngược thế nào? Cho tôi 3 bài tự luyện.","Chỉ ra bẫy hay gặp khi tính cross rate từ bid-ask."],
   out:"7 bài Ch.5 tự làm đúng ≥5 + thẻ công thức Ch.5" },
 { id:"ifm04", ph:"Midterm", by:"2026-10-22", t:"Ch.6 — Parity conditions (PPP, Fisher, IFE, IRP)",
   mat:[["Theory Note trang 17–19","@TN#17"], note(6), ["Calculation Q — Ch.6","@CQ#5"], tb(6)],
   how:["25' học 5 quan hệ: absolute/relative PPP, Fisher effect, International Fisher Effect, Interest Rate Parity, forward rate as unbiased predictor — vẽ 'tam giác parity'.",
        "50' làm Calculation Q Ch.6 trang 5–8 (che lời giải).",
        "25' 15 MCQ Testbank Ch.6 phần lý thuyết.",
        "20' Error log + 1 trang tóm tắt khi nào dùng công thức nào."],
   q:["Phân biệt IFE và IRP bằng 1 ví dụ số giống đề thi.","Vì sao forward rate thường không dự báo đúng spot tương lai?"],
   out:"Tam giác parity vẽ tay có đủ công thức + bài Ch.6 trang 5–8 làm xong" },
 { id:"ifm05", ph:"Midterm", by:"2026-10-22", t:"Ch.6 — Covered/Uncovered Interest Arbitrage (CIA/UIA)",
   mat:[["Calculation Q — Ch.6 trang 8–11","@CQ#8"], ["Đề mid 2025 câu 14–16 (vay JPY 50 triệu), 19, 23, 29","@ME#8"], tb(6)],
   how:["15' quy trình CIA 4 bước: so sánh lãi suất chênh với forward premium → vay đồng nào → đổi spot → đầu tư → đóng forward → trả nợ → lãi.",
        "60' làm từng bước câu 14–16, 19, 23, 29 đề mid 2025 + Calculation Q trang 8–11.",
        "30' tự đặt 2 bài CIA với số VND/USD hiện tại (lãi suất VN vs Mỹ) — làm và kiểm tra.",
        "15' ghi lỗi sai."],
   q:["Chấm lời giải CIA của tôi từng bước (dán bài).","Khi nào UIA lãi mà CIA không có cơ hội?"],
   out:"6 bài CIA/UIA làm đúng quy trình 4 bước" },
 { id:"ifm06", ph:"Midterm", by:"2026-10-22", t:"Ch.7 — Futures & Options: payoff, breakeven",
   mat:[["Theory Note trang 20–23","@TN#20"], note(7), ["Calculation Q — Ch.7 (Problem 1–4, 9)","@CQ#12"], tb(7)],
   how:["20' futures vs forward (mark-to-market, margin) + call/put, buyer/writer, ITM/ATM/OTM, intrinsic vs time value.",
        "15' vẽ 4 đồ thị payoff: long call, short call, long put, short put — ghi breakeven và max profit/loss.",
        "50' Calculation Q Ch.7 trang 12–17 + đề mid 2025 câu 5–8, 17–18.",
        "35' 20 MCQ Testbank Ch.7."],
   q:["Writer của put option lãi tối đa bao nhiêu và breakeven ở đâu? Giải thích bằng đồ thị.","Cho tôi 5 câu đảo dấu buyer/writer để tôi luyện."],
   out:"4 đồ thị payoff + bảng breakeven + bài Ch.7 xong" },
 { id:"ifm07", ph:"Midterm", by:"2026-10-22", t:"Ch.9 — FX rate determination & forecasting",
   mat:[["Final Revision trang 23–26","@FR#23"], ["Calculation Q — Ch.9","@CQ#18"], tb(9)],
   how:["25' 3 trường phái: parity, asset market approach, balance of payments approach; can thiệp của NHTW (direct/indirect, sterilized).",
        "15' Liên hệ: SBV can thiệp tỷ giá ra sao (bán USD kỳ hạn, nâng lãi suất OMO/tín phiếu).",
        "45' Calculation Q trang 18–20 + 15 MCQ Testbank Ch.9.",
        "35' ôn lại Error log Ch.1–7, làm lại câu đã sai."],
   q:["Sterilized vs unsterilized intervention khác gì — ví dụ SBV.","Vì sao các mô hình dự báo tỷ giá ngắn hạn kém?"],
   out:"Sơ đồ 3 cách tiếp cận + 15 MCQ + Error log ôn lại" },
 { id:"ifm08", ph:"Midterm", by:"2026-10-22", t:"Ch.10 — Transaction exposure: forward / money market / option hedge",
   mat:[["Final Revision trang 27–29","@FR#27"], ["Calculation Q — Ch.10 (Problem 1–4, 8, 10)","@CQ#19"], ["Đề mid 2025 câu 24–26 (Masan bán hải sản cho đối tác Pháp)","@ME#12"], tb(10)],
   how:["20' 4 cách xử lý: unhedged, forward hedge, money market hedge, option hedge — mỗi cách tính ra số tiền VND/USD nhận được.",
        "60' làm Calculation Q Ch.10 + đề mid 2025 câu 24–26 theo 1 bảng so sánh 4 cột.",
        "20' Tính breakeven giữa forward và option.",
        "20' 10 MCQ Testbank Ch.10."],
   q:["Soát bảng so sánh 4 cách hedge của tôi (dán bảng).","Khi nào nên chọn option hedge thay vì forward?"],
   out:"Bảng so sánh 4 cách hedge cho bài Masan, đúng số" },
 { id:"ifm09", ph:"Midterm", by:"2026-10-22", t:"Tờ công thức + bẫy MCQ (Ch.1–10)",
   mat:[["Theory Note (toàn bộ)","@TN#1"], ["Calculation Q","@CQ#1"]],
   how:["60' tự viết 1 tờ A4 2 mặt KHÔNG nhìn tài liệu: quote/cross/forward premium, PPP/Fisher/IFE/IRP/CIA, payoff, 4 cách hedge, cấu trúc BoP.",
        "30' mở tài liệu, tô đỏ chỗ quên/sai.",
        "30' chép 15 'bẫy' từ Error log thành checklist đọc trước giờ thi."],
   q:["Kiểm tra tờ công thức của tôi còn thiếu gì cho mid (dán ảnh/chữ)."],
   out:"Tờ công thức 2 mặt + checklist 15 bẫy" },
 { id:"ifm10", ph:"Midterm", by:"2026-10-22", t:"MOCK 1 — đề Midterm Term 1/2025 (30 câu, 90')",
   mat:[["IF Midterm Exam – Term 1/2025","@ME#1"]],
   how:["Làm đúng như thi: 90', không tài liệu, chỉ calculator. Làm hết (không trừ điểm sai).",
        "Ghi giờ bắt đầu/kết thúc mỗi 10 câu để biết chỗ chậm.",
        "Chấm, ghi điểm vào mục Mock trong Study Kit."],
   q:["Đây là các câu tôi sai (dán). Gom theo topic và nói tôi cần ôn lại phần nào trước."],
   out:"Điểm mock 1 + danh sách câu sai theo topic" },
 { id:"ifm11", ph:"Midterm", by:"2026-10-22", t:"Chữa mock 1 — học lại đúng chỗ sai",
   mat:[["Error log của bạn",""], ["Theory Note","@TN#1"]],
   how:["Mỗi câu sai: đọc lại đúng mục lý thuyết → tự làm lại không nhìn đáp án → giải thích lại bằng lời.",
        "Topic sai ≥2 câu: làm thêm 10 MCQ Testbank chương đó."],
   q:["Giải thích lại câu này theo 3 tầng: đời thường → giáo trình → ví dụ số."],
   out:"100% câu sai đã làm lại đúng + 10 MCQ bổ sung cho topic yếu nhất" },
 { id:"ifm12", ph:"Midterm", by:"2026-10-22", t:"MOCK 2 — 30 câu trộn từ Testbank (90')",
   mat:[tb(5,"Testbank Ch.5"), tb(6,"Testbank Ch.6"), tb(7,"Testbank Ch.7"), tb(10,"Testbank Ch.10")],
   how:["Lấy 30 câu bạn CHƯA làm: Ch.1–3 (6 câu) · Ch.5 (6) · Ch.6 (6) · Ch.7 (6) · Ch.9–10 (6). Hoặc nạp Testbank vào NotebookLM và dùng prompt 'Tạo đề'.",
        "Làm 90' như thi, chấm, ghi điểm."],
   q:["(NotebookLM) Tạo 30 câu MCQ từ Testbank Ch.1, 2, 3, 5, 6, 7, 9, 10 đúng tỷ lệ trên, không kèm đáp án."],
   out:"Điểm mock 2 (mục tiêu ≥ 24/30)" },
 { id:"ifm13", ph:"Midterm", by:"2026-10-22", t:"Chữa mock 2 + luyện 2 topic yếu nhất",
   mat:[["Error log",""], ["Calculation Q","@CQ#1"]],
   how:["Chữa mock 2 như mock 1.","Chọn 2 topic sai nhiều nhất của cả 2 mock → làm lại toàn bộ bài tính topic đó trong Calculation Q."],
   q:["Cho tôi 5 câu khó nhất kiểu đề thi về topic X (đưa tên topic)."],
   out:"2 topic yếu đã làm lại hết bài tính" },
 { id:"ifm14", ph:"Midterm", by:"2026-10-22", t:"Bài tính tốc độ — 20 câu trong 40'",
   mat:[["Đề mid 2025","@ME#1"], ["Calculation Q","@CQ#1"]],
   how:["Chọn 20 câu TÍNH (cross rate, forward premium, CIA, option breakeven, hedge) đã làm → làm lại trong 40' (2'/câu).",
        "Câu nào > 3' thì đánh dấu, tìm cách tắt."],
   q:["Có cách tính nhanh nào cho dạng câu này không (dán câu)?"],
   out:"20 câu trong 40', đúng ≥ 17" },
 { id:"ifm15", ph:"Midterm", by:"2026-10-22", t:"Ôn lý thuyết dễ mất điểm (Ch.1–3, 9)",
   mat:[["Theory Note trang 1–11","@TN#1"], ["Final Revision trang 2–4, 23–26","@FR#2"]],
   how:["Lý thuyết hay bị bỏ quên vì 'dễ': phases of globalization, Bretton Woods, exchange-rate regimes, BoP, J-curve, approaches to FX determination.",
        "Tự hỏi–tự đáp 20 câu bằng flashcard (Anki/NotebookLM)."],
   q:["(NotebookLM) Tạo 20 flashcard lý thuyết Ch.1, 2, 3, 9 từ Theory Note."],
   out:"20 flashcard, trả lời đúng ≥ 16" },
 { id:"ifm16", ph:"Midterm", by:"2026-10-22", t:"Tối trước thi — đọc lại tờ công thức + 15 bẫy, ngủ trước 23h",
   mat:[["Tờ công thức của bạn",""]],
   how:["30' đọc tờ công thức + checklist bẫy.","Chuẩn bị: thẻ SV, calculator (pin), đến D401 trước 08:40.","KHÔNG học thêm gì mới."],
   q:[], out:"Sẵn sàng thi 09:00 T6 23/10" },

 /* ---- FINAL (24/10 → 28/11) ---- */
 { id:"iff01", ph:"Final", by:"2026-11-28", t:"Ch.13 — Global cost of capital (WACC, CAPM quốc tế)",
   mat:[["Final Revision trang 30–34","@FR#30"], note(13), ["Calculation Q — Ch.13","@CQ#24"], tb(13)],
   how:["25' WACC nội địa vs quốc tế, beta toàn cầu, market segmentation vs integration, vì sao MNE có cost of capital thấp hơn.",
        "50' Calculation Q trang 24–27.",
        "30' 15 MCQ Testbank Ch.13.","15' Error log."],
   q:["Vì sao tiếp cận thị trường vốn quốc tế làm giảm cost of capital? Ví dụ doanh nghiệp VN niêm yết nước ngoài."],
   out:"Bài WACC quốc tế làm đúng + 15 MCQ" },
 { id:"iff02", ph:"Final", by:"2026-11-28", t:"Ch.13 — luyện tính + liên hệ VN",
   mat:[["Calculation Q trang 27–29","@CQ#27"], tb(13)],
   how:["Làm nốt Calculation Q Ch.13.","Tự tính WACC 1 công ty VN bạn biết (dùng số BCTC thật, beta từ Vietstock) — 1 bảng."],
   q:["Soát bảng WACC công ty X của tôi."], out:"Bảng WACC 1 công ty VN" },
 { id:"iff03", ph:"Final", by:"2026-11-28", t:"Ch.14 — Sourcing capital globally (equity & debt)",
   mat:[["Final Revision trang 35–38","@FR#35"], note(14), ["Calculation Q — Ch.14","@CQ#30"], tb(14)],
   how:["25' con đường huy động: cross-listing, depositary receipts (ADR/GDR), Euroequity, Eurobond, private placement.",
        "40' Calculation Q trang 30–32 (bài vay EUR/indifferent rate).","40' 20 MCQ Testbank Ch.14."],
   q:["Tính tỷ giá cuối kỳ làm doanh nghiệp bàng quan giữa vay EUR và vay nội tệ — giải thích từng bước."],
   out:"Bài indifference rate làm đúng + 20 MCQ" },
 { id:"iff04", ph:"Final", by:"2026-11-28", t:"Ch.16 — International trade finance",
   mat:[["Final Revision trang 39–42","@FR#39"], note(16), ["Calculation Q — Ch.16","@CQ#33"], tb(16)],
   how:["25' L/C, bill of lading, draft (sight/time), banker's acceptance, forfaiting, factoring — vẽ sơ đồ 1 giao dịch L/C.",
        "45' Calculation Q trang 33–38 (chiết khấu BA).","30' 15 MCQ Testbank Ch.16."],
   q:["Vẽ giúp tôi luồng chứng từ một giao dịch xuất khẩu dùng L/C và kiểm tra sơ đồ của tôi."],
   out:"Sơ đồ L/C + bài banker's acceptance đúng" },
 { id:"iff05", ph:"Final", by:"2026-11-28", t:"Ch.17 — FDI & political risk (short answer)",
   mat:[["Final Revision trang 43–47","@FR#43"], note(17), tb(17)],
   how:["25' OLI paradigm, mode of entry, political risk (transfer, governance, cultural), cách giảm rủi ro.",
        "45' viết 2 câu short answer 15'/câu: 'Đánh giá Việt Nam là điểm đến FDI cho ngành bán dẫn' — dùng OLI.",
        "30' 15 MCQ Testbank Ch.17."],
   q:["Chấm câu short answer của tôi theo rubric: problem solving, economic logic, analysis, synthesis, evaluation, written communication."],
   out:"2 bài short answer có chấm" },
 { id:"iff06", ph:"Final", by:"2026-11-28", t:"Short answer — luyện viết theo rubric (Ch.1, 2, 9, 17)",
   mat:[["Final Revision Part A","@FR#1"]],
   how:["Khung 4 đoạn: claim → cơ chế (theory) → bằng chứng/ví dụ → đánh giá (mặt trái + kết luận).",
        "Viết 3 câu × 15': Impossible Trinity & VN; can thiệp tỷ giá; rủi ro chính trị với MNE."],
   q:["Chấm 3 câu theo rubric, chỉ rõ đoạn nào thiếu evaluation."], out:"3 câu short answer có chấm" },
 { id:"iff07", ph:"Final", by:"2026-11-28", t:"Part B — bài tính dài (lần 1)",
   mat:[["Final Revision trang 48 — Part B","@FR#48"]],
   how:["Làm trọn bài Part B, bấm giờ, trình bày từng bước như thi.","Chữa, ghi bước nào mất thời gian nhất."],
   q:["Soát lời giải Part B từng bước."], out:"Part B hoàn chỉnh lần 1" },
 { id:"iff08", ph:"Final", by:"2026-11-28", t:"Cumulative — bài tính Ch.5, 6, 7 (làm lại không nhìn)",
   mat:[["Calculation Q trang 1–17","@CQ#1"]],
   how:["Làm lại toàn bộ bài tính Ch.5–7 đã làm trước mid, KHÔNG nhìn lời giải.","Bài nào sai lại → đánh dấu đỏ."],
   q:[], out:"Tỷ lệ đúng ≥ 85%, danh sách bài đỏ" },
 { id:"iff09", ph:"Final", by:"2026-11-28", t:"Cumulative — Ch.9 + Ch.10 hedging",
   mat:[["Calculation Q trang 18–23","@CQ#18"], tb(10)],
   how:["Làm lại bài Ch.9–10 + 1 bài hedge tự đặt số mới.","15 MCQ Ch.10."], q:[], out:"Bảng 4 cách hedge làm lại đúng" },
 { id:"iff10", ph:"Final", by:"2026-11-28", t:"Final Revision Part A — Ch.2, 5, 6",
   mat:[["Final Revision trang 2–14","@FR#2"]],
   how:["Làm toàn bộ MCQ trong FR trang 2–14, chấm, Error log."], q:[], out:"MCQ FR Ch.2, 5, 6 có điểm" },
 { id:"iff11", ph:"Final", by:"2026-11-28", t:"Final Revision Part A — Ch.7, 9, 10",
   mat:[["Final Revision trang 15–29","@FR#15"]],
   how:["Làm toàn bộ MCQ FR trang 15–29, chấm, Error log."], q:[], out:"MCQ FR Ch.7, 9, 10 có điểm" },
 { id:"iff12", ph:"Final", by:"2026-11-28", t:"Final Revision Part A — Ch.13, 14, 16, 17",
   mat:[["Final Revision trang 30–47","@FR#30"]],
   how:["Làm toàn bộ MCQ FR trang 30–47, chấm, Error log."], q:[], out:"MCQ FR Ch.13–17 có điểm" },
 { id:"iff12a", ph:"Final", by:"2026-11-28", t:"Testbank trộn — 40 MCQ Ch.1, 2, 3 (lý thuyết hay quên)",
   mat:[tb(1,"Testbank Ch.1"), tb(2,"Testbank Ch.2"), tb(3,"Testbank Ch.3")], how:["Chọn 40 câu chưa làm, 60', chấm.","Câu sai → đọc lại đúng mục Theory Note."], q:[], out:"40 MCQ có điểm" },
 { id:"iff12b", ph:"Final", by:"2026-11-28", t:"Testbank trộn — 40 MCQ Ch.5, 6, 7",
   mat:[tb(5,"Testbank Ch.5"), tb(6,"Testbank Ch.6"), tb(7,"Testbank Ch.7")], how:["40 câu chưa làm, 60', chấm, Error log."], q:[], out:"40 MCQ có điểm" },
 { id:"iff12c", ph:"Final", by:"2026-11-28", t:"Testbank trộn — 40 MCQ Ch.9, 10, 13",
   mat:[tb(9,"Testbank Ch.9"), tb(10,"Testbank Ch.10"), tb(13,"Testbank Ch.13")], how:["40 câu chưa làm, 60', chấm, Error log."], q:[], out:"40 MCQ có điểm" },
 { id:"iff12d", ph:"Final", by:"2026-11-28", t:"Testbank trộn — 40 MCQ Ch.14, 16, 17",
   mat:[tb(14,"Testbank Ch.14"), tb(16,"Testbank Ch.16"), tb(17,"Testbank Ch.17")], how:["40 câu chưa làm, 60', chấm, Error log."], q:[], out:"40 MCQ có điểm" },
 { id:"iff12e", ph:"Final", by:"2026-11-28", t:"Bài tính Ch.13, 14, 16 — làm lại không nhìn lời giải",
   mat:[["Calculation Q trang 24–38","@CQ#24"]], how:["Làm lại toàn bộ, đánh dấu bài đỏ."], q:[], out:"Tỷ lệ đúng ≥ 85%" },
 { id:"iff12f", ph:"Final", by:"2026-11-28", t:"Short answer lần 2 — 3 câu × 15' (Ch.13–17)",
   mat:[["Final Revision trang 30–47","@FR#30"]], how:["Viết theo khung 4 đoạn, tự chấm theo rubric, sửa đoạn yếu nhất."], q:["Chấm 3 câu theo rubric IF."], out:"3 câu short answer" },
 { id:"iff12g", ph:"Final", by:"2026-11-28", t:"Part B lần 2 — bấm giờ 35'",
   mat:[["Final Revision trang 48","@FR#48"]], how:["Làm lại không nhìn lời giải lần 1."], q:[], out:"Part B ≤ 35'" },
 { id:"iff12h", ph:"Final", by:"2026-11-28", t:"Error log tổng — làm lại mọi câu đỏ từ đầu kỳ",
   mat:[["Error log",""]], how:["Lọc mọi câu sai từ mid tới giờ, làm lại.","Câu sai lần 2 → chép lên tờ tổng ôn."], q:[], out:"Error log sạch" },
 { id:"iff13", ph:"Final", by:"2026-11-28", t:"MOCK FINAL 1 — 2h như thi thật",
   mat:[["Testbank (chọn câu chưa làm)","@TB#1"], ["Final Revision Part B","@FR#48"]],
   how:["40 MCQ trộn mọi chương (60') + 2 short answer (30') + 1 bài tính dài (30').","Chấm, ghi điểm Mock."],
   q:["(NotebookLM) Tạo 40 MCQ trộn Ch.1–17 trừ 4, 8, 11, 12, 15, 18, không kèm đáp án."], out:"Điểm mock final 1" },
 { id:"iff14", ph:"Final", by:"2026-11-28", t:"Chữa mock final 1", mat:[["Error log",""]],
   how:["Câu sai → học lại → làm lại.","Short answer → viết lại đoạn yếu nhất."], q:[], out:"Mọi câu sai đã làm lại" },
 { id:"iff15", ph:"Final", by:"2026-11-28", t:"Tờ tổng ôn final (công thức + khung short answer)",
   mat:[["Tờ công thức mid",""], ["Final Revision","@FR#1"]],
   how:["Bổ sung Ch.13–17 vào tờ công thức mid.","Thêm khung 4 đoạn short answer + 6 'luận điểm mẫu' cho chủ đề hay ra."], q:[], out:"Tờ tổng ôn hoàn chỉnh" },
 { id:"iff16", ph:"Final", by:"2026-11-28", t:"MOCK FINAL 2 — 2h", mat:[["Testbank","@TB#1"]],
   how:["Như mock 1 nhưng câu mới.","Mục tiêu: ≥ 75%."], q:[], out:"Điểm mock final 2" },
 { id:"iff17", ph:"Final", by:"2026-11-28", t:"Chữa mock 2 + Part B lần 2", mat:[["Final Revision trang 48","@FR#48"]],
   how:["Chữa mock 2.","Làm lại Part B trong 30'."], q:[], out:"Part B ≤ 30'" },
 { id:"iff18", ph:"Final", by:"2026-11-28", t:"Luyện topic yếu nhất (theo Error log)", mat:[["Error log",""]],
   how:["Chọn 2 topic đỏ nhất, làm thêm 20 câu."], q:[], out:"2 topic đỏ → xanh" },
 { id:"iff19", ph:"Final", by:"2026-11-28", t:"Đọc lại tờ tổng ôn + bẫy — nhẹ nhàng", mat:[["Tờ tổng ôn",""]],
   how:["Đọc 45', không học mới.","Ngủ đủ — thi 13:00 CN 29/11."], q:[], out:"Sẵn sàng thi" }
]};

/* ===== BFN — Presentation tuần 16–22/10 (block riêng trong lịch) · Report · Final ===== */
KIT.bfrep = { name:"BFN — Report on Banking Services (40%)", g:"BF", track:"BF", sessions:[
 { id:"bfr1", t:"Đọc đề + rubric, gạch 3 hướng đề tài", by:"2026-10-31", mat:[["Ultra → FINC3022 → Assessment (Report)",""]],
   how:["Tải đề + rubric. Gạch chân động từ của đề (analyse/evaluate/compare…).","Viết 3 hướng đề tài, mỗi hướng 3 câu: ngân hàng/dịch vụ nào, câu hỏi chính, số liệu lấy ở đâu.","⚠️ Không dùng AI ở bất kỳ bước nào của Report."],
   q:[], out:"3 hướng đề tài viết tay" },
 { id:"bfr2", t:"Chọn hướng + tìm 8 nguồn học thuật", by:"2026-11-02", mat:[["Google Scholar","https://scholar.google.com/"],["BIS","https://www.bis.org/"],["SBV","https://www.sbv.gov.vn/"]],
   how:["Chốt 1 hướng.","Tìm 8 nguồn: ≥4 bài báo khoa học, 2 báo cáo BIS/IMF/World Bank, 2 nguồn SBV/báo cáo thường niên ngân hàng.","Lưu vào Zotero hoặc bảng: tác giả, năm, ý chính, trang."], q:[], out:"Bảng 8 nguồn có ý chính" },
 { id:"bfr3", t:"Outline 5 phần + chọn số liệu cho 2 figure, 1 table", by:"2026-11-05", mat:[],
   how:["Intro → Background → Analysis (2–3 ý) → Evaluation → Conclusion, ghi số từ cho từng phần (tổng 1.500).","Chọn số liệu thật cho 2 figure + 1 table."], q:[], out:"Outline có số từ + 3 hình/bảng phác" },
 { id:"bfr4", t:"Draft phần Intro + Background + Analysis 1", by:"2026-11-09", mat:[], how:["Viết thô ~700 từ, chưa sửa câu."], q:[], out:"~700 từ" },
 { id:"bfr5", t:"Draft Analysis 2–3 + Evaluation + Conclusion", by:"2026-11-12", mat:[], how:["Viết nốt cho đủ ~1.500 từ."], q:[], out:"Draft 1 đủ 1.500 từ" },
 { id:"bfr6", t:"Chèn 2 figure + 1 table, có label và diễn giải trong bài", by:"2026-11-15", mat:[], how:["Mỗi figure/table: số thứ tự, tiêu đề, nguồn, và được nhắc trong body."], q:[], out:"Bài có đủ figure/table" },
 { id:"bfr7", t:"Sửa bài + Harvard referencing", by:"2026-11-18", mat:[["WSU Library — Harvard referencing guide","https://library.westernsydney.edu.au/"]], how:["Đọc to từng đoạn, cắt câu thừa.","Soát in-text + reference list đúng Harvard."], q:[], out:"Bản sạch" },
 { id:"bfr8", t:"Turnitin thử + NỘP (sớm ≥2 ngày)", by:"2026-11-20", mat:[], how:["Nộp qua Turnitin, kiểm tra similarity, sửa nếu cần.","Xác nhận lại hạn chính thức trên Ultra."], q:[], out:"Đã nộp, chụp màn hình biên nhận" }
]};
KIT.bff = { name:"BFN — ôn Final (T4 2/12 09:00)", g:"BF", track:"BF", sessions:[
 { id:"bff1", t:"Ch.8 Repricing gap — làm lại toàn bộ problems", mat:[["Problems GV trên Ultra",""],["Bài tóm tắt Ch.8","study/bfn/ch08.html"]], how:["Tự làm lại, không AI.","Ghi công thức ΔNII = CGAP × ΔR vào tờ A4."], q:[], out:"Problems Ch.8 xong" },
 { id:"bff2", t:"Ch.9 Duration — làm lại toàn bộ problems", mat:[["Bài tóm tắt Ch.9","study/bfn/ch09.html"]], how:["Duration, modified duration, duration gap, ΔE = −[DA − kDL]·A·ΔR/(1+R)."], q:[], out:"Problems Ch.9 xong" },
 { id:"bff3", t:"Ch.10–11 Credit risk", mat:[["Problems GV",""]], how:["Loan pricing, RAROC, KMV, concentration limits."], q:[], out:"Problems Ch.10–11 xong" },
 { id:"bff4", t:"Ch.12 + Ch.19 Liquidity risk & management", mat:[["Problems GV",""]], how:["Liquidity index, financing gap, LCR/NSFR."], q:[], out:"Problems Ch.12, 19 xong" },
 { id:"bff5", t:"Ch.15 Market risk + Ch.21 Capital", mat:[["Problems GV",""]], how:["RiskMetrics/VaR, Basel capital ratios (CET1, Tier 1, total)."], q:[], out:"Problems Ch.15, 21 xong" },
 { id:"bff6", t:"Viết tờ A4 hai mặt (tên + student number góc trái)", mat:[], how:["Chỉ công thức + 1 ví dụ số mỗi loại rủi ro."], q:[], out:"Tờ A4 hoàn chỉnh" },
 { id:"bff7", t:"Mock: chọn 6 problems khó nhất, 2h", mat:[], how:["Làm như thi, chỉ dùng tờ A4."], q:[], out:"Điểm mock" },
 { id:"bff8", t:"Chữa mock + làm lại bài sai", mat:[], how:["Bài sai → làm lại 2 lần."], q:[], out:"Không còn bài đỏ" },
 { id:"bff9", t:"Đọc tờ A4, ngủ sớm", mat:[], how:["Thi 09:00 T4 2/12 — đã xin nghỉ ca sáng ở công ty."], q:[], out:"Sẵn sàng thi" }
]};

/* gắn slide GV đúng chương vào từng buổi IF; gắn Drive BFN vào buổi ôn final BFN */
KIT.if.sessions.forEach(s=>{ const chs=[...new Set([...(s.t.matchAll(/Ch\.(\d+)/g))].map(m=>+m[1]).concat([...s.t.matchAll(/Ch\.(\d+)\s*\+\s*Ch\.(\d+)/g)].map(m=>+m[2])))].filter(c=>[1,2,3,5,6,7,9,10,13,14,16,17].includes(c));
  s.mat=chs.map(c=>["Slide GV Ch."+c+" (PDF)","@SL"+c]).concat(s.mat||[]); });
KIT.bff.sessions.forEach(s=>{ if(!/A4|ngủ|Mock|mock|Chữa/.test(s.t)) s.mat=[["Textbook Slides BFN (Drive của thầy)","https://drive.google.com/drive/folders/1q-S2kwpHOCQBh0Ha4ifFQ5Lp8qlGQKo1"]].concat(s.mat||[]); });

/* ===== IELTS — 6 hàng đợi, mỗi hàng gắn với 1 loại block trong tuần ===== */
(function(){
  const TESTS=["Cam 20 Test 1","Cam 20 Test 2","Cam 20 Test 3","Cam 20 Test 4","Cam 19 Test 1","Cam 19 Test 2","Cam 19 Test 3","Cam 19 Test 4",
               "Cam 18 Test 1","Cam 18 Test 2","Cam 18 Test 3","Cam 18 Test 4","Cam 17 Test 1","Cam 17 Test 2"];
  const LFOC=["Chẩn đoán — làm nguyên đề, chưa cần chiến thuật",
    "Part 1 form/note completion: chính tả, số, ngày tháng, số nhiều -s",
    "Part 2 map/plan + multiple choice: từ chỉ hướng, thứ tự thông tin",
    "Part 3 thảo luận 2–3 người: bẫy 'đổi ý' (distractor) — ai nói câu chốt",
    "Part 4 bài giảng: note completion không có nghỉ — đọc trước tiêu đề để đoán loại từ",
    "Matching / multiple choice nhiều đáp án: gạch từ đồng nghĩa trước khi nghe",
    "Tổng hợp — sửa 2 dạng sai nhiều nhất trong Error log",
    "Part 3–4 tốc độ cao: nghe 1 lần, không dừng",
    "Ôn dạng sai nhiều nhất","Chép chính tả 1 đoạn Part 4 (dictation) sau khi làm","Luyện như thi thật trên máy","Luyện như thi thật trên máy",
    "Giữ nhịp","Giữ nhịp"];
  const RFOC=["Chẩn đoán — 60' nguyên đề",
    "True/False/Not Given + Yes/No/Not Given: False ≠ Not Given (có thông tin trái ngược mới là False)",
    "Matching Headings: đọc câu chủ đề + câu cuối đoạn, KHÔNG đọc hết đoạn",
    "Matching Information (đoạn nào chứa…): quét tên riêng, số, từ khoá hiếm",
    "Sentence/summary completion: giới hạn số từ, đúng loại từ, chép đúng chính tả",
    "Multiple choice + matching features: loại đáp án 'đúng nhưng không trả lời câu hỏi'",
    "Quản lý thời gian: P1 17' · P2 20' · P3 23'",
    "Ôn dạng sai nhiều nhất","Passage 3 khó — đọc lướt cấu trúc lập luận trước","Luyện như thi thật trên máy","Luyện như thi thật trên máy","Luyện như thi thật trên máy",
    "Giữ nhịp","Giữ nhịp"];
  const WFOC=["Chẩn đoán — viết như thi thật 60' (T1 20' · T2 40')",
    "T1 line graph: overview 2 câu không có số · T2 opinion (agree/disagree): lập trường xuyên suốt",
    "T1 bar/table: nhóm số liệu so sánh, không liệt kê · T2 discussion (both views + opinion)",
    "T1 pie + mixed charts · T2 advantages/disadvantages — trả lời đúng câu hỏi 'outweigh?'",
    "T1 process diagram: bị động + từ nối trình tự · T2 problem/solution",
    "T1 map (trước/sau): giới từ vị trí, động từ thay đổi · T2 two-part question",
    "Task Response: mỗi đoạn thân bài 1 ý chính + giải thích + ví dụ cụ thể (chỗ chặn ở 6.5)",
    "Coherence: referencing (this/these/such), không lạm dụng linking words",
    "Lexical: collocation đúng chủ đề, bỏ từ 'đao to búa lớn' dùng sai",
    "Grammar range: câu phức có mệnh đề quan hệ, điều kiện, bị động — tỷ lệ câu không lỗi ≥ 50%",
    "Viết trong 55' (dư 5' soát lỗi)","Viết trong 55'","Giữ nhịp","Giữ nhịp"];
  const VOC=["Education","Technology","Environment","Health","Work & careers","Urbanisation & housing","Crime & punishment","Globalisation",
             "Media & advertising","Transport","Government spending","Culture & tourism","Family & society","Science & research"];
  const GRAM=["Câu phức với mệnh đề quan hệ (which/whose/where)","Câu điều kiện loại 1–2–3 + đảo ngữ nhẹ","Bị động trong Task 1 process","Mệnh đề danh từ (what/the fact that)",
              "Mạo từ a/an/the và danh từ không đếm được","Thì trong Task 1 (quá khứ / dự đoán tương lai)","Câu nhượng bộ (although/whereas/despite)","Cụm phân từ rút gọn",
              "So sánh hơn/nhất với số liệu (twice as…, considerably higher)","Hedging (tend to, are likely to)","Sửa lỗi lặp lại trong Error log","Sửa lỗi lặp lại trong Error log","Giữ nhịp","Giữ nhịp"];
  const SFOC=["Chẩn đoán — thu âm nguyên 3 part, không dừng",
    "Part 1: trả lời 2–3 câu (ý → lý do → ví dụ), không trả lời 1 chữ",
    "Part 2: dựng Story Bank — chuyện 1–2 (người, nơi chốn)",
    "Part 2: Story Bank — chuyện 3–4 (đồ vật, sự kiện)",
    "Part 3: trả lời kiểu ý kiến + so sánh quá khứ/hiện tại + dự đoán",
    "Âm cuối /s/ /z/ /t/ /d/ + nhấn trọng âm từ — nghe lại bản thu chỉ soi phát âm",
    "Fluency: không dừng >3 giây, dùng filler tự nhiên (Well, I'd say…)",
    "Part 2: Story Bank — chuyện 5–6 (trải nghiệm, kỹ năng)",
    "Part 2: Story Bank — chuyện 7–8 (công nghệ, môi trường)",
    "Mock speaking với AI giọng nói (ChatGPT voice)","Mock speaking với bạn / người thật","Mock speaking",
    "Giữ nhịp","Giữ nhịp"];
  const DRILL=[
    ["Reading drill — TFNG/YNNG","Cam 15 Test 1 Reading (cả 3 passage, chỉ làm câu TFNG/YNNG trước, rồi phần còn lại)"],
    ["Reading drill — Matching Headings","Cam 15 Test 2 Reading"],
    ["Listening drill — Part 3 + Part 4","Cam 15 Test 3 Listening (nghe lại Part 3–4 lần 2 có transcript)"],
    ["MOCK 1 — Listening + Reading như thi","Cam 17 Test 3 (L 40' + R 60', làm trên máy)"],
    ["Reading drill — Matching Information + Features","Cam 15 Test 4 Reading"],
    ["Listening drill — map/plan + MCQ","Cam 16 Test 1 Listening"],
    ["Reading drill — Summary/Sentence completion","Cam 16 Test 2 Reading"],
    ["MOCK 2 — Listening + Reading như thi","Cam 17 Test 4"],
    ["Reading drill — Passage 3 khó","Cam 16 Test 3 Reading"],
    ["Listening drill — dictation Part 4","Cam 16 Test 3 Listening"],
    ["MOCK 3 — Listening + Reading như thi","Cam 16 Test 4"],
    ["Ôn nhẹ trước thi — chỉ làm 1 passage + 1 part, ngủ đủ","Cam 15 Test 1 (phần chưa làm)"]];
  const n=TESTS.length, S={L:[],R:[],W:[],S:[],D:[],V:[]};
  for(let i=0;i<n;i++){
    const T=TESTS[i], wk="Tuần "+(i+1)+" · ";
    S.L.push({id:"ieL"+(i+1),t:wk+"Listening "+T+" — "+LFOC[i].split(":")[0],
      mat:[[T+" — Listening (sách / audio, hoặc tài khoản luyện đề online)",""]],
      how:["5' đọc trọng tâm: "+LFOC[i]+".","32' làm nguyên bài, nghe 1 lần, trên máy nếu được; 2' soát chính tả.","15' chấm → mỗi câu sai xếp 1 nhãn: chính tả / số nhiều / distractor / không nghe ra / hết giờ đọc trước.",
           "25' mở transcript, nghe lại đúng đoạn sai 2 lần; chép chính tả (dictation) 1 đoạn sai nhiều nhất.","10' shadowing 1 đoạn 1 phút. Ghi band vào Mock log nếu là đề đầy đủ."],
      q:["Đây là các câu Listening tôi sai và transcript (dán). Vì sao tôi bị bẫy và lần sau nghe dấu hiệu gì?"],
      out:"Điểm /40 + bảng nhãn lỗi + 1 đoạn dictation"});
    S.R.push({id:"ieR"+(i+1),t:wk+"Reading "+T+" — "+RFOC[i].split(":")[0],
      mat:[[T+" — Reading",""]],
      how:["5' trọng tâm: "+RFOC[i]+".","60' làm nguyên bài bấm giờ (P1 17' · P2 20' · P3 23').","20' chấm; mỗi câu sai: gạch câu bằng chứng trong bài, ghi lý do sai (paraphrase không nhận ra / đọc thiếu / hết giờ).",
           "5' ghi 10 từ/cụm paraphrase mới vào Anki."],
      q:["Câu này tôi chọn X, đáp án Y (dán đoạn văn). Chỉ cho tôi paraphrase tôi bỏ lỡ."],
      out:"Điểm /40 + câu bằng chứng cho mọi câu sai + 10 thẻ Anki"});
    S.W.push({id:"ieW"+(i+1),t:wk+"Writing "+T+" — "+WFOC[i].split(":")[0],
      mat:[[T+" — Writing Task 1 + Task 2",""],["IELTS Writing band descriptors (public)","https://ielts.org/"]],
      how:["5' trọng tâm: "+WFOC[i]+".","60' viết như thi: T1 20' (≥150 từ) · T2 40' (≥250 từ), gõ trên máy (thi CD-IELTS).",
           "25' dán vào Claude với prompt '✨ IELTS · chấm Writing' — lấy band từng tiêu chí + 3 lỗi ưu tiên.","20' tự sửa 3 lỗi đó ngay trên bài, lưu bài + điểm vào thư mục IELTS/Writing.",
           "10' chép 3 lỗi vào Error log để CN viết lại."],
      q:["(Dùng prompt chấm Writing) Chấm khắt khe theo 4 tiêu chí, nói rõ vì sao không cao hơn 1 band."],
      out:"2 bài viết + band từng tiêu chí + 3 lỗi ưu tiên"});
    S.S.push({id:"ieS"+(i+1),t:wk+"Speaking "+T+" — "+SFOC[i].split(":")[0],
      mat:[[T+" — Speaking (Part 1–3)",""]],
      how:["5' trọng tâm: "+SFOC[i]+".","20' thu âm trên điện thoại: Part 1 (4 câu) → Part 2 (1' chuẩn bị, nói 2') → Part 3 (4 câu).",
           "20' nghe lại BẮT BUỘC: ghi 5 lỗi (ngữ pháp, phát âm, ngập ngừng).","15' nói lại Part 2 lần 2 sửa đúng 5 lỗi đó; nếu đang dựng Story Bank thì viết dàn ý chuyện mới (5 gạch đầu dòng)."],
      q:["Đây là transcript bài nói của tôi (dán). Ước lượng band 4 tiêu chí và 3 lỗi lặp lại nhiều nhất."],
      out:"2 bản thu (trước/sau) + 5 lỗi đã sửa"});
    const d=DRILL[i]||DRILL[DRILL.length-1];
    S.D.push({id:"ieD"+(i+1),t:wk+d[0],mat:[[d[1],""]],
      how:d[0].startsWith("MOCK")?["Làm như thi thật: Listening 40' → nghỉ 5' → Reading 60', trên máy.","Chấm, quy đổi band, GHI vào Mock log (Study Kit → IELTS).","Writing + Speaking của mock làm ở buổi CN tuần này."]
         :["10' xem lại lỗi dạng này trong Error log.","70' làm có kiểm soát: làm từng câu, ghi lý do chọn đáp án trước khi xem key.","30' chấm + phân tích: dấu hiệu nào giúp/không giúp tìm đáp án.","10' tóm tắt 3 quy tắc tự rút ra."],
      q:["Phân tích vì sao tôi sai các câu dạng này và cho tôi 1 quy trình 4 bước để làm dạng này."],
      out:d[0].startsWith("MOCK")?"Band L + R ghi vào Mock log":"3 quy tắc tự rút ra cho dạng câu"});
    const mock=(i===3||i===7||i===10);
    S.V.push({id:"ieV"+(i+1),t:wk+(mock?"MOCK Writing + Speaking (cùng đề mock thứ 7)":"Viết lại T2 + từ vựng "+VOC[i]+" + ngữ pháp"),
      mat:mock?[["Writing + Speaking của đề mock tuần này",""]]:[["Bài Writing thứ 5 + Error log",""],["Cambridge Vocabulary for IELTS (chủ đề tương ứng) hoặc bài mẫu Cambridge",""]],
      how:mock?["60' Writing như thi.","15' Speaking thu âm đủ 3 part.","30' chấm cả hai bằng AI, ghi band W + S vào Mock log → tính overall.","15' quyết định: ≥7.0 ở 2 mock liên tiếp → đặt lịch thi."]
        :["45' viết lại Task 2 hôm thứ 5 (cùng đề) áp dụng 3 lỗi ưu tiên — so sánh 2 bản.","30' từ vựng chủ đề "+VOC[i]+": 15 collocation + đặt câu với 5 cái → Anki.","30' ngữ pháp: "+GRAM[i]+" — viết 6 câu dùng cấu trúc này.","15' rà Error log cả tuần, chọn 2 lỗi theo sát tuần sau."],
      q:mock?["Chấm Writing + Speaking mock và ước lượng overall band."]:["So sánh bản 1 và bản 2 bài Task 2 của tôi: đã sửa được lỗi nào, còn lỗi nào?"],
      out:mock?"Band W + S + overall ghi vào Mock log":"Bản viết lại + 15 collocation + 6 câu ngữ pháp"});
  }
  KIT.ieL={name:"IELTS · Listening",g:"IELTS",track:"IELTS",sessions:S.L};
  KIT.ieR={name:"IELTS · Reading",g:"IELTS",track:"IELTS",sessions:S.R};
  KIT.ieW={name:"IELTS · Writing",g:"IELTS",track:"IELTS",sessions:S.W};
  KIT.ieS={name:"IELTS · Speaking",g:"IELTS",track:"IELTS",sessions:S.S};
  KIT.ieD={name:"IELTS · Luyện dạng + Mock",g:"IELTS",track:"IELTS",sessions:S.D};
  KIT.ieV={name:"IELTS · Viết lại + Từ vựng",g:"IELTS",track:"IELTS",sessions:S.V};
})();

/* ===== MACRO → MICRO — 9 module × 5 buổi (60–90') =====
   Xương sống: Handbook "Trading System & Sector-Specific Fundamental Handbook" BẢN 26/09 của bạn
   (Phần I top-down · IV 19 ngành · V ma trận nhạy cảm · VI workflow) + sổ luật vĩ mô MỀM trong NSI-tin
   + R30/R31 (cấu hình đang chạy). Tài liệu hệ thống là file RIÊNG — không đưa lên repo public. */
const HB=["Handbook BẢN 26/09 (file riêng của bạn — mở trên máy/Drive)",""];
const NSI=["Bản tin sáng NSI-tin — nsi-quantri /tin (tab Tin web)",""];
const PLAYBOOK=["NSI-tin config/macro_playbook.json (sổ luật vĩ mô MỀM)","https://github.com/hson07071979/NSI-tin/blob/main/config/macro_playbook.json"];
const NSO=["Cục Thống kê (NSO) — báo cáo KT-XH tháng/quý","https://www.nso.gov.vn/"];
const SBV=["Ngân hàng Nhà nước (SBV) — lãi suất, tỷ giá trung tâm, OMO","https://www.sbv.gov.vn/"];
const TE=["Trading Economics — Vietnam (chuỗi số liệu nhanh)","https://tradingeconomics.com/vietnam/indicators"];
const PMI=["S&P Global — Vietnam Manufacturing PMI (ngày làm việc đầu tháng)","https://www.google.com/search?q=S%26P+Global+Vietnam+Manufacturing+PMI"];
const FED=["Fed — lịch FOMC (27–28/10 và 8–9/12/2026)","https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"];
const DALIO=["Ray Dalio — How The Economic Machine Works (31')","https://www.economicprinciples.org/"];
const DAMO=["Aswath Damodaran — Damodaran Online (dữ liệu ERP quốc gia, bài giảng)","https://pages.stern.nyu.edu/~adamodar/"];
const CFA=["CFA Institute — Industry & Competitive Analysis / Company Analysis: Forecasting (refresher 2026)","https://www.cfainstitute.org/insights/professional-learning/refresher-readings"];
const PORTER=["Michael Porter — The Five Competitive Forces That Shape Strategy (HBR, 2008)","https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy"];
const BMC=["Strategyzer — Business Model Canvas (mẫu tải miễn phí)","https://www.strategyzer.com/library/the-business-model-canvas"];
const MOAT=["Michael Mauboussin — Measuring the Moat (PDF miễn phí, Morgan Stanley IM)","https://www.google.com/search?q=Mauboussin+Measuring+the+Moat+pdf"];
const MARKS=["Howard Marks — memos (Oaktree)","https://www.oaktreecapital.com/insights/memos"];
const RSCH=["Báo cáo vĩ mô/ngành miễn phí: SSI Research · VNDIRECT · Vietcap · MBS (mục Research trên web từng công ty)",""];
const BCTC=["BCTC + báo cáo thường niên: Vietstock Finance / CafeF (mục Tài chính của mã)","https://finance.vietstock.vn/"];
const IMF=["IMF — Vietnam Article IV (báo cáo mới nhất)","https://www.imf.org/en/Countries/VNM"];
const WB=["World Bank — Taking Stock: Vietnam (bản mới nhất)","https://www.worldbank.org/en/country/vietnam"];
const MJ=["Macro Journal của bạn (Google Sheet 7 cột — tạo ở buổi 1.1)",""];

KIT.macro = { name:"Macro → Micro", g:"MACRO", track:"MACRO", sessions:[
 /* M1 — Khung tư duy: top-down là xương sống, business model quyết định */
 { id:"mc101", ph:"M1 · Khung tư duy", t:"Bản đồ tổng: macro → ngành → earnings → dòng tiền → trigger",
   mat:[HB, ["Handbook — 'Cách dùng tài liệu này' + Phần I mục 1 (earnings bridge)",""], MJ],
   how:["20' đọc Handbook phần mở đầu + earnings bridge (Doanh thu → Biên → Chi phí tài chính/thuế → Cash conversion).",
        "20' vẽ tay 1 sơ đồ: 1 biến vĩ mô (ví dụ lãi suất LNH) chạy qua từng tầng của earnings bridge cho 3 ngành: ngân hàng, CTCK, BĐS.",
        "20' tạo Macro Journal (Google Sheet) 7 cột: ngày · headline · biến vĩ mô · chuỗi nhân quả · ngành được/mất · đã price-in chưa · kiểm lại sau 5 phiên."],
   q:["Phản biện sơ đồ của tôi: mắt xích nào đang nhảy cóc?","Vì sao 'tin tốt' vĩ mô có thể làm giá cổ phiếu giảm?"],
   out:"Sơ đồ 1 trang + Macro Journal đã tạo, có dòng đầu tiên" },
 { id:"mc102", ph:"M1 · Khung tư duy", t:"Cỗ máy kinh tế: năng suất · chu kỳ nợ ngắn · chu kỳ nợ dài",
   mat:[DALIO, MJ],
   how:["31' xem video Dalio, dừng ở 3 chỗ: transaction, short-term debt cycle, deleveraging.",
        "25' viết: Việt Nam 2026 đang ở đâu trong chu kỳ nợ ngắn hạn? Bằng chứng: tăng trưởng tín dụng, lãi suất, giá BĐS (lấy số ở NSO/SBV).",
        "10' ghi 3 câu hỏi còn mở."],
   q:["Dùng khung Dalio, phản biện nhận định 'VN đang ở pha mở rộng tín dụng' của tôi bằng dữ kiện ngược."],
   out:"1 trang: vị trí VN trong chu kỳ nợ + 3 bằng chứng có nguồn" },
 { id:"mc103", ph:"M1 · Khung tư duy", t:"Giá = Earnings × Multiple — 3 cửa vĩ mô chạm vào giá",
   mat:[DAMO, MARKS, MJ],
   how:["20' Multiple ≈ f(lãi suất chiết khấu, phần bù rủi ro, thanh khoản, tăng trưởng). Mỗi tin vĩ mô phải chạm (a) earnings, (b) lãi suất chiết khấu, hoặc (c) phần bù rủi ro/thanh khoản.",
        "25' lấy 5 headline trong bản tin NSI-tin tuần này → xếp từng tin vào cửa a/b/c, ghi vào Macro Journal.",
        "15' tra ERP (equity risk premium) Việt Nam trên Damodaran Online — ghi con số và ý nghĩa."],
   q:["Tin này tôi xếp vào cửa (b), phản biện giúp tôi.","Vì sao cửa (c) thường tác động nhanh nhất lên thị trường VN?"],
   out:"5 headline phân loại a/b/c + ERP Việt Nam ghi lại" },
 { id:"mc104", ph:"M1 · Khung tư duy", t:"Sổ luật vĩ mô MỀM của chính bạn — mức cao vs cú sốc",
   mat:[PLAYBOOK, ["NSI-tin README — mục Nguyên tắc","https://github.com/hson07071979/NSI-tin"]],
   how:["20' đọc 8 cờ: LS_CAO_ON_DINH, LNH_SOC_NGAN, LNH_CANG_KEO_DAI, LNH_HA_NHIET, TY_GIA_CANG, DXY_US10Y_CUNG_TANG, DAU_SOC, VIX_CAO.",
        "25' với mỗi cờ viết lại bằng lời mình: cơ chế (vì sao), ngành bị/được, và vì sao 'surprise > level'.",
        "15' đánh dấu 2 cờ bạn thấy logic yếu nhất → ghi giả thuyết để kiểm bằng research sau (module 9)."],
   q:["Cặp TY_GIA_CANG + LNH_SOC_NGAN nguy hiểm vì sao, theo bộ ba bất khả thi?","Cờ nào trong 8 cờ dễ bị 'đã price-in' nhất?"],
   out:"Bảng 8 cờ: cơ chế · ngành · độ tin của bạn (1–5) + 2 giả thuyết cần kiểm" },
 { id:"mc105", ph:"M1 · Khung tư duy", t:"Tổng kết M1 — 1 trang 'cách tôi đọc vĩ mô'",
   mat:[MJ],
   how:["40' viết 1 trang: quy trình 5 bước bạn sẽ dùng mỗi sáng khi đọc bản tin (từ tin → cửa a/b/c → cờ nào → ngành nào → kiểm sau 5 phiên).",
        "20' áp dụng thử với bản tin sáng nay."],
   q:["Quy trình đọc vĩ mô của tôi còn thiếu bước kiểm chứng nào?"], out:"Quy trình 5 bước (dán lên đầu Macro Journal)" },

 /* M2 — Tăng trưởng & chu kỳ */
 { id:"mc201", ph:"M2 · Tăng trưởng", t:"GDP Việt Nam theo cấu phần: C + I + G + NX và phía cung",
   mat:[NSO, TE, HB],
   how:["25' mở báo cáo KT-XH quý gần nhất của NSO: tăng trưởng GDP theo khu vực (nông–công nghiệp & xây dựng–dịch vụ) và theo sử dụng.",
        "25' lập bảng 8 quý gần nhất: GDP, công nghiệp chế biến chế tạo, bán lẻ, xuất khẩu.",
        "10' ngành nào có operating leverage cao với GDP (Handbook Phần I: 'không dùng GDP như tín hiệu mua')."],
   q:["Tăng trưởng GDP quý này đến từ đâu là chính, và có bền không?"], out:"Bảng 8 quý + 3 câu nhận định có số" },
 { id:"mc202", ph:"M2 · Tăng trưởng", t:"Chỉ báo sớm: PMI · IIP · bán lẻ thực · xuất nhập khẩu",
   mat:[PMI, NSO, MJ],
   how:["20' PMI > 50 nghĩa là gì; đơn hàng mới vs sản lượng; vì sao PMI đi trước IIP.",
        "25' cập nhật 6 tháng PMI + IIP + bán lẻ (tách lạm phát: bán lẻ danh nghĩa − CPI ≈ thực).",
        "15' ghi vào Macro Journal: tín hiệu nào đang 'quay đầu'."],
   q:["Bán lẻ danh nghĩa tăng nhưng thực tăng chậm — ngành bán lẻ nào bị ảnh hưởng?"], out:"Dashboard mini 4 chỉ báo × 6 tháng" },
 { id:"mc203", ph:"M2 · Tăng trưởng", t:"FDI đăng ký vs giải ngân + đầu tư công — động cơ của KCN, xây dựng, vật liệu",
   mat:[NSO, ["Bộ Tài chính — tiến độ giải ngân vốn đầu tư công","https://www.mof.gov.vn/"], HB],
   how:["20' phân biệt FDI registered vs disbursed (Handbook Phần I).","25' lập bảng giải ngân đầu tư công lũy kế năm nay so kế hoạch.",
        "15' nối: ngành nào trong universe TOP 105 hưởng (KCN, đá–xi măng–thép, xây dựng, logistics)."],
   q:["Giải ngân đầu tư công chuyển thành doanh thu doanh nghiệp xây dựng với độ trễ bao lâu?"], out:"Bảng FDI + đầu tư công + danh sách ngành hưởng lợi" },
 { id:"mc204", ph:"M2 · Tăng trưởng", t:"Đọc báo cáo vĩ mô của CTCK như analyst",
   mat:[RSCH, WB],
   how:["40' đọc 1 báo cáo vĩ mô tháng/quý mới nhất của SSI hoặc VNDIRECT.","20' ghi: 3 giả định chính của họ, con số dự báo, và 1 chỗ bạn không đồng ý (có lý do)."],
   q:["Giả định nào trong báo cáo này nhạy nhất nếu sai?"], out:"Tóm tắt 1/2 trang + 1 phản biện" },
 { id:"mc205", ph:"M2 · Tăng trưởng", t:"Cổng M2 — viết đoạn 'Tăng trưởng' cho Macro Note",
   mat:[MJ],
   how:["45' viết 250 từ: VN đang tăng trưởng nhờ đâu, bền hay không, rủi ro 2 quý tới — mọi câu có số và nguồn.","15' tự soát: câu nào là narrative không có số → xoá."],
   q:["Chấm đoạn này như một trưởng phòng phân tích khó tính."], out:"Đoạn 'Tăng trưởng' 250 từ" },

 /* M3 — Tiền tệ, lãi suất, thanh khoản (cầu nối với IF + với cờ LNH) */
 { id:"mc301", ph:"M3 · Tiền tệ", t:"SBV điều hành thế nào: lãi suất điều hành, OMO, tín phiếu, room tín dụng",
   mat:[SBV, HB],
   how:["25' các công cụ: lãi suất tái cấp vốn/tái chiết khấu, OMO (bơm), tín phiếu (hút), hạn mức tín dụng.","25' theo dõi 4 tuần gần nhất: SBV bơm hay hút ròng qua OMO? LNH qua đêm đi thế nào?","10' nối với cờ LNH trong sổ luật."],
   q:["SBV hút VND qua tín phiếu thì LNH, tỷ giá, cổ phiếu CTCK phản ứng theo chuỗi nào?"], out:"Bảng OMO/LNH 4 tuần + chuỗi nhân quả" },
 { id:"mc302", ph:"M3 · Tiền tệ", t:"Tăng trưởng tín dụng vs huy động — sức khoẻ ngân hàng",
   mat:[SBV, HB, ["Handbook Phần IV — mục 15 Ngân hàng",""]],
   how:["20' Handbook mục Ngân hàng: NIM, CASA, LDR, NPL, CAR.","30' lấy số tín dụng/huy động lũy kế năm của SBV → 'khoảng hở' tín dụng–huy động.","10' khoảng hở rộng thì LNH và lãi suất huy động sẽ đi đâu?"],
   q:["Khi tín dụng tăng nhanh hơn huy động, ngân hàng nào chịu áp lực NIM trước?"], out:"Bảng tín dụng vs huy động + 3 hệ quả" },
 { id:"mc303", ph:"M3 · Tiền tệ", t:"Fed, DXY, US10Y → chênh lệch lãi suất → USD/VND (nối IF Ch.6 parity)",
   mat:[FED, ["IF Ch.6 — bài tóm tắt Parity","study/if/ch06.html"], PLAYBOOK],
   how:["20' Interest rate parity áp vào USD/VND: chênh lãi suất VND–USD vs forward premium.","25' tra: lãi suất Fed hiện tại, DXY, US10Y, lãi suất LNH VND → tính chênh lệch.","15' cờ DXY_US10Y_CUNG_TANG: khi nào thì đáng lo (khi kéo theo TY_GIA_CANG)."],
   q:["FOMC 27–28/10 cắt/giữ lãi suất thì kịch bản cho USD/VND và SBV là gì?"], out:"Bảng chênh lệch lãi suất + 2 kịch bản FOMC" },
 { id:"mc304", ph:"M3 · Tiền tệ", t:"Thanh khoản thị trường chứng khoán: margin, ADTV, dòng tiền ngoại",
   mat:[HB, ["Handbook Phần IV — mục 16 Dịch vụ tài chính",""], RSCH],
   how:["25' chuỗi: lãi suất → chi phí margin → dư nợ margin → ADTV → khả năng breakout thành công (vì sao cờ LNH_CANG_KEO_DAI ảnh hưởng hệ của bạn).","25' tìm số dư nợ margin toàn thị trường quý gần nhất + ADTV 3 tháng.","10' ghi vào Journal."],
   q:["Vì sao thanh khoản co lại làm breakout dễ thất bại? Có bằng chứng thực nghiệm nào?"], out:"Chuỗi nhân quả lãi suất → breakout + số margin/ADTV" },
 { id:"mc305", ph:"M3 · Tiền tệ", t:"Cổng M3 — đoạn 'Tiền tệ & thanh khoản' cho Macro Note",
   mat:[MJ], how:["45' viết 250 từ có số.","15' so với cờ hiện tại trong NSI-tin: cờ nào đang bật, bạn đồng ý không?"],
   q:["Chấm đoạn này: lập luận nào thiếu cơ chế?"], out:"Đoạn 'Tiền tệ' 250 từ" },

 /* M4 — Lạm phát, tỷ giá, cán cân (nối IF Ch.3, 9) */
 { id:"mc401", ph:"M4 · Lạm phát & tỷ giá", t:"CPI và lạm phát lõi: giá hay sản lượng?",
   mat:[NSO, HB], how:["20' CPI vs lạm phát cơ bản; nhóm hàng nặng ký (lương thực, nhà ở–điện nước, giao thông).","25' 12 tháng CPI + lõi.","15' Handbook: tách 'price-led' khỏi 'volume-led growth' — áp vào 1 ngành."],
   q:["CPI tăng do giá dầu thì ngành nào lợi/hại (nối cờ DAU_SOC)?"], out:"Biểu đồ CPI 12 tháng + 1 ví dụ price vs volume" },
 { id:"mc402", ph:"M4 · Lạm phát & tỷ giá", t:"Cán cân thanh toán Việt Nam và áp lực tỷ giá (nối IF Ch.3)",
   mat:[IMF, ["IF Ch.3 — BoP","study/if/ch03.html"], NSO],
   how:["25' từ Article IV: cán cân vãng lai, FDI, kiều hối, dự trữ ngoại hối (bao nhiêu tháng nhập khẩu).","25' lập bảng BoP VN 3 năm.","10' rút ra: nguồn cung USD bền nhất là gì."],
   q:["Thặng dư thương mại lớn mà tỷ giá vẫn căng — giải thích bằng tài khoản vốn/tài chính."], out:"Bảng BoP VN 3 năm + kết luận" },
 { id:"mc403", ph:"M4 · Lạm phát & tỷ giá", t:"Tỷ giá & doanh nghiệp: ai lợi, ai hại (nợ USD, xuất khẩu, nhập nguyên liệu)",
   mat:[PLAYBOOK, HB, BCTC],
   how:["20' cờ TY_GIA_CANG: danh sách ngành lợi/hại.","30' chọn 2 mã trong universe (1 xuất khẩu, 1 nợ USD) → tìm trong thuyết minh BCTC: nợ ngoại tệ, lỗ/lãi tỷ giá.","10' ghi độ nhạy ước tính: USD/VND +1% → LNST ±?%."],
   q:["Kiểm phép tính độ nhạy tỷ giá của tôi (dán số)."], out:"Độ nhạy tỷ giá của 2 mã" },
 { id:"mc404", ph:"M4 · Lạm phát & tỷ giá", t:"Hàng hoá: dầu, khí, thép, cao su, phân bón → ngành nào trong universe",
   mat:[HB, ["Handbook Phần IV — Dầu khí, Vật liệu, Hoá chất",""], TE],
   how:["25' crack spread, giá khí, giá thép HRC, giá cao su — mỗi loại ứng với mã nào (GAS, PLX, BSR, HPG, GVR, DPM/DCM…).","25' bảng giá 6 tháng.","10' nối với deal thật: GAS 29/12, PLX 07/01/2026 có driver hàng hoá gì?"],
   q:["PLX hưởng lợi hay chịu hại khi giá dầu giảm? Phân tích theo biên bán lẻ và tồn kho."], out:"Bảng hàng hoá → mã + phân tích PLX/GAS" },
 { id:"mc405", ph:"M4 · Lạm phát & tỷ giá", t:"Cổng M4 — đoạn 'Lạm phát, tỷ giá, hàng hoá' cho Macro Note",
   mat:[MJ], how:["45' viết 250 từ có số.","15' cập nhật Macro Journal."], q:["Chấm đoạn này."], out:"Đoạn 250 từ" },

 /* M5 — Tài khoá, chính sách, cấu trúc thị trường */
 { id:"mc501", ph:"M5 · Chính sách & thị trường", t:"Nâng hạng FTSE (hiệu lực 9/2026): dòng vốn, CTCK, vốn hoá lớn",
   mat:[["Cổng TTĐT Chính phủ — lộ trình nâng hạng","https://baochinhphu.vn/chinh-thuc-xac-nhan-lo-trinh-nang-hang-thi-truong-chung-khoan-viet-nam-102260407214555354.htm"], HB, RSCH],
   how:["20' nâng hạng thay đổi gì: quỹ thụ động, chủ động, yêu cầu hạ tầng (non-prefunding, CCP…).","25' tìm danh sách mã được thêm vào rổ FTSE và ước tính dòng tiền.","15' tác động lên CTCK (ADTV, margin) — nối Handbook mục 16."],
   q:["Vì sao tin nâng hạng thường 'mua tin đồn bán sự thật'? Bằng chứng ở thị trường khác?"], out:"1 trang tác động nâng hạng" },
 { id:"mc502", ph:"M5 · Chính sách & thị trường", t:"Tài khoá: thu–chi ngân sách, trái phiếu Chính phủ, thuế",
   mat:[["Bộ Tài chính","https://www.mof.gov.vn/"], IMF], how:["25' bội chi, nợ công, lợi suất TPCP 10 năm VN.","25' lợi suất TPCP vs lãi suất huy động — ảnh hưởng ngân hàng và bảo hiểm (investment yield).","10' ghi Journal."],
   q:["Lợi suất TPCP tăng ảnh hưởng thế nào tới công ty bảo hiểm?"], out:"Bảng tài khoá + 2 hệ quả ngành" },
 { id:"mc503", ph:"M5 · Chính sách & thị trường", t:"Chính sách ngành: BĐS (pháp lý, đất đai), điện (quy hoạch), ngân hàng (room)",
   mat:[HB, ["Bộ Công Thương — kế hoạch vận hành hệ thống điện 2026","https://moit.gov.vn/en/news/industry-and-trade/moit-reviews-2026-national-power-system-operation-plan.html"]],
   how:["30' mỗi ngành 1 chính sách đang thay đổi, ghi: thay đổi gì → ai lợi → khi nào vào lợi nhuận.","30' nối với mã trong universe (POW, NT2, PC1, BĐS, NH)."],
   q:["Chính sách giá điện mới ảnh hưởng nhiệt điện khí vs thuỷ điện khác nhau thế nào?"], out:"Bảng 3 chính sách × ngành × mã" },
 { id:"mc504", ph:"M5 · Chính sách & thị trường", t:"Chu kỳ thị trường & tâm lý — Howard Marks",
   mat:[MARKS], how:["40' đọc 1 memo về chu kỳ/rủi ro.","20' viết: thị trường VN hiện ở đâu trên 'quả lắc' tham lam–sợ hãi, bằng chứng?"],
   q:["Phản biện đánh giá tâm lý thị trường của tôi."], out:"1/2 trang vị trí chu kỳ" },
 { id:"mc505", ph:"M5 · Chính sách & thị trường", t:"Cổng M5 — Macro Note bản nháp 1 (ghép M2–M5)",
   mat:[MJ], how:["60' ghép 4 đoạn thành Macro Note 2 trang, thêm 'kịch bản cơ sở / tích cực / tiêu cực' với xác suất.","30' bảng 'nếu–thì' cho 3 biến quan trọng nhất."],
   q:["Kịch bản nào tôi đang đánh giá quá cao xác suất?"], out:"Macro Note v1 (2 trang)" },

 /* M6 — Vĩ mô → ngành */
 { id:"mc601", ph:"M6 · Vĩ mô → ngành", t:"Ma trận nhạy cảm ngành (Handbook Phần V) — cập nhật bằng số hôm nay",
   mat:[HB, ["Handbook Phần V — ma trận 19 ngành × 7 biến",""]],
   how:["30' với mỗi biến (lãi suất, thanh khoản, FX, tiêu dùng, đầu tư công, FDI/thương mại, hàng hoá): hướng hiện tại là gì (từ M2–M5).","30' tô màu ma trận: ngành nào đang có 'gió xuôi' nhiều nhất."],
   q:["Ma trận của tôi đang mâu thuẫn ở ngành nào?"], out:"Ma trận tô màu với dữ liệu tháng này" },
 { id:"mc602", ph:"M6 · Vĩ mô → ngành", t:"Ngành ngân hàng — driver, KPI, chu kỳ",
   mat:[HB, ["GTHT — Banking Sector 1H2026","https://gtht.com.vn/en/research/en-gthtsvn-research_banking-sector_1h2026-earnings-update_aug-20-2026/"]],
   how:["30' đọc báo cáo ngành; điền bảng KPI 5 ngân hàng trong universe: tín dụng, NIM, CASA, NPL, chi phí dự phòng, ROE.","20' xếp hạng theo 'đang cải thiện' (không phải 'đang cao').","10' Journal."],
   q:["NIM ổn định khác nhau theo CASA — giải thích cơ chế."], out:"Bảng KPI 5 NH + xếp hạng cải thiện" },
 { id:"mc603", ph:"M6 · Vĩ mô → ngành", t:"Ngành chứng khoán — ADTV, margin, tự doanh (VIX 02/07/2025 = 27,9% lợi nhuận hệ)",
   mat:[HB, ["S&I Ratings — Vietnam Brokerage Sector 2026","https://sniratings.com.vn/en/brokerage-sector/2026-vietnam-brokerage-sector-credit-outlook-beginning-a-new-development-cycle/"]],
   how:["30' driver CTCK: ADTV, dư nợ margin, chi phí vốn, tự doanh.","25' post-mortem VIX 07/2025: bối cảnh vĩ mô–ngành lúc đó là gì (thanh khoản, nâng hạng, lãi suất)?","5' Journal."],
   q:["Deal VIX 07/2025 thắng lớn vì yếu tố ngành hay vì riêng doanh nghiệp?"], out:"Post-mortem VIX 1/2 trang" },
 { id:"mc604", ph:"M6 · Vĩ mô → ngành", t:"Năng lượng & tiện ích — GAS, PLX, POW, NT2, PC1",
   mat:[HB, ["Handbook Phần IV — Dầu khí, Điện",""]],
   how:["30' driver: giá dầu/khí, huy động điện, giá điện, thuỷ văn, quy hoạch.","25' post-mortem GAS 29/12/2025 (+42,8%) và PLX 07/01/2026: câu chuyện vĩ mô–ngành phía sau.","5' Journal."],
   q:["Có cách nào nhận ra 'sóng ngành' năng lượng sớm hơn từ dữ liệu vĩ mô không?"], out:"Post-mortem GAS + PLX" },
 { id:"mc605", ph:"M6 · Vĩ mô → ngành", t:"Cổng M6 — 'Checklist ngành tiềm năng' 10 câu cho 3 ngành gió xuôi",
   mat:[HB, ["Handbook Phần VI — Checklist 10 câu",""]],
   how:["60' trả lời 10 câu cho 3 ngành gió xuôi nhất trong ma trận.","30' chọn 1 ngành tốt nhất → đó là ngành cho M7–M8."],
   q:["Câu nào trong checklist tôi trả lời bằng cảm tính?"], out:"3 checklist + 1 ngành được chọn" },

 /* M7 — Business model (phần quan trọng nhất) */
 { id:"mc701", ph:"M7 · Business model", t:"Doanh nghiệp kiếm tiền thế nào — Business Model Canvas",
   mat:[BMC, CFA],
   how:["15' 9 ô: khách hàng, giá trị, kênh, quan hệ, dòng doanh thu, nguồn lực, hoạt động, đối tác, cấu trúc chi phí.","45' điền canvas cho 1 doanh nghiệp đầu ngành bạn chọn ở M6 (dùng báo cáo thường niên).","15' khoanh 2 ô quyết định lợi nhuận."],
   q:["Canvas này còn thiếu dòng doanh thu hay chi phí nào quan trọng?"], out:"Canvas 1 doanh nghiệp" },
 { id:"mc702", ph:"M7 · Business model", t:"Unit economics: volume × price × mix → biên → tiền",
   mat:[BCTC, HB], how:["20' tách doanh thu 3 năm thành volume × giá (lấy sản lượng từ BCTN).","30' biên gộp, biên EBIT, đòn bẩy hoạt động: doanh thu +10% → EBIT +?%.","20' cash conversion: CFO/LNST, vốn lưu động, capex."],
   q:["Kiểm bảng tách volume–giá của tôi (dán)."], out:"Bảng unit economics 3 năm" },
 { id:"mc703", ph:"M7 · Business model", t:"Cạnh tranh — 5 lực Porter + vị thế chi phí",
   mat:[PORTER, CFA], how:["30' đọc bài Porter (phần 5 lực).","30' áp vào ngành đã chọn: lực nào mạnh nhất, ai có pricing power.","15' đường cong chi phí (cost curve): doanh nghiệp đứng ở đâu."],
   q:["Phản biện đánh giá 5 lực của tôi."], out:"Bảng 5 lực + vị thế chi phí" },
 { id:"mc704", ph:"M7 · Business model", t:"Lợi thế bền (moat) — đo bằng ROIC qua chu kỳ",
   mat:[MOAT, BCTC], how:["30' đọc Measuring the Moat (phần nguồn lợi thế).","30' tính ROIC 5 năm của doanh nghiệp, so WACC (dùng cách tính ở IF Ch.13).","15' kết luận: moat thật hay lợi nhuận chu kỳ?"],
   q:["ROIC cao nhưng chỉ trong 2 năm bùng nổ — có phải moat không?"], out:"ROIC 5 năm vs WACC + kết luận moat" },
 { id:"mc705", ph:"M7 · Business model", t:"Cổng M7 — 1 trang 'business model' theo khung analyst",
   mat:[], how:["60' viết: kiếm tiền thế nào · driver lợi nhuận · lợi thế · rủi ro lớn nhất · KPI cần theo dõi hàng quý.","30' so với báo cáo CTCK về cùng mã — họ thấy gì bạn không thấy?"],
   q:["Chấm như trưởng phòng phân tích."], out:"Business model 1 trang" },

 /* M8 — Bottom-up: từ doanh nghiệp đi lên */
 { id:"mc801", ph:"M8 · Bottom-up", t:"Đọc BCTC nhanh trong 30': 10 chỉ số cờ đỏ",
   mat:[BCTC, HB], how:["40' với doanh nghiệp đã chọn: CFO vs LNST, phải thu, tồn kho, nợ vay ngắn hạn, ICR, D/E, giao dịch bên liên quan, lãi khác bất thường, kiểm toán ngoại trừ, cổ tức vs CFO.","20' khớp với cổng CFO/ICR/DE trong hệ của bạn."],
   q:["Chỉ số nào ở đây đáng lo nhất?"], out:"Bảng 10 cờ đỏ" },
 { id:"mc802", ph:"M8 · Bottom-up", t:"Dự phóng 2 năm: driver → doanh thu → LNST (3 kịch bản)",
   mat:[CFA, BCTC], how:["60' dự phóng từ driver M7 (không từ % tăng trưởng chung chung).","30' 3 kịch bản gắn với 3 kịch bản vĩ mô ở Macro Note."],
   q:["Giả định nào trong dự phóng nhạy nhất? Làm sensitivity giúp tôi."], out:"Dự phóng 3 kịch bản" },
 { id:"mc803", ph:"M8 · Bottom-up", t:"Định giá gắn với kỳ vọng: thị trường đang price-in gì?",
   mat:[DAMO], how:["30' reverse DCF / P/E ngụ ý: giá hiện tại ngụ ý tăng trưởng bao nhiêu.","30' so với dự phóng của bạn → chênh lệch kỳ vọng.","15' kết luận: kỳ vọng thị trường quá cao/thấp."],
   q:["Kiểm reverse DCF của tôi."], out:"Bảng kỳ vọng ngụ ý vs của bạn" },
 { id:"mc804", ph:"M8 · Bottom-up", t:"Micro → Macro: cộng dồn earnings ngành → thị trường",
   mat:[RSCH], how:["30' lấy tăng trưởng LNST quý gần nhất của top 30 vốn hoá (báo cáo CTCK tổng hợp mùa KQKD).","30' ngành nào đóng góp nhiều nhất vào tăng trưởng lợi nhuận VN-Index? Có khớp câu chuyện vĩ mô không?"],
   q:["Nếu lợi nhuận tăng chỉ nhờ 2 ngành, rủi ro tập trung là gì?"], out:"Bảng đóng góp tăng trưởng LN theo ngành" },
 { id:"mc805", ph:"M8 · Bottom-up", t:"Cổng M8 — đối chiếu top-down vs bottom-up",
   mat:[MJ], how:["60' viết 1 trang: chỗ 2 hướng khớp nhau (độ tin cao) và chỗ lệch (cần theo dõi).","30' cập nhật Macro Note."],
   q:["Chỗ lệch nào là cơ hội, chỗ nào là rủi ro?"], out:"Bảng khớp/lệch" },

 /* M9 — Ghép thành luận điểm + nối hệ giao dịch + nghề quản lý tài sản */
 { id:"mc901", ph:"M9 · Ghép & áp dụng", t:"Post-mortem 5 deal lớn nhất của hệ: vĩ mô–ngành–doanh nghiệp đóng vai trò gì?",
   mat:[["R30/R31 (file riêng) + Handbook PHỤ LỤC A",""], HB],
   how:["60' với 5 deal lớn nhất (64,8% lợi nhuận): ghi bối cảnh vĩ mô, sóng ngành, câu chuyện doanh nghiệp tại ngày mua.","30' có mẫu chung nào lặp lại không?"],
   q:["Tôi thấy mẫu X lặp lại ở 3/5 deal — đó là tín hiệu hay trùng hợp? Cần bao nhiêu deal để tin?"], out:"Bảng 5 deal × 3 tầng + 1 giả thuyết" },
 { id:"mc902", ph:"M9 · Ghép & áp dụng", t:"Biến giả thuyết vĩ mô thành câu hỏi research đúng chuẩn của bạn",
   mat:[PLAYBOOK, ["Chuẩn kiểm: mẫu ≥ 20, bootstrap, theo năm, bỏ deal biên, walk-forward lồng (NSI-tin README)",""]],
   how:["40' chọn 1 giả thuyết (ứng viên số 1 trong sổ luật là LNH_CANG_KEO_DAI) → viết đề cương: biến, ngưỡng, deal bị ảnh hưởng, tiêu chí chấp nhận như R11.","20' ghi rõ: chỉ chạy research, không đụng PROD khi chưa qua 5 lớp."],
   q:["Đề cương này có nguy cơ look-ahead hay data-snooping ở đâu?"], out:"Đề cương research 1 trang" },
 { id:"mc903", ph:"M9 · Ghép & áp dụng", t:"Luận điểm đầu tư mẫu cho khách hàng (góc quản lý tài sản)",
   mat:[MJ], how:["60' viết 1 'investment memo' 1 trang cho khách: bối cảnh vĩ mô → ngành → doanh nghiệp → rủi ro → theo dõi gì. Ngôn ngữ dễ hiểu, không khuyến nghị mua bán.","30' đọc to như đang tư vấn — bấm giờ 3 phút."],
   q:["Memo này khách không chuyên đọc có hiểu không? Câu nào quá thuật ngữ?"], out:"Investment memo 1 trang + bản ghi âm 3'" },
 { id:"mc904", ph:"M9 · Ghép & áp dụng", t:"Macro Note bản cuối (3 trang) — dùng cho hồ sơ Investment Analyst",
   mat:[MJ], how:["75' hoàn thiện: tóm tắt 5 dòng · tăng trưởng · tiền tệ · tỷ giá–lạm phát · chính sách · ma trận ngành · 3 kịch bản · KPI theo dõi.","15' định dạng sạch, nguồn đầy đủ."],
   q:["Chấm Macro Note như người tuyển dụng ở CTCK."], out:"Macro Note 3 trang (PDF)" },
 { id:"mc905", ph:"M9 · Ghép & áp dụng", t:"Nếp duy trì sau khoá: 30' đọc báo + Journal + review tháng",
   mat:[NSI, MJ], how:["30' viết nếp: mỗi sáng 30' đọc báo → 1 dòng Journal; mỗi CN kiểm lại dự đoán 5 phiên trước; mỗi tháng cập nhật ma trận ngành sau báo cáo NSO.","30' review cả khoá: 3 thứ đã thay đổi trong cách bạn nhìn thị trường."],
   q:[], out:"Nếp duy trì + review khoá" }
]};

/* ===== KÊNH '5 phút đọc báo' — 2 tuần nghiên cứu (8 buổi × 1h) rồi chu kỳ sản xuất 4 buổi/tuần ===== */
(function(){
  const NQS=["TikTok Người Quan Sát (@nqs.kinhte) — kênh mẫu về nhịp & format","https://www.tiktok.com/@nqs.kinhte"];
  const R=[
   {t:"Mổ xẻ kênh mẫu: 10 video Người Quan Sát",mat:[NQS],how:["40' xem 10 video gần nhất, mỗi video ghi: câu hook 3 giây đầu · độ dài · số tin · kiểu phụ đề · nhạc · B-roll · CTA cuối · view/like.","20' tìm 3 điểm chung của 3 video nhiều view nhất."],q:["Từ bảng 10 video (dán), mẫu hook nào lặp lại ở video viral?"],out:"Bảng 10 video × 8 cột + 3 mẫu chung"},
   {t:"Quét đối thủ: 5 kênh 'điểm tin tài chính ngắn'",mat:[["TikTok — tìm #tintuckinhte #chungkhoan #taichinh",""]],how:["40' tìm 5 kênh tin tài chính tiếng Việt cùng kiểu; ghi follower, tần suất, góc nhìn, chất lượng.","20' chỗ trống: góc nào chưa ai làm tốt? (gợi ý: 'tin này ảnh hưởng ngành nào' — đúng thế mạnh macro→ngành của bạn)."],q:["Đề xuất 3 cách định vị khác biệt dựa trên bảng đối thủ (dán bảng)."],out:"Bảng 5 đối thủ + 1 khoảng trống định vị"},
   {t:"Định vị kênh: tên, lời hứa 1 câu, người xem, series",mat:[],how:["20' viết lời hứa 1 câu (VD: '5 phút mỗi sáng: tin gì, ảnh hưởng ngành nào, bạn cần để ý gì').","20' chân dung người xem (tuổi, nghề, đang đầu tư gì).","20' 3 series cố định: Điểm tin sáng · 1 biểu đồ vĩ mô/tuần · Giải thích 1 thuật ngữ."],q:["Lời hứa này đã đủ cụ thể và khác biệt chưa?"],out:"1 trang định vị kênh"},
   {t:"Pipeline từ NSI-tin → kịch bản video",mat:[["Repo NSI-tin — out/latest.json, mục '3 điều cần biết'","https://github.com/hson07071979/NSI-tin"]],how:["20' mở latest.json/ trang /tin: phần nào dùng được cho video (chỉ tab Tin web + ảnh chụp vĩ mô).","⚠️ Tuyệt đối không đưa nội dung nhóm Zalo kín lên kênh (README ghi rõ là tin nhóm kín).","25' thiết kế quy trình 15': chọn 3 tin → mỗi tin 2 câu + 1 câu 'ảnh hưởng ngành nào' → hook.","15' cân nhắc: thêm 1 mục 'video_script' vào bản tin sáng của bot (ghi ý tưởng, chưa sửa code)."],q:["Viết giúp tôi template prompt để AI biến '3 điều cần biết' thành kịch bản 60–75 giây tiếng Việt, giọng tự nhiên, có dẫn nguồn."],out:"Quy trình 15' + template kịch bản"},
   {t:"Kịch bản mẫu: viết 2 script 60–75 giây",mat:[],how:["Cấu trúc: hook 3s (con số/câu hỏi) → 3 tin × 15s → 'vì sao quan trọng với túi tiền bạn' → CTA.","Viết 2 script từ bản tin 2 ngày khác nhau, đọc to bấm giờ."],q:["Cắt kịch bản này xuống 65 giây mà không mất ý."],out:"2 script ≤ 75 giây"},
   {t:"Công cụ: CapCut (auto caption, template), giọng đọc, B-roll hợp pháp",mat:[["CapCut","https://www.capcut.com/"]],how:["25' học auto-caption, keyframe zoom, template chữ.","15' quyết định giọng: giọng thật (khuyên dùng — xây thương hiệu cá nhân cho nghề) hay AI.","20' nguồn hình hợp pháp: tự chụp màn hình biểu đồ, ảnh tự tạo, kho miễn phí (Pexels/Pixabay); KHÔNG lấy video của kênh khác."],q:[],out:"1 template CapCut riêng của kênh"},
   {t:"Video thử #1 — quay + edit, KHÔNG đăng",mat:[],how:["Quay 1 script, edit bằng template, bấm thời gian từng bước.","Xem lại trên điện thoại như người lạ: 3 giây đầu có giữ chân không?"],q:[],out:"Video thử + thời gian làm (mục tiêu ≤ 45')"},
   {t:"Luật an toàn + lịch đăng",mat:[["UBCKNN — quy định về tư vấn đầu tư chứng khoán","https://ssc.gov.vn/"]],how:["20' bạn đang làm ở CTCK: KHÔNG khuyến nghị mua/bán mã cụ thể, KHÔNG hứa lợi nhuận; thêm câu miễn trừ 'không phải khuyến nghị đầu tư'. Hỏi lại quy định nội bộ công ty về việc làm kênh cá nhân.","15' dẫn nguồn báo gốc, tóm tắt bằng lời mình (không đọc nguyên văn bài báo).","25' chốt lịch: 3 video/tuần (T3, T5, CN sáng) + giờ đăng."],q:["Rà kịch bản này giúp tôi: câu nào có thể bị xem là khuyến nghị đầu tư?"],out:"Checklist an toàn 6 dòng + lịch đăng"}
  ];
  const S=R.map((x,i)=>Object.assign({id:"ch0"+(i+1),ph:"Nghiên cứu"},x));
  for(let w=1;w<=8;w++){
    S.push({id:"ch"+w+"a",ph:"Sản xuất · tuần "+w,t:"Tuần "+w+" · Chọn tin + viết 2–3 script",mat:[NSI],how:["Từ bản tin sáng 3 ngày gần nhất chọn 3 câu chuyện mạnh nhất.","Viết script theo template, đọc to bấm giờ, chạy checklist an toàn."],q:["Viết lại hook này cho mạnh hơn (3 phương án)."],out:"2–3 script sẵn sàng"});
    S.push({id:"ch"+w+"b",ph:"Sản xuất · tuần "+w,t:"Tuần "+w+" · Quay + edit video 1",mat:[],how:["Quay 1 lần liền, edit bằng template, xuất 1080×1920."],q:[],out:"Video 1 sẵn sàng đăng"});
    S.push({id:"ch"+w+"c",ph:"Sản xuất · tuần "+w,t:"Tuần "+w+" · Quay + edit video 2 (+3 nếu kịp)",mat:[],how:["Như video 1; thử 1 thay đổi nhỏ (hook khác / độ dài khác) để A/B."],q:[],out:"Video 2 sẵn sàng"});
    S.push({id:"ch"+w+"d",ph:"Sản xuất · tuần "+w,t:"Tuần "+w+" · Đăng + đo số + học 1 video viral",mat:[NQS],how:["Ghi số mỗi video sau 48h: view, % xem hết, like, share, follow mới.","Phân tích 1 video viral tuần này của kênh mẫu: họ làm gì mà mình chưa làm.","Chọn ĐÚNG 1 thứ để đổi tuần sau."],q:["Từ số liệu (dán), video nào tốt hơn và vì sao?"],out:"Bảng số liệu tuần + 1 thay đổi cho tuần sau"});
  }
  KIT.ch={name:"Kênh '5 phút đọc báo'",g:"CH",track:"CH",sessions:S};
})();

/* ===== HỌC NGHỀ BROKER → QUẢN LÝ TÀI SẢN — 16 buổi × 1h (40' xem + 20' ghi) ===== */
(function(){
  const YT=q=>["Tìm trên YouTube: "+q,"https://www.youtube.com/results?search_query="+encodeURIComponent(q)];
  const NOTE="Ghi theo mẫu: 3 việc họ làm mà mình copy được · 1 việc mình sẽ KHÔNG làm · 1 việc áp dụng ngay tuần này.";
  const L=[
   ["Bản đồ nghề: môi giới → RM → quản lý tài sản ở Việt Nam",[YT("nghề môi giới chứng khoán lộ trình"),YT("quản lý tài sản wealth management Việt Nam")],"Vẽ lộ trình 5 năm của bạn: chức danh, chứng chỉ (CCHN môi giới → phân tích/tư vấn, CFA), kỹ năng."],
   ["Một ngày làm việc của broker giỏi",[YT("một ngày của môi giới chứng khoán"),YT("day in the life stock broker")],"Lịch một ngày lý tưởng của bạn khi đi làm ở LPBS."],
   ["Tìm khách hàng: network, giới thiệu, nội dung",[YT("môi giới chứng khoán tìm khách hàng"),YT("how financial advisors get clients")],"Danh sách 20 người trong network + cách tiếp cận không 'bán hàng'."],
   ["Buổi gặp đầu: hỏi gì để hiểu khách (KYC, khẩu vị rủi ro, mục tiêu)",[YT("financial advisor first meeting questions"),YT("tư vấn đầu tư buổi gặp đầu tiên")],"Bộ 12 câu hỏi buổi gặp đầu của riêng bạn."],
   ["Margin & rủi ro của khách — bài học các đợt sập",[YT("bài học margin call 2022 chứng khoán"),YT("broker risk management margin")],"Quy tắc margin bạn sẽ khuyên khách (bằng số)."],
   ["Kể chuyện thị trường cho khách không chuyên",[YT("explain stock market to clients simply"),YT("bản tin chứng khoán ngắn gọn dễ hiểu")],"Ghi âm 2' giải thích tuần này của thị trường cho mẹ/bạn — nghe lại."],
   ["Giữ khách khi thị trường xấu",[YT("financial advisor bear market client communication"),YT("giữ chân khách hàng chứng khoán thị trường giảm")],"Mẫu tin nhắn gửi khách khi thị trường giảm 10%."],
   ["Thương hiệu cá nhân cho người làm nghề (nối với kênh của bạn)",[YT("financial advisor personal brand social media"),YT("môi giới chứng khoán xây dựng thương hiệu cá nhân")],"3 nguyên tắc nội dung cho kênh để hỗ trợ nghề, không vi phạm quy định."],
   ["Quản lý tài sản: phân bổ tài sản & IPS",[YT("asset allocation explained"),YT("investment policy statement example")],"IPS mẫu 1 trang cho 1 khách giả định."],
   ["Ben Felix — đầu tư dựa trên bằng chứng",[["Ben Felix (YouTube)","https://www.youtube.com/@BenFelixCSI"]],"3 ý bạn sẽ dùng khi tư vấn khách cá nhân."],
   ["The Compound — một công ty quản lý tài sản vận hành ra sao",[["The Compound and Friends (YouTube)","https://www.youtube.com/@TheCompoundNews"]],"Mô hình doanh thu của nghề quản lý tài sản: phí % tài sản vs hoa hồng."],
   ["Đạo đức nghề & xung đột lợi ích",[["CFA Institute — Code of Ethics and Standards of Professional Conduct","https://www.cfainstitute.org/standards/professionals/code-ethics-standards"]],"3 tình huống xung đột lợi ích bạn có thể gặp và cách xử."],
   ["Chuẩn bị cà phê 1-1 với 1 anh/chị broker giỏi (người thật)",[],"10 câu hỏi + nhắn hẹn (đưa người này vào mục 'Người đáng đầu tư')."],
   ["Sau buổi cà phê: ghi lại và áp dụng",[],"1 trang ghi chép + 2 việc làm ngay."],
   ["Playbook 'broker của tôi' v1",[],"1 trang: cách tìm khách, tư vấn, quản rủi ro, giao tiếp, nội dung."],
   ["Review & chọn 3 người đi trước để theo dõi lâu dài",[],"Danh sách 3 nguồn học theo dõi hàng tuần."]];
  KIT.brk={name:"Học nghề broker → quản lý tài sản",g:"BRK",track:"BRK",sessions:L.map((x,i)=>({id:"brk"+String(i+1).padStart(2,"0"),t:x[0],mat:x[1],
    how:x[1].length?["40' xem 1–2 video có chủ đích (tốc độ 1.25×, dừng để ghi).","20' "+NOTE]:["60' làm theo đề bài bên dưới."],q:["Tóm tắt video này (dán transcript) thành 5 bài học cho một broker mới vào nghề ở Việt Nam."],out:x[2]}))};
})();

/* ===================== KHUNG TUẦN TỪ 05/10/2026 =====================
   day: 1=T2 … 7=CN · cur = giáo trình gắn vào block (buổi kế tiếp tự hiện ra)
   rest = khoá MỀM (app không tự xếp việc vào, nhưng bạn vẫn kéo việc vào được)
   Phase = khung riêng cho 1 khoảng ngày (tuần thi…); ngoài các phase dùng khung "default". */
const B=(id,from,to,label,track,o)=>Object.assign({id,from,to,label,track},o||{});
const NEWS=id=>B(id,"09:00","09:30","📰 Đọc báo 30' — bản tin sáng NSI-tin (tab Tin web)","BASE",{news:true,note:"Khoá 30 phút. Đọc '3 điều cần biết' + ảnh chụp vĩ mô → ghi 1 dòng vào Macro Journal (tin → cửa a/b/c → ngành). Hết 30' là dừng."});
const NEWS2=id=>B(id,"12:30","13:00","📰 Đọc báo 30' — bản tin sáng NSI-tin (tab Tin web)","BASE",{news:true,note:"Ngày đi làm: đọc sau giờ làm. Khoá 30 phút."});
const WORK=id=>B(id,"08:00","12:00","🏢 Công ty (ca sáng)","WORK",{fixed:true});
const EVE=id=>B(id,"18:30","22:30","💞 Tối riêng — khoá mềm","SOC",{rest:true,soft:true});
const ROUTINE_V8={tplV:8, tpl:{
 1:[NEWS("n1"),B("a11","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("a12","13:30","15:00","IELTS · Listening","IELTS",{cur:"ieL"}),
    B("a13","15:15","16:15","Macro → Micro","MACRO",{cur:"macro"}),B("a14","16:15","17:15","PP giao dịch","TRADE",{cur:"trade"}),B("a15","17:15","18:15","Kênh '5 phút đọc báo'","CH",{cur:"ch"}),EVE("e1")],
 2:[WORK("w2"),NEWS2("n2"),B("a21","13:30","15:00","IELTS · Reading","IELTS",{cur:"ieR"}),B("a22","15:15","17:15","BFN — ôn bài tuần (tự làm problems, không AI)","BF",{hint:"rev",cur:"bfwk"}),
    B("a23","19:00","20:30","Macro → Micro","MACRO",{cur:"macro"}),B("a24","20:30","21:30","Kênh '5 phút đọc báo'","CH",{cur:"ch"})],
 3:[WORK("w3"),NEWS2("n3"),B("a31","13:30","15:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("a32","16:15","17:15","PP giao dịch","TRADE",{cur:"trade"}),
    B("a33","17:15","18:15","Kênh '5 phút đọc báo'","CH",{cur:"ch"}),EVE("e3")],
 4:[NEWS("n4"),B("a41","09:30","11:30","IELTS · Writing (T1 + T2)","IELTS",{cur:"ieW"}),B("a42","13:30","15:30","BFN — đọc trước bài tuần này","BF",{hint:"pre",cur:"bfwk"}),
    B("a43","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),B("a44","17:15","18:15","Học nghề broker","BRK",{cur:"brk"}),
    B("a45","19:00","20:00","IELTS · Speaking","IELTS",{cur:"ieS"}),B("a46","20:00","21:00","Kênh '5 phút đọc báo'","CH",{cur:"ch"})],
 5:[NEWS("n5"),B("a51","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("c5","12:00","15:15","LỚP FINC3022 · D402 · Lê Anh Tuấn","BF",{fixed:true}),
    B("a52","15:45","17:45","BFN — làm problems sau lớp (tự làm, không AI)","BF",{hint:"rev",cur:"bfwk"}),EVE("e5")],
 6:[NEWS("n6"),B("a61","09:30","11:30","IELTS · Luyện dạng / Mock","IELTS",{cur:"ieD"}),B("c6","12:00","15:15","LỚP ECON3014 · D102 · Bùi Hồng Mai","IF",{fixed:true}),
    B("a62","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),B("a63","17:15","18:15","Học nghề broker","BRK",{cur:"brk"}),EVE("e6")],
 7:[NEWS("n7"),B("a71","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("a72","13:30","15:30","IELTS · Viết lại + từ vựng","IELTS",{cur:"ieV"}),
    B("a73","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),B("a74","17:15","18:00","🗓 Review tuần + chốt kế hoạch tuần sau","LIFE",{note:"Xem số giờ thật từng mảng (Mảng → Tải tuần), kiểm lại dự đoán Macro Journal 5 phiên trước, chọn Top 3 cho T2."}),EVE("e7")]
}, phases:[]};

/* tuần BFN Presentation + Midterm IF (16 → 23/10) */
const BP=(id,from,to,label,note)=>B(id,from,to,"🎤 BFN Present — "+label,"BF",{note:"Chủ đề: Market Risk Regulation for G-SIBs (Ch.15 + BIS/FSB). 13–15 phút, mỗi người ≥ 2 phút. ⚠️ KHÔNG dùng AI. "+(note||"")});
ROUTINE_V8.phases.push(
 {id:"wk-bfpres-mid", name:"Tuần BFN present + ôn mid IF", from:"2026-10-16", to:"2026-10-22", tpl:{
  5:[NEWS("pn5"),B("p51","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("c5","12:00","15:15","LỚP FINC3022 · D402","BF",{fixed:true}),
     BP("p52","15:45","17:45","chốt phân công + đọc phần của mình","Họp nhóm 15' đầu: ai nói phần nào, deadline nội bộ. Còn lại đọc Ch.15 + tài liệu BIS/FSB cho phần mình."),EVE("pe5")],
  6:[NEWS("pn6"),B("p61","09:30","11:30","IELTS · Luyện dạng / Mock","IELTS",{cur:"ieD"}),B("c6","12:00","15:15","LỚP ECON3014 · D102","IF",{fixed:true}),
     BP("p62","15:45","17:45","viết nội dung + làm slide phần mình","Có số liệu thật, ghi nguồn ngay trên slide."),EVE("pe6")],
  7:[NEWS("pn7"),B("p71","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("p72","13:30","15:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),
     BP("p73","15:45","17:15","ghép slide cả nhóm (họp online)"),EVE("pe7")],
  1:[NEWS("pn1"),B("p11","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("p12","13:30","15:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),
     BP("p13","15:45","16:45","tập phần mình 3 lần bấm giờ"),B("p14","17:00","18:00","IELTS · Listening","IELTS",{cur:"ieL"}),EVE("pe1")],
  2:[WORK("w2"),NEWS2("pn2"),B("p21","13:30","15:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),BP("p22","15:45","17:15","tập cả nhóm 13–15'"),B("p23","19:00","20:00","IELTS · Reading (nhẹ)","IELTS",{cur:"ieR"})],
  3:[WORK("w3"),NEWS2("pn3"),B("p31","13:30","15:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),BP("p32","15:45","16:45","tập lại + chuẩn bị 5 câu Q&A"),EVE("pe3")],
  4:[NEWS("pn4"),B("p41","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("p42","13:30","15:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),
     BP("p43","15:45","16:45","chạy thử lần cuối + nộp file lên Ultra"),B("p44","19:00","20:00","IF — buổi ôn theo giáo trình","IF",{cur:"if"})]
 }},
 {id:"day-mid", name:"Ngày thi mid IF + BFN present", from:"2026-10-23", to:"2026-10-23", tpl:{
  5:[B("x51","08:15","09:00","Đến D401 sớm, đọc checklist 15 bẫy","IF"),B("x52","09:00","10:30","🎯 THI GIỮA KỲ IF · D401 · 30 MCQ · 90'","IF",{fixed:true}),
     B("x53","12:00","15:15","LỚP FINC3022 + 🎤 THUYẾT TRÌNH NHÓM","BF",{fixed:true}),EVE("xe5")]
 }},
 /* tuần học 26/10 → 22/11: block BFN T3 & T6 chuyển sang Report */
 {id:"wk-report", name:"Các tuần làm Report BFN", from:"2026-10-24", to:"2026-11-22", tpl:{
  2:[WORK("w2"),NEWS2("n2"),B("a21","13:30","15:00","IELTS · Reading","IELTS",{cur:"ieR"}),B("r22","15:15","17:15","BFN Report 40% (không AI)","BF",{cur:"bfrep"}),
     B("a23","19:00","20:30","Macro → Micro","MACRO",{cur:"macro"}),B("a24","20:30","21:30","Kênh '5 phút đọc báo'","CH",{cur:"ch"})],
  5:[NEWS("n5"),B("a51","09:30","11:30","IF — buổi ôn theo giáo trình","IF",{cur:"if"}),B("c5","12:00","15:15","LỚP FINC3022 · D402 · Lê Anh Tuấn","BF",{fixed:true}),
     B("r52","15:45","17:45","BFN Report 40% (không AI)","BF",{cur:"bfrep"}),EVE("e5")]
 }},
 /* tuần thi cuối kỳ: hết lớp, dồn IF + BFN, IELTS giữ nhịp 1 block/ngày, tạm dừng macro/kênh/broker */
 {id:"wk-finals", name:"Ôn & thi cuối kỳ", from:"2026-11-23", to:"2026-12-02", tpl:(function(){
   const d=(i,a)=>a; const F={};
   F[1]=[NEWS("fn1"),B("f11","09:30","11:30","IF Final","IF",{cur:"if"}),B("f12","13:30","15:30","BFN Final","BF",{cur:"bff"}),B("f13","15:45","17:15","IF Final","IF",{cur:"if"}),B("f14","17:15","18:00","IELTS giữ nhịp","IELTS",{cur:"ieV"}),EVE("fe1")];
   F[2]=[WORK("w2"),NEWS2("fn2"),B("f21","13:30","15:30","IF Final","IF",{cur:"if"}),B("f22","15:45","17:45","BFN Final","BF",{cur:"bff"}),B("f23","19:00","20:00","IELTS giữ nhịp","IELTS",{cur:"ieS"})];
   F[3]=[WORK("w3"),NEWS2("fn3"),B("f31","13:30","15:30","IF Final","IF",{cur:"if"}),B("f32","15:45","17:45","BFN Final","BF",{cur:"bff"}),EVE("fe3")];
   F[4]=[NEWS("fn4"),B("f41","09:30","11:30","IF Final","IF",{cur:"if"}),B("f42","13:30","15:30","BFN Final","BF",{cur:"bff"}),B("f43","15:45","17:15","IF Final","IF",{cur:"if"}),B("f44","19:00","20:00","IELTS giữ nhịp","IELTS",{cur:"ieL"})];
   F[5]=[NEWS("fn5"),B("f51","09:30","11:30","IF Final","IF",{cur:"if"}),B("f52","13:30","15:30","IF Final","IF",{cur:"if"}),B("f53","15:45","17:15","BFN Final","BF",{cur:"bff"}),EVE("fe5")];
   F[6]=[NEWS("fn6"),B("f61","09:30","11:30","IF Final","IF",{cur:"if"}),B("f62","13:30","15:30","IF Final","IF",{cur:"if"}),B("f63","15:45","17:15","IELTS giữ nhịp","IELTS",{cur:"ieR"}),EVE("fe6")];
   F[7]=[B("f71","09:00","10:30","IF Final — đọc tờ tổng ôn","IF",{cur:"if"}),B("f72","13:00","15:00","🎯 THI FINAL IF · 2h","IF",{fixed:true}),B("f73","16:00","17:30","BFN Final","BF",{cur:"bff"}),EVE("fe7")];
   return F; })()},
/* 30/11–01/12: thi IF xong → 2 ngày dồn BFN */
 {id:"bf-final2", name:"2 ngày dồn BFN", from:"2026-11-30", to:"2026-12-01", tpl:{
  1:[NEWS("gn1"),B("g11","09:30","11:30","BFN Final","BF",{cur:"bff"}),B("g12","13:30","15:30","BFN Final","BF",{cur:"bff"}),B("g13","15:45","17:15","BFN Final","BF",{cur:"bff"}),B("g14","17:15","18:00","IELTS giữ nhịp","IELTS",{cur:"ieL"}),EVE("ge1")],
  2:[WORK("w2"),NEWS2("gn2"),B("g21","13:30","15:30","BFN Final","BF",{cur:"bff"}),B("g22","15:45","17:15","BFN Final","BF",{cur:"bff"}),B("g23","19:00","20:00","BFN Final — đọc tờ A4","BF",{cur:"bff"})]
 }},
 {id:"day-bfexam", name:"Ngày thi BFN", from:"2026-12-02", to:"2026-12-02", tpl:{
  3:[B("y31","07:30","08:30","Đọc tờ A4, ăn sáng, đi sớm","BF"),B("y32","09:00","11:00","🎯 THI FINAL BFN · 2h · calculator + A4","BF",{fixed:true}),
     B("y33","11:30","12:30","🏢 Báo công ty: đã xin nghỉ ca sáng hôm nay","WORK"),B("y34","14:00","15:30","IELTS · Listening","IELTS",{cur:"ieL"}),EVE("ye3")]
 }},
 /* sau thi: IELTS lên ~15h/tuần tới ngày thi, macro/kênh/broker giữ nguyên */
 {id:"post-exams", name:"Sau thi — đẩy IELTS", from:"2026-12-03", to:"2027-12-31", tpl:{
  1:[NEWS("n1"),B("q11","09:30","11:30","IELTS · Writing","IELTS",{cur:"ieW"}),B("a12","13:30","15:00","IELTS · Listening","IELTS",{cur:"ieL"}),
     B("a13","15:15","16:15","Macro → Micro","MACRO",{cur:"macro"}),B("a14","16:15","17:15","PP giao dịch","TRADE",{cur:"trade"}),B("a15","17:15","18:15","Kênh '5 phút đọc báo'","CH",{cur:"ch"}),EVE("e1")],
  2:[WORK("w2"),NEWS2("n2"),B("a21","13:30","15:00","IELTS · Reading","IELTS",{cur:"ieR"}),B("q22","15:15","16:45","IELTS · Speaking","IELTS",{cur:"ieS"}),
     B("a23","19:00","20:30","Macro → Micro","MACRO",{cur:"macro"}),B("a24","20:30","21:30","Kênh '5 phút đọc báo'","CH",{cur:"ch"})],
  3:[WORK("w3"),NEWS2("n3"),B("q31","13:30","15:30","IELTS · Luyện dạng / Mock","IELTS",{cur:"ieD"}),B("a32","16:15","17:15","PP giao dịch","TRADE",{cur:"trade"}),
     B("a33","17:15","18:15","Kênh '5 phút đọc báo'","CH",{cur:"ch"}),EVE("e3")],
  4:[NEWS("n4"),B("a41","09:30","11:30","IELTS · Writing (T1 + T2)","IELTS",{cur:"ieW"}),B("q42","13:30","15:00","IELTS · Listening","IELTS",{cur:"ieL"}),
     B("a43","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),B("a44","17:15","18:15","Học nghề broker","BRK",{cur:"brk"}),
     B("a45","19:00","20:00","IELTS · Speaking","IELTS",{cur:"ieS"}),B("a46","20:00","21:00","Kênh '5 phút đọc báo'","CH",{cur:"ch"})],
  5:[NEWS("n5"),B("q51","09:30","11:30","IELTS · Reading","IELTS",{cur:"ieR"}),B("q52","13:30","15:30","IELTS · Viết lại + từ vựng","IELTS",{cur:"ieV"}),
     B("q53","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),EVE("e5")],
  6:[NEWS("n6"),B("a61","09:30","11:30","IELTS · Luyện dạng / Mock","IELTS",{cur:"ieD"}),B("q62","13:30","15:00","IELTS · Speaking","IELTS",{cur:"ieS"}),
     B("a62","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),B("a63","17:15","18:15","Học nghề broker","BRK",{cur:"brk"}),EVE("e6")],
  7:[NEWS("n7"),B("q71","09:30","11:30","IELTS · Viết lại + từ vựng","IELTS",{cur:"ieV"}),B("a72","13:30","15:30","IELTS · Listening","IELTS",{cur:"ieL"}),
     B("a73","15:45","17:15","Macro → Micro","MACRO",{cur:"macro"}),B("a74","17:15","18:00","🗓 Review tuần + chốt kế hoạch tuần sau","LIFE"),EVE("e7")]
 }}
);
/* BFN tuần thường: không có giáo trình cố định — block BFN hiện đúng bài của session (hint pre/rev) */
KIT.bfwk={name:"BFN — bài theo tuần học",g:"BF",track:"BF",weekly:true,sessions:[]};
