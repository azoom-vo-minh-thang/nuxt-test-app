# Nuxt 3 Unit Test & API Mocking Template

A robust Nuxt 3 starter focused on best practices for unit testing, composable isolation, and full API mocking. Includes ready-to-use setup for Vitest, Vue Test Utils, and advanced mocking of useFetch, $fetch, ky, $apis, and Nuxt composables.

> **Cốt lõi của project này là nghiên cứu, thực nghiệm và ứng dụng sâu Test Utils (Vitest, Vue Test Utils, các kỹ thuật mock composable/API) để xây dựng nền tảng test có thể mở rộng, áp dụng thực tế cho các dự án lớn.**

---

## Features
- **Full unit test coverage** for pages/components using Vitest & Vue Test Utils
- **Isolated, reusable mocks** for useFetch, $fetch, ky, $apis, useNuxtApp, useRouter, etc.
- **No state leakage**: All mocks and refs are reset per test
- **API call assertion**: Mock and verify all API client calls (ky, $apis, $fetch)
- **Test all states**: loading, error, empty, list, interaction, validation, API error
- **Documented best practices** for mocking, DI, and test structure
- **Ready for extension**: Add more composable mocks, integration tests, or custom plugins
- **Hướng tới khả năng mở rộng và áp dụng thực tế**: Dễ dàng tích hợp thêm test cho các composable, plugin, hoặc flow phức tạp trong dự án thực tế.

---

## Project Structure

- `pages/` — Nuxt 3 pages (e.g. `index.vue`, `Todo.vue`)
- `tests/` — All test files and setup
  - `setup.ts` — Global test setup, reusable mock helpers
  - `setup/useFetch.ts` — useFetch mock factory
  - `setup/api.ts` — ky/$apis/$fetch mock helpers
  - `setup/nuxt-composable.ts` — Nuxt composable mocks (useNuxtApp, useRouter, ...)
  - `page/` — Test files for each page/component (e.g. `index.spec.ts`, `Todo.spec.ts`)
- `plugins/api.ts` — ky/$apis plugin for API calls
- `types/` — Type definitions

---

## Quick Start

### 1. Install dependencies

```bash
npm install # or pnpm/yarn/bun
```

### 2. Run tests

```bash
npm run test
```

### 3. Start dev server

```bash
npm run dev
```

---

## Testing & Mocking Best Practices

- **Each test file = 1 component/page**
- **All mocks in `tests/setup`**: import and use in each test
- **Mock useFetch/$fetch**: always create new refs, reset in `beforeEach`
- **Mock ky/$apis**: support .post().json() chain, assert calls
- **Mock Nuxt composables**: use mockNuxtImport, always inside callback
- **Test only via DOM**: never access internal instance state
- **Reset all state/mocks in `beforeEach`**
- **No state leakage**: todos, error, addError, etc. always isolated
- **Document helpers and test structure** for maintainability

---

## Example Test Case Structure

See `tests/page/index.spec.ts` and `tests/setup.ts` for real-world examples:
- Loading state: pending=true, shows "Loading..."
- Error state: error set, shows error message
- Render list: correct number/content of items
- Empty state: shows "No todos yet!"
- Add todo: input, Enter, new todo appears, input resets
- Validation: empty/trùng title, shows error, no API call
- API error: $fetch/ky throws, shows error

---

## Extending
- Add more mocks for axios, useLazyAsyncData, useRoute, useHead, etc.
- Add integration tests for real-world flows
- Standardize helpers for large teams
- **Mục tiêu dài hạn:** Xây dựng bộ test có thể áp dụng cho các dự án thực tế, kiểm thử các luồng nghiệp vụ phức tạp, và dễ dàng mở rộng cho các composable/plugin tuỳ biến.

---

## References
- [Nuxt 3 Docs](https://nuxt.com/docs/getting-started/introduction)
- [Vitest Docs](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)

---

## License
MIT
