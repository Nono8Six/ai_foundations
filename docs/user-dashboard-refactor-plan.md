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
- ✅ Course progress calculated (step 3 partially complete).
- ✅ Logout link triggers `signOut` and redirects to `/login`.
- ✅ Child components now take data via props (step 5).
- ✅ Added an error boundary around the dashboard (step 6 partially complete).
- ❌ Remaining steps are still pending.

This plan allows incremental migration from demo content to production-ready features backed entirely by Supabase.
