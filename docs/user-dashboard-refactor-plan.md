# User Dashboard Refactor Plan

This document outlines the tasks required to replace all mock data used in the `UserDashboard` page with dynamic content from Supabase.

## Goals

- Remove hard coded user details and course lists.
- Fetch real data using existing `AuthContext` and `CourseContext`.
- Implement robust error handling around every Supabase call.
- Ensure logout works reliably.
- Add unit tests where possible.

## Proposed Steps

1. **Expose `fetchUserProgress` from `CourseContext`** so other components can refresh progress.
2. **Replace mock user info** with values from `userProfile` (`level`, `xp`, `current_streak`, etc.).
3. **Load course list from Supabase** using `useCourses`. Display progress computed from `userProgress`.
4. **Create dedicated hooks** for fetching recent activity and achievements from Supabase (currently missing).
5. **Update child components** (`ProgressChart`, `RecentActivity`, `AchievementCarousel`) to accept data via props instead of internal mock arrays.
6. **Add error boundaries** to the dashboard so unexpected failures do not break the whole page.
7. **Write integration tests** for dashboard behaviour with Vitest and React Testing Library.
8. **Audit navigation** (e.g., logout button) to ensure session cleanup and redirection works correctly.

## Progress

- ✅ Steps 1 & 2 implemented. Dashboard now loads user info from Supabase.
- ✅ Course progress calculated and displayed for each enrolled course (step 3 complete).
- ✅ Logout link triggers `signOut` and redirects to `/login`.
- ✅ Child components now take data via props (step 5).
- ✅ Added `useRecentActivity` hook and integrated it into the dashboard (step 4 started).
- ✅ Dashboard wrapped in an error boundary (step 6 complete).
- ❌ Achievement hook still missing (step 4 continued) and integration tests remain to be written (step 7).

This plan allows incremental migration from demo content to production-ready features backed entirely by Supabase.