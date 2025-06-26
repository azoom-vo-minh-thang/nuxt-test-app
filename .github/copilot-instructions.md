# Hướng dẫn & Prompt chi tiết cho Copilot hỗ trợ test Vue/Nuxt 3

## Mục tiêu
- Tối ưu hóa khả năng sinh test unit, mock composable/API, kiểm thử tương tác và validation cho Vue/Nuxt 3.
- Đảm bảo Copilot luôn sinh code test theo best practice, isolation tốt, dễ mở rộng.

---

## Prompt mẫu cho Copilot

### 1. Sinh test cho component/page với useFetch/useAsyncData
> Viết unit test cho component [TênComponent] sử dụng useFetch/useAsyncData, kiểm tra đủ các trạng thái: loading, error, render list, empty state. Mock useFetch bằng helper trong tests/setup.ts, đảm bảo isolation từng test.

### 2. Sinh test cho tương tác thêm/sửa/xoá todo
> Viết test cho flow thêm todo: nhập input, nhấn Enter, kiểm tra todo mới xuất hiện, input reset. Kiểm tra validation input rỗng, trùng title, và xử lý lỗi API. Mock $fetch/ky/$apis bằng helper, assert đúng API call.

### 3. Sinh test cho composable/plugin custom
> Viết test cho composable [TênComposable] với các trạng thái chính, mock các dependency (useRouter, useNuxtApp, ...), đảm bảo không rò state giữa các test. Đặt mock vào tests/setup.ts.

### 4. Sinh test cho error boundary và fallback UI
> Viết test kiểm tra khi API trả về lỗi hoặc throw exception, UI hiển thị đúng thông báo lỗi, không render list.

### 5. Sinh test cho integration flow nhiều composable
> Viết test tích hợp cho page [TênPage] sử dụng nhiều composable (useFetch, useRouter, useHead, ...), mock toàn bộ dependency, kiểm tra các luồng chính và edge case.

### 6. Prompt kiểm tra isolation và best practice
> Kiểm tra lại test đã viết: đảm bảo không truy cập biến instance nội bộ, chỉ kiểm tra qua DOM, luôn reset mock/state trong beforeEach, không để state rò giữa các test.

---

## Lưu ý khi dùng Copilot
- Luôn yêu cầu Copilot sử dụng helper mock trong tests/setup.ts.
- Yêu cầu Copilot sinh test cho từng trạng thái UI, từng flow tương tác.
- Đề nghị Copilot assert đúng API call (ky/$fetch), không chỉ kiểm tra DOM.
- Nếu test nhiều composable, yêu cầu Copilot tách nhỏ helper mock để dễ tái sử dụng.
- Đề nghị Copilot sinh comment giải thích từng bước test.

---

## Ví dụ prompt thực tế
- "Viết unit test cho page index.vue, mock useFetch, kiểm tra loading, error, render list, empty state, thêm todo, validation, API error. Sử dụng helper trong tests/setup.ts."
- "Viết test cho composable useMyFeature, mock useRouter và useNuxtApp, kiểm tra các trạng thái chính và edge case."
- "Viết test cho flow thêm todo, assert đúng API call với ky, kiểm tra UI và validation."

---

Áp dụng các prompt này sẽ giúp Copilot sinh test Vue/Nuxt 3 chuẩn, dễ bảo trì, dễ mở rộng, và phù hợp thực tế dự án.
