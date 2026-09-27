---
title: "Sơn Study Kit — Luồng học & tài liệu"
---

# Sơn Study Kit

Trang này là **bản hướng dẫn học**: mỗi block trong lịch học gì, mở cái gì, dùng tool nào, lấy tài liệu ở đâu.
Trang này **không** đăng lời giải bài của GV hay nội dung chép từ slide thầy (slide BFN ghi rõ không được phát tán). Những thứ đó nằm ở trang riêng.
Lịch hằng ngày nằm trong app [Sơn Study OS](../). Bấm vào block ôn IF hoặc BFN trong app là mở đúng bài của tuần đó.

| Môn | Mục lục | Trạng thái |
|---|---|---|
| IF · ECON3014 | [Mở →](if/) | Xong 12 chương, tóm tắt tự viết lại từ slide GV |
| BFN · FINC3022 | [Mở →](bfn/) | Session 1–4 xong (theo problems thầy đã phát) |
| IELTS 7.0 | [Luồng học ở dưới](#ielts) | |
| Macro | [Luồng học ở dưới](#macro) | Giáo trình 12 tuần nằm sẵn trong app |
| Phương pháp giao dịch | [Ở dưới](#trading) | **Cần bạn gửi tài liệu** |
| **Lời giải** (Discussion IF, Problems BFN, slide thầy) | [Sổ lời giải](https://claude.ai/artifact/Hp2Q6ngHBPzbwjTvepmgiA) | Trang riêng, chỉ chủ tài khoản mở được |

---

## 1. Nguyên tắc chung
1. **Một nguồn chuẩn cho mỗi chương**: slide GV kết hợp bài tóm tắt ở đây. Mọi tool AI chỉ **đọc từ nguồn chuẩn này**, không tự bịa thêm kiến thức.
2. **Hiểu → tự làm → chữa**: AI dùng để **giải thích và chấm bài**. Còn **làm bài thì tự làm**. Xem video hay đọc tóm tắt mà không tự làm bài thì coi như chưa học.
3. **Mỗi buổi phải có đầu ra**: 1 trang ghi chú, 1 bài đã làm, 1 bảng lỗi sai. Đây là thói quen #5, tới nơi tới chốn.
4. **Học dồn tích luỹ**: tối CN lướt lại phần "bẫy trắc nghiệm" của **mọi chương đã học**, không chỉ chương mới.

## 2. Mỗi tool dùng vào việc gì
Dựa theo bài research bạn gửi lúc đầu. Tính năng của các tool thay đổi nhanh, nên tên nút có thể khác một chút.

| Tool | Dùng cho | Không dùng cho |
|---|---|---|
| **NotebookLM** | Trả lời **dựa trên đúng tài liệu bạn nạp vào** (có trích dẫn slide); tạo **Video/Audio Overview**, flashcard, quiz từ slide | Kiến thức ngoài tài liệu |
| **Gemini** | **Xem video hoặc record dài** (bài giảng ghi hình, YouTube), tóm tắt theo mốc thời gian | Chấm bài viết chi tiết |
| **Claude** | **Giải thích sâu** chỗ chưa hiểu, **chấm IELTS Writing** theo band descriptors, soát logic bài làm | Chạy dữ liệu |
| **ChatGPT** | **Chạy Python** (DA, vẽ đồ thị, kiểm tra phép tính), **luyện Speaking bằng giọng nói** | |
| **Anki** | Từ vựng IELTS, công thức, thuật ngữ | |

> ⚠️ **Môn BFN cấm AI hoàn toàn trong bài chấm điểm** (Report 40% và bài thuyết trình). Dùng AI để *tự hiểu bài* thì bạn nên hỏi lại GV cho chắc. Tuyệt đối không đưa đề Report hay nội dung thuyết trình vào AI. Môn IF được dùng AI nhưng **phải khai báo**.

## 3. Lấy tài liệu ở đâu

| Môn | Trước buổi học | Sau buổi học | Để ôn thi |
|---|---|---|---|
| **IF** | Bài tóm tắt ở đây; câu hỏi cuối chương theo danh sách Preparation (trong subject guide) | **Slide GV trên Ultra**; file Discussion (case theo tuần) | Các file trên cùng phần "bẫy trắc nghiệm" và "tự kiểm tra" |
| **BFN** | **Slide giáo trình Saunders** (có sẵn trong file Textbook Slides.zip) cùng bài tóm tắt ở đây | **Slide GV và problems** GV gửi lên Ultra sau buổi | Làm lại toàn bộ problems; tờ A4 viết tay 2 mặt |
| **IELTS** | Cambridge IELTS 15–19 (làm trên máy vì thi CD-IELTS) | | Band descriptors công khai của IELTS (Writing, Speaking) |
| **Macro** | Giáo trình 12 tuần trong app (bấm vào block Macro 17:00) | | Macro Journal của bạn |

### Chuẩn bị NotebookLM (làm 1 lần)
1. Vào notebooklm.google.com, tạo **4 notebook**: `IF – ECON3014`, `BFN – FINC3022`, `IELTS`, `Macro`.
2. **Đổi slide .pptx sang PDF** trước khi nạp: mở bằng PowerPoint → File → Save as PDF, hoặc tải lên Google Drive → mở bằng Google Slides → Tải xuống PDF. NotebookLM đọc PDF và Google Slides ổn định nhất.
3. Nạp vào mỗi notebook: **slide PDF** + **link bài tóm tắt của chương đó ở đây** (NotebookLM nhận link web) + file Discussion (với IF).
4. Nạp theo chương khi tới tuần học, không nạp hết một lượt. Nguồn càng gọn thì câu trả lời càng chính xác.

### Prompt tạo Video Overview (dùng cho mọi chương)
> *"Giải thích bằng tiếng Việt cho sinh viên năm cuối ngành tài chính, giữ nguyên thuật ngữ tiếng Anh. Đi theo thứ tự: bức tranh lớn → 3–5 khái niệm cốt lõi → 1 ví dụ số làm từng bước → các lỗi hay nhầm. Không thêm kiến thức ngoài tài liệu."*

Mỗi bài tóm tắt có sẵn một prompt riêng ở phần cuối, sát với nội dung chương hơn.

---

## 4. Luồng học IF và BFN trong tuần

Lớp BFN học **T6**, lớp IF học **T7** (12:00–15:30). Các block dưới đây khớp với lịch trong app.

| Khi nào (block trong app) | Làm gì | Mở cái gì | Tool | Đầu ra |
|---|---|---|---|---|
| **Sáng T6/T7, 09:00–10:30 · Đọc trước bài** | Xem Video Overview 10–15 phút → đọc phần 1–2 của bài tóm tắt → ghi **3 câu hỏi** mang lên lớp | Bài tóm tắt chương tuần này (app hiện link) | NotebookLM | 3 câu hỏi |
| **Lên lớp** | Hỏi 3 câu đó, ghi lại chỗ GV nhấn mạnh (thường là chỗ sẽ ra đề) | | | Ghi chú tay |
| **Sáng T2 · Ôn IF** (trong 48h sau lớp) | Tải slide GV từ Ultra → nạp NotebookLM → hỏi *"slide GV có gì khác hoặc thêm so với bài tóm tắt?"* → **làm phần Tự kiểm tra, không nhìn đáp án** → chữa | Ultra, bài tóm tắt, NotebookLM | NotebookLM → Claude nếu vẫn chưa hiểu | Bài đã chữa, câu sai ghi vào error log |
| **Chiều T2 · BFN problems** | Làm **problems GV gửi, bằng tay, không dùng AI**. So với lời giải GV (nếu có) | Ultra | Máy tính cầm tay | Bài làm |
| **T3 chiều · BFN đọc trước / Report** | Đọc slide Saunders chương tuần tới, hoặc làm Report/bài thuyết trình (tự làm) | Slide Saunders | Không dùng AI | Ghi chú |
| **T4 sáng · Ôn IF** | Làm câu hỏi cuối chương theo danh sách Preparation | Giáo trình Eiteman | Claude chỉ để **chấm** lập luận | 2–3 câu đã làm |
| **T5 sáng · Banking / Report / Thuyết trình** | Việc có hạn của BFN theo tab Deadline | | | |
| **T5 tối · Ôn IF: Discussion** | Làm case Discussion tuần đó, **tự làm xong** rồi mới đối chiếu ở trang lời giải riêng | File Discussion + bài tóm tắt | | Bài làm |
| **CN 11:00 · Review tuần** | 15 phút: lướt phần **bẫy trắc nghiệm** của mọi chương đã học; tạo quiz 10 câu trong NotebookLM | Mục lục IF và BFN | NotebookLM (quiz) | Điểm quiz ghi vào app |

### Trước kỳ thi (app đã rải sẵn lịch)
- **Thi giữa kỳ IF 23/10**: 14/10 làm bảng công thức từ phần 3 các chương 1–10 → 19/10 đề thử 1 (30 câu, 90 phút; nhờ NotebookLM tạo từ slide) → 20/10 chữa lỗi theo chương → 21/10 đề thử 2 → 22/10 đọc lại bẫy trắc nghiệm, ngủ sớm.
- **Thi cuối kỳ IF 29/11**: thêm phần tự luận ngắn. Luyện dàn ý theo rubric (problem solving, economic logic, policy, evaluation). Nhờ Claude **chấm**, không nhờ viết hộ.
- **Thi cuối kỳ BFN 2/12**: làm lại **toàn bộ problems**. Viết tờ A4 cheat sheet bằng tay (tên và mã sinh viên ở góc trên bên trái).

---

<a id="ielts"></a>
## 5. IELTS 7.0 (mục tiêu thi giữa tháng 1/2027)
**Việc đầu tiên:** làm đủ 4 kỹ năng một đề thử để biết band thật (Phase 0 trong app). Mọi thứ khác phụ thuộc kết quả này.

| Block trong app | Làm gì | Tool | Đầu ra |
|---|---|---|---|
| **T2 08:00 · Vocab + Speaking** | 20 phút Anki; 40 phút Speaking Part 2: tự ghi âm 2 phút → nghe lại → soi phát âm cuối từ (/s/, /z/) | Anki, app ghi âm | 1 file ghi âm |
| **T3 09:30 · Writing** | Viết 1 bài Task 2 trong 40 phút, không dùng AI → nhờ Claude chấm (prompt ở dưới) → **viết lại đoạn yếu nhất** | Claude | Bài viết, bản chấm, đoạn viết lại |
| **T4 09:00 · Speaking** | ChatGPT chế độ giọng nói đóng vai giám khảo (prompt ở dưới), làm Part 1–3; xây Story Bank (8 câu chuyện, mỗi chuyện 2 phút) | ChatGPT voice | Ghi chú lỗi |
| **T4 14:00 · Reading** | 1 passage bấm giờ → chữa → ghi error log (dạng câu / lý do sai / cách tránh) | Cambridge IELTS | Error log |
| **T5 16:00 · Listening** | 1 section → nghe chép lại (dictation) đoạn sai | Cambridge IELTS | Error log |
| **CN 09:00 · Mock** | 1 phần thi đầy đủ bấm giờ → chấm → nhập band vào Mock log trong app | Cambridge IELTS | Band ghi vào app |

**Prompt chấm Writing (dán cho Claude kèm đề và bài làm):**
> *"Bạn là giám khảo IELTS chấm khắt khe. Chấm bài Task 2 này theo 4 tiêu chí của band descriptors công khai (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy). Cho band từng tiêu chí và giải thích vì sao chưa lên được band cao hơn, kèm trích dẫn câu cụ thể trong bài. Chỉ ra 3 lỗi ưu tiên sửa. KHÔNG viết lại cả bài. Chỉ viết lại 1 câu mẫu cho mỗi lỗi."*

**Prompt luyện Speaking (ChatGPT chế độ giọng nói):**
> *"Act as an IELTS Speaking examiner. Run Part 1 (4 questions), Part 2 (give me a cue card, 1 min prep, I speak 2 min), Part 3 (4 questions). Don't correct me during the test. After the test, give an estimated band for each criterion and my 3 most frequent errors with examples."*

⚠️ Band do AI chấm chỉ là **ước lượng**, không thay được giám khảo thật. Mốc để quyết định vẫn là điểm đề thử có bấm giờ.

---

<a id="macro"></a>
## 6. Macro (30 phút lúc 17:00 mỗi ngày)
1. Mở app → bấm block **Macro** hôm nay: có sẵn chủ đề, việc cần làm trong 30 phút, **câu hỏi để hỏi chat** và **đầu ra bắt buộc**.
2. Lấy dữ liệu: lịch kinh tế (Investing.com hoặc TradingEconomics), NHNN và Tổng cục Thống kê cho số liệu Việt Nam, FRED cho số liệu Mỹ, cùng 1 nguồn tin quốc tế.
3. Dán các câu hỏi trong app sang **Claude hoặc ChatGPT**, **kèm câu trả lời của bạn trước** để AI phản biện. Đừng hỏi AI khi bạn chưa tự nghĩ.
4. Ghi 1 dòng vào Macro Journal. Không có dòng journal thì buổi đó coi như chưa học.

---

<a id="trading"></a>
## 7. Phương pháp giao dịch của bạn
Tui **chưa có tài liệu** nào về phương pháp giao dịch của bạn nên chưa soạn phần này. Bạn gửi tui:
- Phương pháp đang dùng: phân tích kỹ thuật, cơ bản, hay kết hợp? Khung thời gian nào? Thị trường nào (cổ phiếu Việt Nam, phái sinh, crypto…)?
- Tài liệu gốc bạn đã học (khoá học, sách, ghi chú, video) và nhật ký lệnh nếu có.
- Bạn muốn "học lại" để làm gì: chuẩn hoá quy trình, tìm lỗi, hay chuẩn bị đi làm ở công ty chứng khoán?

Có tài liệu rồi thì tui làm cho phần này giống các môn khác: bài tóm tắt, checklist trước khi vào lệnh, luồng ôn hằng tuần, và nạp vào NotebookLM.
