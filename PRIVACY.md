# Quyền riêng tư của Syrin Next (Auto Next)

Cập nhật ngày 20/11/2026 cho [bản 3.20.0](https://github.com/sovergarden-dev/syrin-next/releases/tag/v3.20.0).

Syrin Next, do `sovergarden-dev` phát triển, dùng trạng thái phát video để chuyển clip và áp dụng các bộ lọc bạn chọn trên Facebook Reels, Instagram Reels, TikTok, YouTube Shorts và X. Danh sách chi tiết và nhật ký nằm trong profile trình duyệt. Một phần dữ liệu có thể được đồng bộ sang thiết bị khác theo cài đặt Chrome hoặc Edge của bạn.

## Trình duyệt lưu những gì?

| Nơi xử lý | Dữ liệu và mục đích |
| --- | --- |
| Bộ nhớ tạm | Khi tab được kích hoạt hoặc cập nhật, tiện ích có thể đọc URL và giữ trạng thái theo tab để nhận diện trang hỗ trợ. Trạng thái này được giải phóng khi đóng tab hoặc khi tiến trình nền kết thúc. Trên các trang hỗ trợ, tiện ích đọc trạng thái phát, tiêu đề, tác giả và liên kết tới video. Danh sách chờ tải trong trang có thể chứa URL nguồn video, URL trang, tiêu đề, tác giả và thời điểm. Chế độ hình trong hình hiển thị video đang phát trong một cửa sổ nổi trên thiết bị. |
| Lịch sử và nhật ký trên thiết bị (`storage.local`) | Tiện ích giữ tối đa 5.000 mã clip đã xem và 50 sự kiện gần nhất. Một mã clip có thể được ghi sau khoảng ba giây, kể cả khi tùy chọn **Bỏ qua clip đã xem** đang tắt. Nhật ký có thời gian, nền tảng và mô tả thao tác, đôi khi có tên tệp tải. |
| Mục đã lưu trên thiết bị (`storage.local`) | Tối đa 1.000 mục yêu thích có thể gồm mã, URL, tiêu đề, nền tảng, thời điểm, ghi chú và thư mục. Tiện ích còn lưu hàng đợi phát, danh sách tác giả và từ khóa bị lọc, tối đa 500 mã hoặc URL kèm thời điểm tải để tránh tải trùng, âm lượng và vị trí bảng điều khiển. |
| Qua vùng đồng bộ của trình duyệt (`storage.sync`) | Gồm các tùy chọn phát, mẫu tên tệp tải, URL nguồn danh sách chặn nếu đã cấu hình, tối đa 400 mã yêu thích, 300 khóa tác giả bị lọc và 100 từ khóa. Mã yêu thích có thể là URL trang khi thiếu mã clip. Khóa tác giả có thể chứa tên tài khoản. Nếu bật đồng bộ dữ liệu tiện ích, dịch vụ đồng bộ của trình duyệt có thể chuyển các giá trị này giữa những thiết bị dùng cùng tài khoản. |

## Khi nào dữ liệu ra ngoài thiết bị?

- **Phát và tải video.** Khi bạn mở hoặc tải một clip, trình duyệt liên hệ với nền tảng hoặc máy chủ phân phối video của nền tảng đó. Yêu cầu tải có thể kèm cookie phiên mà trình duyệt cho phép gửi tới nguồn media. Tệp được lưu trong thư mục tải xuống theo cấu hình trình duyệt. Tên tệp có thể chứa tiêu đề hoặc tên tác giả theo mẫu bạn chọn.
- **Thao tác tài khoản.** Chặn hoặc bỏ chặn trên Facebook và đánh dấu *Không quan tâm* trên Instagram sử dụng phiên đăng nhập của bạn trên chính nền tảng đó. Những lựa chọn này có hiệu lực đối với tài khoản. Khi mở mục danh sách chặn Facebook lúc bộ nhớ đệm còn trống, hoặc khi bấm **Đồng bộ FB**, tiện ích mở trang cài đặt Facebook trong một tab nền, đọc tên hiển thị, dòng mô tả và URL ảnh đại diện nếu có, rồi lưu bản sao trên thiết bị.
- **Danh sách chặn từ URL.** Nếu bạn nhập một URL, tiện ích gửi yêu cầu tải danh sách JSON đến máy chủ của URL đó. Máy chủ có thể thấy địa chỉ IP và đường dẫn được yêu cầu, kể cả tham số có trong URL. Tiện ích gộp tác giả và từ khóa nhận được vào bộ lọc. Bạn có thể làm mới thủ công. Khi mở trang hỗ trợ, tiện ích cũng kiểm tra lại nếu đã hơn 24 giờ kể từ lần kiểm tra trước.
- **Sao chép và chia sẻ.** Lệnh sao chép liên kết đưa URL clip vào clipboard. Nút **Sao chép** trong **Nhật ký hoạt động** đưa vào clipboard nhật ký, phiên bản tiện ích, thời điểm, thông tin trình duyệt và URL đầy đủ của tab đang mở, kể cả tab ngoài năm nền tảng trên. Bạn quyết định có gửi nội dung này cho nhà phát triển khi liên hệ hỗ trợ hay không. Hãy kiểm tra URL, tên tài khoản và tên tệp trước khi chia sẻ.
- **Nhập và xuất JSON.** Lệnh xuất lưu danh sách yêu thích hoặc bộ lọc thành tệp trên thiết bị. Lệnh nhập đọc tệp bạn chọn, gộp các mục vào danh sách và cập nhật phần dữ liệu thuộc vùng đồng bộ như mô tả ở trên.

## Vì sao tiện ích cần các quyền này?

| Quyền | Công dụng |
| --- | --- |
| `storage` | Lưu tùy chọn, mục yêu thích, bộ lọc và nhật ký trong các vùng cục bộ hoặc đồng bộ nêu trên. |
| `tabs` | Đọc URL để nhận diện tab đang xem, cập nhật trạng thái trên biểu tượng, chuyển lệnh từ popup đến tab, và mở rồi đóng tab cài đặt Facebook cho chức năng quản lý chặn. |
| `scripting` | Chạy mã đi kèm tiện ích trên trang hỗ trợ để điều khiển phát video, phát nền và thực hiện thao tác chặn mà bạn đã chọn. |
| `downloads` | Giao việc tải video đã chọn cho trình quản lý tải xuống của trình duyệt, với URL media và tên tệp. |
| Quyền truy cập trang | Manifest khai báo các máy chủ HTTPS của Facebook, Instagram, TikTok, YouTube và X/Twitter để nhận diện trình phát, đọc nội dung clip và tương tác với các điều khiển trên trang. [Danh sách tên miền trong manifest](https://github.com/sovergarden-dev/syrin-next/blob/v3.20.0/manifest.json) |

## Cách quản lý và xóa dữ liệu

- Trong popup, chọn **Xoá lịch sử đã xem** để xóa danh sách mã clip trên thiết bị. Chọn **Xoá** bên cạnh **Nhật ký hoạt động** để xóa nhật ký.
- Trong bảng điều khiển trên video, bạn có thể bỏ từng mục yêu thích, xóa danh sách yêu thích hoặc xóa bộ lọc tác giả và từ khóa. Để ngừng lấy danh sách từ xa, mở **Đồng bộ danh sách chặn từ xa (URL)**, để trống URL và xác nhận. Các mục đã nhập trước đó có thể xóa trong bộ lọc. Bạn quản lý đồng bộ giữa các thiết bị trong cài đặt của trình duyệt.
- Bạn có thể giới hạn các trang được phép chạy tiện ích trong cài đặt tiện ích của trình duyệt. Gỡ tiện ích sẽ xóa kho cục bộ của tiện ích trong profile đó. Các tệp video và JSON đã lưu được quản lý trong thư mục tải xuống. Bạn quản lý các tài khoản đã chặn trong cài đặt của Facebook.

Câu hỏi về quyền riêng tư có thể gửi tới `sovergarden-dev` qua trang hỗ trợ công khai của dự án. [GitHub Issues](https://github.com/sovergarden-dev/syrin-next/issues)
