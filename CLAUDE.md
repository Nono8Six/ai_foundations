# CLAUDE.md - AI Foundations LMS 🚀

**Enterprise-grade Learning Management System designed to disrupt Udemy & Coursera**

This file provides ultra-professional guidance to Claude Code (claude.ai/code) when working with this world-class TypeScript codebase.

## 🎯 PROJECT VISION

**AI Foundations** is a next-generation Learning Management System engineered to democratize AI education from absolute beginners to experts (ages 15-99). Our platform combines enterprise-grade architecture with extreme gamification and pixel-perfect UI/UX to create the most engaging learning experience ever built.

**Target Markets:**
- **B2C**: Individual learners seeking AI mastery
- **B2B**: Corporate training and upskilling programs  

**Competitive Advantage:**
- 🎮 **Extreme Gamification**: XP, achievements, leaderboards, and social learning
- 🧠 **AI-Powered Personalization**: Adaptive learning paths and intelligent recommendations
- 🏢 **Enterprise Security**: RBAC, SSO, audit trails, and compliance-ready
- ⚡ **Performance**: Sub-second load times and real-time interactions
- 🎨 **World-Class UX**: Shadcn/UI components with custom animations and micro-interactions

## ⚡ DEVELOPMENT COMMANDS

### 🚀 Core Development (Primary Commands)

```bash
# 🔥 Hot Development Server (Full Stack)
pnpm dev                    # Starts frontend + connects to Supabase cloud
pnpm build                  # Production build with optimizations
pnpm preview                # Preview production build locally

# 🧪 Testing Suite (Ultra-Comprehensive)
pnpm test                   # All unit + integration tests
pnpm test:watch             # Tests in watch mode (TDD workflow)
pnpm test:coverage          # Coverage report with thresholds
pnpm test:e2e               # Playwright end-to-end tests
pnpm test:e2e:ui            # E2E tests with UI (for debugging)

# ✨ Code Quality (Enterprise Standards)
pnpm lint                   # ESLint + TypeScript strict checks
pnpm lint:fix               # Auto-fix all fixable issues
pnpm typecheck              # TypeScript compiler strict validation
pnpm format                 # Prettier formatting (entire codebase)
```

### 📊 Database & Types (Critical for Development)

```bash
# 🔧 COMPLETE Type Generation (ALL SCHEMAS) ✅ WORKING METHOD
pnpm types:generate         # Generate types for ALL 17 schemas (117+ tables)

# Manual generation command (what pnpm types:generate runs):
npx supabase gen types typescript \
  --project-id oqmllypaarqvabuvbqga \
  --schema=public,gamification,content,learn,rbac,assessments,referrals,access,media,storage,util \
  > apps/frontend/src/types/database.types.ts

# ⚠️ CRITICAL: Always use --schema= (with equal sign) for multiple schemas
# ❌ WRONG: --schema public,gamification  (missing =, only gets public)
# ✅ CORRECT: --schema=public,gamification (gets all schemas)

# 🔍 Database Management
pnpm db:status              # Check database health + schema sync
pnpm db:reset               # Reset local types (cloud data preserved)
pnpm db:migrate             # Apply pending migrations to cloud
pnpm validate:env           # Validate all environment variables
```

### 🏗️ Project Management (Monorepo)

```bash
# 📦 Dependencies (Workspace-aware)
pnpm install                # Install all dependencies (all workspaces)
pnpm add <package>          # Add package to root
pnpm add <package> -w       # Add to specific workspace
pnpm outdated               # Check for outdated dependencies

# 🧹 Maintenance
pnpm clean                  # Clean all build artifacts
pnpm clean:node_modules     # Deep clean (removes node_modules)
pnpm audit                  # Security audit + fix
```

### ⚡ Quick Setup (30 Seconds to First Run)

```bash
# 1️⃣ Install dependencies (uses pnpm workspaces)
pnpm install

# 2️⃣ Configure environment (copy + edit with your Supabase credentials)
cp .env.example .env
# Edit .env with your actual Supabase cloud credentials

# 3️⃣ Generate complete TypeScript types (critical!)
pnpm types:generate

# 4️⃣ Start developing (hot reload + cloud database)
pnpm dev
# 🎉 Open http://localhost:5173 - You're ready!
```

---

## 🏗️ ENTERPRISE ARCHITECTURE

### 📁 Monorepo Structure (Perfectly Organized)

```
ai_foundations_lms/
├── 📱 apps/
│   ├── frontend/          # React 18 + TypeScript + Vite (main app)
│   └── backend/           # Supabase migrations + edge functions
├── 📚 libs/               # Shared utilities (workspace packages)
│   ├── logger/            # Pino-based structured logging
│   ├── supabase-utils/    # Database utilities + result types
│   └── cms-utils/         # Content management utilities
├── 🔧 packages/          # Shared configuration
│   ├── eslint-config/     # ESLint rules (extends @typescript-eslint/recommended)
│   ├── prettier-config/   # Prettier formatting rules
│   └── tsconfig/          # TypeScript configurations
├── 📄 docs/              # Technical documentation + runbooks
└── 🧪 e2e/              # End-to-end tests (Playwright)
```

### 🎨 Frontend Architecture (Ultra-Modern Stack)

**Core Technologies:**
- ⚛️ **React 18** + TypeScript 5.8+ (strictest possible configuration)
- 🛣️ **React Router 7.6.3** with lazy-loaded page components + preloading
- 📊 **TanStack Query v5** for server state management + optimistic updates
- 🎨 **Tailwind CSS 3.4+** + **Shadcn/UI** components + custom design system
- 🔒 **Zod 3.22+** for runtime type validation + form schemas
- ⚡ **Vite 5** with optimized build pipeline + code splitting

### 🏢 Backend Architecture (Enterprise PostgreSQL on Supabase Cloud)

**17 Schemas + 117+ Tables (Production-Ready Scale):**

#### **Core User Management**
- 👤 **`public`** (5 tables) - User profiles + settings + GDPR compliance
- 🔐 **`rbac`** (5 tables) - Role-based access control + 33 granular permissions
- 🌍 **`access`** (4 tables) - Content access control + subscription tiers

#### **Learning & Content**  
- 📚 **`content`** (5 tables) - Courses, modules, lessons + content management
- 🎓 **`learn`** (3 tables) - User progress + learning analytics + completion tracking
- 🏆 **`assessments`** (7 tables) - Quizzes, certificates + advanced grading engine

#### **Gamification Engine**
- 🎮 **`gamification`** (11 tables) - XP system + achievements + leaderboards + streaks
  - `xp_sources` (48 active rules) - Configurable XP rewards
  - `level_definitions` (10 levels) - Dynamic progression system  
  - `user_xp` + `xp_events` - Complete audit trail
  - `achievement_definitions` + `user_achievements` - Unlock system

#### **Enterprise Features**
- 💰 **`referrals`** (23 tables) - Complete affiliate/referral system + commission tracking
- 🎬 **`media`** (2 tables) - Video assets + streaming optimization
- 💾 **`storage`** (7 tables) - File management + CDN integration

#### **System & Operations**
- ⚙️ **`util`** (18 tables) - Feature flags + job queue + monitoring + analytics
- 🔄 **`realtime`** (3 tables) - WebSocket subscriptions + live updates

**Performance Optimizations:**
- 🚀 **Strategic Indexes**: 45+ optimized indexes for sub-second queries
- 📊 **Partitioned Tables**: `xp_events` partitioned by month for scalability
- 💾 **Materialized Views**: Pre-computed aggregations for dashboards
- 🔒 **Row Level Security**: 89 RLS policies for multi-tenant security

### 🔗 Service Layer Mapping (Frontend ↔ Backend)

**Critical Service-to-Schema Connections:**

| Frontend Service | Backend Schema(s) | Primary Tables | Purpose |
|-----------------|-------------------|----------------|---------|
| 🔐 **AuthContext** | `public`, `rbac` | `profiles`, `user_roles`, `permissions` | User authentication + RBAC |
| 🎮 **XPService** | `gamification` | `xp_sources`, `user_xp`, `xp_events`, `level_definitions` | Complete gamification engine |
| 📚 **CourseService** | `content`, `learn` | `courses`, `lessons`, `modules`, `user_progress` | Learning content + progress |
| 🏆 **AssessmentService** | `assessments` | `questions`, `attempts`, `certificates` | Quizzes + certifications |
| 👥 **UserService** | `public`, `rbac` | `profiles`, `user_settings`, `user_roles` | Profile management |
| 🎬 **MediaService** | `media`, `storage` | `assets`, `asset_variants`, `objects` | Video/file management |
| 💰 **ReferralService** | `referrals` | `referral_codes`, `referrals`, `commission_payouts` | Affiliate system |
| 🔧 **AdminService** | `util`, `rbac` | `feature_flags`, `permissions`, `role_grants_log` | Admin operations |

### 🧠 State Management (Enterprise Patterns)

**Multi-Layer State Architecture:**
- 🎯 **Component State**: React hooks for UI-specific state (forms, toggles, local cache)
- 🌍 **Global State**: Context API with `createContextStrict` utility for type safety
  - `AuthContext` - User session + RBAC permissions
  - `CourseContext` - Active course + lesson state
  - `ErrorContext` - Global error handling + user notifications
- 💾 **Server State**: TanStack Query v5 with aggressive caching strategies
  - 5-minute cache for user data
  - 10-minute cache for course content
  - Real-time invalidation for XP/progress updates
- 📋 **Form State**: react-hook-form + Zod validation with custom error handling

### 🎯 Enterprise Patterns & Conventions

#### **🏗️ Architectural Patterns**
- **Feature-Based Structure** - Each feature is self-contained with components, hooks, services
- **Service Layer Pattern** - Business logic isolated in dedicated service classes
- **Context + Provider Pattern** - Global state with strict TypeScript typing
- **Repository Pattern** - Database access abstracted through service layer
- **Result Type Pattern** - Consistent error handling with `Result<T, E>` types

#### **📛 Naming Conventions (Senior-Level Standards)**
```typescript
// 🔹 FILES - PascalCase for components, kebab-case for utilities
AuthContext.tsx           // React contexts
course-service.ts         // Business logic services
user.types.ts            // Type definitions
__tests__/Component.test.tsx  // Test files

// 🔹 FUNCTIONS - Descriptive, action-oriented
async fetchUserProgressWithXP()     // API calls
handleUserAuthentication()          // Event handlers
validateCourseCompletionRules()      // Business logic
useCourseProgressWithOptimisticUpdates()  // Custom hooks

// 🔹 TYPES - Clear, domain-specific
interface CourseWithProgressAndAnalytics  // Business entities
type XPEventWithAuditTrail            // Domain types  
enum UserSubscriptionTier             // Finite states
type CourseCompletionStatus = 'not_started' | 'in_progress' | 'completed'

// 🔹 COMPONENTS - Descriptive, hierarchical
<CourseOverviewCard />               // UI components
<XPProgressBarWithAnimation />       // Complex UI
<AdminUserManagementTable />         # Admin features
```

#### **🎨 Component Organization**
```typescript
// ✅ IDEAL Component Structure
export const CourseCard: FC<CourseCardProps> = ({ 
  course, 
  onEnroll, 
  currentUserProgress 
}) => {
  // 1️⃣ Hooks first (grouped logically)
  const { user } = useAuth();
  const { data: progress } = useQuery(courseProgressQuery);
  
  // 2️⃣ Computed values
  const completionPercentage = useMemo(() => 
    calculateProgressPercentage(progress), [progress]
  );
  
  // 3️⃣ Event handlers
  const handleEnrollClick = useCallback(() => {
    onEnroll?.(course.id);
  }, [course.id, onEnroll]);
  
  // 4️⃣ Early returns for loading/error states
  if (!course) return <CourseCardSkeleton />;
  
  // 5️⃣ Main render
  return (
    <Card className="course-card">
      {/* Component JSX */}
    </Card>
  );
};
```

### 🧪 Testing Strategy (Comprehensive Coverage)

**Multi-Level Testing Pyramid:**
- 🔬 **Unit Tests** (Vitest) - 70% coverage target
  - Pure functions + utilities (100% coverage required)
  - Custom hooks with React Testing Library
  - Service layer business logic
  - Type-safe mock factories with Zod schemas

- 🧩 **Integration Tests** (Vitest + MSW) - Component + service integration
  - Feature workflows (login → dashboard → course enrollment)
  - API integration with mocked Supabase responses
  - Context providers + multiple components

**Testing Best Practices:**
```typescript
// ✅ EXEMPLARY Test Structure
describe('XPService - Gamification Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetTestDatabase();
  });

  describe('calculateLevelProgression', () => {
    it('should calculate correct level for 150 XP (Level 2)', async () => {
      // 🎯 AAA Pattern - Arrange, Act, Assert
      const mockUser = createMockUser({ xp: 150 });
      
      const levelInfo = await XPService.calculateLevelInfo(150);
      
      expect(levelInfo).toEqual({
        currentLevel: 2,
        progressPercent: 33.33,
        xpForNextLevel: 100
      });
    });
  });
});
```

---

## 💎 SENIOR DEVELOPMENT GUIDELINES

### 🛡️ TypeScript Excellence (20-Year Senior Standards)

**Strictest Possible Configuration:**
```typescript
// ✅ ADVANCED TypeScript Patterns
// 🔹 Generic constraints with conditional types
type ApiResponse<T> = T extends { id: string } 
  ? { success: true; data: T; metadata: ResponseMetadata }
  : never;

// 🔹 Template literal types for type-safe APIs
type DatabaseSchema = 'gamification' | 'content' | 'rbac';
type TableOperation = 'select' | 'insert' | 'update' | 'delete';
type DatabaseQuery<S extends DatabaseSchema, Op extends TableOperation> = 
  `${S}.${Op}`;

// 🔹 Branded types for domain safety
type UserId = string & { readonly __brand: 'UserId' };
type CourseId = string & { readonly __brand: 'CourseId' };

// 🔹 Exhaustive switch statements with never
const handleUserRole = (role: UserRole): string => {
  switch (role) {
    case 'admin': return 'Full access granted';
    case 'moderator': return 'Moderation privileges';
    case 'member': return 'Standard access';
    default: 
      // 🚨 Compile-time guarantee all cases handled
      const _exhaustive: never = role;
      throw new Error(`Unhandled role: ${_exhaustive}`);
  }
};
```

**Forbidden Patterns:**
```typescript
// ❌ NEVER USE THESE
any                    // Use unknown + type guards instead
@ts-ignore            // Fix the type error, don't suppress it
as unknown as T       // Use proper type assertion or validation
React.FC<{}>          // Use explicit prop types
Function              // Use specific function signatures
```

### ⚛️ React Component Excellence

**Component Architecture Standards:**
```typescript
// ✅ PERFECT Component Pattern
interface CourseCardProps {
  readonly course: CourseWithProgress;
  readonly onEnroll?: (courseId: CourseId) => Promise<void>;
  readonly variant?: 'default' | 'compact' | 'featured';
  readonly className?: string;
}

export const CourseCard = memo<CourseCardProps>(({ 
  course, 
  onEnroll, 
  variant = 'default',
  className 
}) => {
  // 🔹 Custom hooks for complex logic
  const { 
    enrollmentStatus, 
    handleEnroll, 
    isLoading 
  } = useCourseEnrollment(course.id, onEnroll);
  
  // 🔹 Memoized expensive computations
  const progressMetrics = useMemo(() => ({
    completionPercent: (course.completed_lessons / course.total_lessons) * 100,
    estimatedTimeRemaining: calculateRemainingTime(course),
    nextMilestone: getNextMilestone(course.progress)
  }), [course]);
  
  // 🔹 Event handler optimization
  const handleEnrollClick = useCallback(async () => {
    await handleEnroll();
    // Analytics tracking
    trackEvent('course_enrolled', { courseId: course.id });
  }, [handleEnroll, course.id]);
  
  return (
    <Card 
      className={cn('course-card', variantStyles[variant], className)}
      data-testid={`course-card-${course.id}`}
    >
      {/* Component implementation */}
    </Card>
  );
});

// 🔹 Display name for debugging
CourseCard.displayName = 'CourseCard';
```

### 🎯 Service Layer Architecture

**Enterprise Service Pattern:**
```typescript
// ✅ ULTRA-PRO Service Structure
export class CourseService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly cache: QueryClient,
    private readonly logger: Logger
  ) {}
  
  // 🔹 Result type pattern for error handling
  async getCourseWithProgress(
    courseId: CourseId, 
    userId: UserId
  ): Promise<Result<CourseWithProgress, CourseServiceError>> {
    try {
      this.logger.debug('Fetching course with progress', { courseId, userId });
      
      // 🔹 Single query with optimized joins
      const { data, error } = await this.supabase
        .from('courses')
        .select(`
          *,
          modules!inner(
            *,
            lessons!inner(
              *,
              user_progress!left(
                status,
                completed_at,
                xp_earned
              )
            )
          )
        `)
        .eq('id', courseId)
        .eq('user_progress.user_id', userId)
        .single();
      
      if (error) {
        return Result.failure(
          new CourseServiceError('COURSE_FETCH_FAILED', error.message)
        );
      }
      
      // 🔹 Zod validation + transformation
      const validatedCourse = CourseWithProgressSchema.parse(data);
      
      // 🔹 Cache optimization
      this.cache.setQueryData(
        ['course', courseId, 'user', userId], 
        validatedCourse
      );
      
      return Result.success(validatedCourse);
      
    } catch (error) {
      this.logger.error('Unexpected error in getCourseWithProgress', { 
        error, 
        courseId, 
        userId 
      });
      
      return Result.failure(
        new CourseServiceError('UNEXPECTED_ERROR', error.message)
      );
    }
  }
}
```

### 📋 Code Quality Standards

**Mandatory Practices:**
- **🔒 No `any` types** - Use unknown + type guards or proper generics
- **📝 JSDoc comments** for all public APIs and complex business logic  
- **🧪 100% test coverage** for service layer and utility functions
- **⚡ Performance budgets** - Components must render in <16ms
- **♿ Accessibility first** - WCAG 2.1 AA compliance required
- **📱 Mobile-first** - Responsive design for all components

**Git Workflow:**
```bash
# ✅ CONVENTIONAL Commits (Enforced)
feat(gamification): add XP multiplier for streak bonuses
fix(auth): resolve token refresh race condition  
perf(courses): optimize lesson query with pagination
docs(api): update service layer documentation
test(xp): add integration tests for level progression
```

### 🗄️ Database Management (Enterprise Cloud-First)

### 🔐 RBAC & Permissions System

**Complete Permission Matrix (33 Granular Permissions):**

| Domain | Permissions | Description |
|--------|-------------|-------------|
| **👥 User Management** | `user.view`, `user.create`, `user.update`, `user.delete`, `user.impersonate` | Complete user lifecycle |
| **📚 Content Management** | `content.view`, `content.create`, `content.update`, `content.delete`, `content.publish` | Course/lesson management |
| **🎮 Gamification** | `xp.view`, `xp.grant`, `xp.revoke`, `achievement.unlock`, `leaderboard.manage` | XP & achievements |
| **🏆 Assessments** | `assessment.view`, `assessment.create`, `assessment.grade`, `certificate.issue` | Quiz & certification |
| **💰 Business** | `referral.manage`, `commission.payout`, `analytics.view`, `billing.manage` | Revenue operations |
| **⚙️ System** | `admin.dashboard`, `system.configure`, `backup.create`, `audit.view` | Platform administration |

**Role Hierarchy:**
```typescript
// 🏢 Enterprise Role System
type SystemRole = 'admin' | 'moderator' | 'premium_member' | 'member' | 'visitor';

const ROLE_PERMISSIONS: Record<SystemRole, string[]> = {
  admin: ['*'], // Full access to all permissions
  moderator: [
    'user.view', 'user.update', 'content.view', 'content.update',
    'assessment.grade', 'xp.view', 'achievement.unlock'
  ],
  premium_member: [
    'content.view', 'assessment.view', 'xp.view', 
    'referral.create', 'certificate.view'
  ],
  member: ['content.view', 'assessment.view', 'xp.view'],
  visitor: ['content.view'] // Read-only public content
};
```

**Permission Enforcement:**
```typescript
// ✅ Frontend Permission Guards
export const AdminRoute: FC<{ children: ReactNode; permission?: string }> = ({ 
  children, 
  permission 
}) => {
  const { hasPermission, loading } = useAuth();
  
  if (loading) return <AdminRouteSkeleton />;
  
  if (permission && !hasPermission(permission)) {
    return <UnauthorizedAccess requiredPermission={permission} />;
  }
  
  return <>{children}</>;
};

// 🔒 Backend RLS Policies (Auto-Generated)
-- Example RLS policy for courses table
CREATE POLICY "courses_select_policy" ON content.courses
  FOR SELECT USING (
    -- Public courses visible to all
    is_published = true
    OR
    -- Private courses only to enrolled users or content managers
    auth.uid() IN (
      SELECT user_id FROM user_enrollments WHERE course_id = courses.id
      UNION
      SELECT user_id FROM rbac.user_roles 
      WHERE role IN ('admin', 'moderator') 
      AND expires_at > now()
    )
  );
```

### 🌍 Environment & Deployment

**Environment Configuration:**
```bash
# 📋 Required Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # Client-side safe key
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Server-side operations (keep secret!)

# 🔧 Optional Performance Tuning
VITE_ENABLE_QUERY_DEVTOOLS=true    # TanStack Query devtools
VITE_LOG_LEVEL=debug               # Detailed logging
VITE_ANALYTICS_ENABLED=true        # User behavior tracking

# 🧪 Testing Configuration  
VITE_ENABLE_MSW_MOCKING=true       # API mocking for tests
PLAYWRIGHT_HEADLESS=false          # Visual debugging
```

**Deployment Targets:**
- **🚀 Production**: Vercel Edge (global CDN + serverless functions)
- **🧪 Staging**: Preview deployments for every PR
- **👨‍💻 Development**: Local Vite dev server + Supabase cloud
- **🧪 Testing**: Isolated test database + MSW mocking


## 🤖 AI DEVELOPMENT EXCELLENCE

### 🎯 For AI Tools & Developer Productivity

**Ultra-Optimized Development Experience:**
- 🌊 **Pure Cloud Workflow** - Zero local setup friction, instant productivity
- ⚡ **Sub-30 Second Setup** - From git clone to running application
- 🔒 **Type-Safe by Design** - 117+ tables with complete TypeScript coverage
- 🧠 **AI-Friendly Architecture** - Single source of truth, no schema drift
- 🚀 **Hot Reloading Everything** - Frontend + types + database changes
- 📊 **Real-Time Insights** - TanStack Query DevTools + database performance

**Claude Code Integration Checklist:**
```bash
# ✅ Perfect Development Loop
1. Make schema changes in Supabase Dashboard
2. Run: pnpm types:generate  # Updates ALL 17 schemas instantly
3. TypeScript compiler catches breaking changes immediately
4. Frontend adapts automatically with type safety
5. Tests validate business logic end-to-end
```

**Enterprise Architecture Benefits for AI:**
- 🏗️ **Scalable Structure** - Feature-based organization scales to 1000+ components
- 🔍 **Searchable Codebase** - Consistent naming + clear file organization
- 🧪 **Testable by Design** - Service layer isolation + dependency injection
- 📝 **Self-Documenting Code** - TypeScript interfaces + JSDoc comments
- ⚡ **Performance Monitoring** - Built-in metrics + optimization guidelines

### 🚀 Competitive Market Position

**Disrupting Udemy & Coursera Through:**

1. **🎮 Extreme Gamification** (They Can't Match)
   - Real-time XP system with 48 configurable reward rules
   - Achievement unlocking with complex condition engine  
   - Social leaderboards + streaks + level progression
   - Behavioral psychology applied to maximize engagement

2. **🏢 Enterprise-Grade Security** (B2B Advantage)
   - RBAC with 33 granular permissions vs basic user roles
   - Row-level security for multi-tenant compliance
   - GDPR/CCPA compliance built-in with audit trails
   - SSO integration + advanced access controls

3. **⚡ Performance Excellence** (Technical Superiority)
   - Sub-second load times vs 3-5 second competitors
   - Real-time progress updates + live collaboration
   - Optimized video streaming + adaptive quality
   - Mobile-first responsive design

4. **🧠 AI-Native Architecture** (Future-Proof)
   - Personalized learning paths + intelligent recommendations
   - Automated content tagging + skill gap analysis
   - Predictive analytics for learner success
   - Seamless integration with AI tutoring systems

---

## 🎯 ENTERPRISE DATA POLICY (Zero Tolerance)

### 🚫 ZERO HARDCODED DATA RULE

**Absolutely Forbidden:**
- ❌ **Mock data or simulated values** in any component
- ❌ **Hardcoded arrays/objects** representing business data
- ❌ **Placeholder calculations** not backed by database
- ❌ **Fake progress indicators** or demo content
- ❌ **Duplicate data display** without clear UX purpose

### ✅ AUTHORIZED DATA SOURCES (Complete Database Schema)

**User & Progress Data:**
```typescript
// ✅ APPROVED - Real database sources
Schema: public.profiles        // xp, level, current_streak, last_completed_at  
Schema: gamification.user_xp   // XP balance + audit trail
Schema: gamification.xp_events // Complete XP transaction history
Schema: learn.user_progress    // Course/lesson completion status
Schema: assessments.attempts   // Quiz scores + certifications
Schema: referrals.referrals    // Affiliate earnings + conversion data
```

**Content & Analytics:**
```typescript
// ✅ APPROVED - Live business metrics  
Schema: content.courses        // Published courses + metadata
Schema: gamification.xp_sources // Live XP reward rules (48 active)
Schema: gamification.level_definitions // Dynamic level requirements
Schema: rbac.user_roles       // User permissions + access levels
Schema: util.feature_flags    // A/B testing + rollout status
```

### 🎨 ELEGANT EMPTY STATES (User Experience Excellence)

**Required UX Pattern:**
```typescript
// ✅ PERFECT Empty State Implementation
const XPTimelineComponent = () => {
  const { data: xpEvents, isLoading } = useQuery({
    queryKey: ['xpEvents', userId],
    queryFn: () => XPService.getXpTimeline(userId)
  });

  if (isLoading) return <XPTimelineSkeleton />;
  
  if (!xpEvents?.length) {
    return (
      <EmptyState
        icon="Zap"
        title="Your XP journey starts here!"
        description="Complete lessons, earn XP, and track your progress in this timeline."
        action={{
          label: "Explore Courses",
          href: "/programmes",
          variant: "primary"
        }}
        className="xp-timeline-empty"
      />
    );
  }

  return <XPTimeline events={xpEvents} />;
};
```

### 🔄 DATA CONSISTENCY GUARANTEES

**Source of Truth Hierarchy:**
1. **Database State** (Single source of truth)
2. **TanStack Query Cache** (Optimistic updates + invalidation)  
3. **React Component State** (UI-only temporary state)
4. **Context Providers** (Cross-component state synchronization)

**Real-Time Data Synchronization:**
```typescript
// ✅ AUTOMATIC Cache invalidation on data changes
const { mutate: updateProgress } = useMutation({
  mutationFn: CourseService.updateLessonProgress,
  onSuccess: (data) => {
    // Invalidate related queries instantly
    queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    queryClient.invalidateQueries({ queryKey: ['xpEvents'] });
    queryClient.invalidateQueries({ queryKey: ['achievements'] });
    
    // Show celebration if XP gained
    if (data.xpGained > 0) {
      showXPGainedNotification(data.xpGained);
    }
  }
});
```

## Gamification & XP Architecture (ULTRA-PRO)

### Architecture Overview - ZÉRO Donnée Hardcodée

L'architecture de gamification a été complètement refactorisée pour éliminer **TOUTES** les données hardcodées et implémenter un système ultra-scalable, configurable et professionnel.

### Core Tables Architecture

#### **`profiles`** - Hub Utilisateur Central
- **Fonction**: Table utilisateur consolidée avec XP/niveau intégrés
- **Champs XP**: `xp` (integer), `level` (integer), `last_xp_event_at` (timestamp)
- **Relations**: Référencée par toutes les tables gamification
- **Source de vérité**: Pour XP total et niveau utilisateur

#### **`xp_events`** - Historique XP (Source de Vérité)
- **Fonction**: Journal complet de tous les événements XP (gains/pertes)
- **Champs**: `user_id`, `source_type`, `action_type`, `xp_delta`, `xp_before/after`, `metadata`
- **Usage**: Audit trail, timeline XP, calculs de cohérence
- **Index optimisé**: `(user_id, created_at DESC)`

#### **`xp_sources`** - Règles XP Configurables ⭐
- **Fonction**: Configuration de TOUTES les règles XP (remplace hardcoding)
- **Champs**: `source_type`, `action_type`, `xp_value`, `is_repeatable`, `cooldown_minutes`, `max_per_day`
- **Exemples**: 
  - `lesson:start → 10 XP`
  - `lesson:completion → 50 XP`
  - `course:completion → 200 XP`
  - `quiz:perfect → 30 XP`
- **Usage**: `XPService.getAvailableXPOpportunities()` remplace StatsPage hardcodé

#### **`level_definitions`** - Système Niveaux Dynamique 🚀
- **Fonction**: Configuration progression niveaux (remplace "100 XP/niveau" hardcodé)
- **Champs**: `level`, `xp_required`, `xp_for_next`, `title`, `badge_icon`, `badge_color`, `rewards`
- **Progression**: Exponentielle configurée (0→100→250→450→700→1000→1350...)
- **Usage**: `XPService.calculateLevelInfo(totalXP)` pour calculs dynamiques

#### **`achievement_definitions`** - Templates Achievements
- **Fonction**: Catalogue achievements disponibles avec conditions
- **Champs**: `achievement_key`, `title`, `description`, `condition_type`, `condition_params`, `xp_reward`
- **Types**: Seuils XP, niveaux, streaks, profil completion
- **Auto-unlock**: `AchievementService.checkAndUnlockAchievements()`

#### **`user_achievements`** - Achievements Débloqués
- **Fonction**: Instances achievements par utilisateur
- **Relations**: FK vers `profiles`, référence `achievement_definitions`
- **Audit**: Date unlock, conditions remplies, XP reward

### Services Architecture

#### **XPService** - Service Principal XP
- **`getAvailableXPOpportunities()`**: Remplace données hardcodées StatsPage
- **`calculateLevelInfo(totalXP)`**: Calculs niveau depuis level_definitions
- **`getXpTimeline()`**: Timeline événements XP avec groupement temporel
- **`getXpAggregates()`**: Statistiques XP par période/source

#### **AchievementService** - Gestion Achievements
- **`checkAndUnlockAchievements()`**: Vérification automatique achievements
- **`getUserStats()`**: Statistiques utilisateur pour conditions
- **Logique niveau**: Utilise level_definitions (plus jamais hardcodé)

### Performance Optimizations

#### **Index Stratégiques**
```sql
-- Timeline XP (requête la plus fréquente)
CREATE INDEX idx_xp_events_user_created ON xp_events (user_id, created_at DESC);

-- Règles XP actives
CREATE INDEX idx_xp_sources_active_type ON xp_sources (is_active, source_type, action_type);

-- Calculs niveau optimisés
CREATE INDEX idx_level_definitions_xp_required ON level_definitions (xp_required ASC);

-- Profiles XP/niveau
CREATE INDEX idx_profiles_xp_level ON profiles (xp, level);
```

### Frontend Integration

#### **StatsPage.tsx** - REFACTORISÉ COMPLET
- **AVANT**: 90 lignes de recommandations hardcodées
- **APRÈS**: `XPService.getAvailableXPOpportunities()` depuis `xp_sources`
- **Niveau**: `XPService.calculateLevelInfo()` depuis `level_definitions`
- **Résultat**: ZÉRO donnée hardcodée

#### **Services Dynamiques**
- **XP Opportunities**: Depuis `xp_sources` table
- **Level Progress**: Depuis `level_definitions` table
- **Achievement Check**: Automatique avec conditions configurables

### Architecture Scalability

#### **Pour 100+ Utilisateurs**
- Index optimisés pour requêtes concurrentes
- Partitioning `xp_events` si volume > 100K
- Caching Redis pour leaderboards

#### **Pour Futures Features**
- **Nouveaux types XP**: Ajout dans `xp_sources` sans code
- **Nouveaux achievements**: Configuration dans `achievement_definitions`
- **Progression custom**: Modification `level_definitions`
- **Cooldowns/Limites**: Déjà supportés dans `xp_sources`

### Migration Completed ✅

#### **Tables Supprimées**
- ❌ `user_xp_balance` (redondante avec `profiles.xp/.level`)

#### **Données Migrées**
- ✅ XP totals vers `profiles.xp`
- ✅ Niveaux vers `profiles.level`
- ✅ Vue `user_profiles_with_xp` mise à jour

#### **Cohérence Garantie**
- ✅ `xp_events` = source de vérité XP
- ✅ Niveaux calculés depuis `level_definitions`
- ✅ Règles XP depuis `xp_sources`

### Code Examples

#### **Utilisation XP Service**
```typescript
// Récupérer opportunités XP (remplace hardcodé)
const opportunities = await XPService.getAvailableXPOpportunities(userId);

// Calcul niveau dynamique (remplace Math.floor(xp/100))
const levelInfo = await XPService.calculateLevelInfo(totalXP);

// Timeline XP avec groupement
const timeline = await XPService.getXpTimeline(userId, filters, pagination);
```

#### **Configuration Règles XP**
```sql
-- Ajouter nouvelle règle XP sans déploiement code
INSERT INTO xp_sources (source_type, action_type, xp_value, description) 
VALUES ('lesson', 'video_watched', 5, 'Regarder vidéo complète');
```

### Architecture Benefits

✅ **ZÉRO hardcoding** - Toutes données depuis DB
✅ **Ultra-configurable** - Règles XP/niveaux modifiables
✅ **Scalable** - Index optimisés, architecture propre  
✅ **Maintenable** - Code DRY, single source of truth
✅ **Future-proof** - Extensible sans refactoring
✅ **Performance** - Index stratégiques, requêtes optimisées

## Architecture XP Unifiée (ULTRA-PRO) 🏆

### Problème Résolu
- **Duplication**: `xp_sources` et `achievement_definitions` avaient des overlaps
- **UX fragmentée**: Sources XP éparpillées entre 2 systèmes
- **Hardcoding**: Logique de mapping hardcodée dans frontend

### Solution - API Unifiée

**Tables clarifiées :**
- **`xp_sources`**: Actions immédiates répétables (lesson:completion, quiz:perfect, etc.)
- **`achievement_definitions`**: Objectifs long terme uniques (atteindre niveau 5, 500 XP total, etc.)
- **Doublons éliminés**: profile_complete, streak_7day_milestone supprimés

**API Unifiée XPService :**
```typescript
// API principale - TOUTES les sources XP
static async getAllXPOpportunities(userId?: string): Promise<XPOpportunity[]>

// API simplifiée - Top 3 actions pour bloc "Comment gagner plus d'XP"
static async getAvailableXPOpportunities(userId?: string): Promise<XPOpportunity[]>
```

**Type unifié XPOpportunity :**
```typescript
interface XPOpportunity {
  id: string;
  title: string;            // Généré dynamiquement depuis DB
  description: string;      // Depuis description DB ou généré
  xpValue: number;
  icon: string;             // Mappé sur sourceType
  actionText: string;       // Action button text
  available: boolean;
  sourceType: string;       // lesson, course, quiz, profile, etc.
  actionType: string;       // completion, perfect, start, etc.
  isRepeatable: boolean;
  cooldownMinutes: number;
  maxPerDay?: number;
  
  // Nouveaux champs unifiés
  category: 'action' | 'achievement'; // Différenciation type
  conditionType?: string;             // Pour achievements
  conditionParams?: Record<string, any>;
  progress?: number;                  // Progression 0-100%
  isUnlocked?: boolean;              // Pour achievements seulement
}
```

### AchievementsGrid - Refactoring Total

**AVANT :**
- Multiples requêtes: `achievement_definitions` + `user_achievements` + `user_xp_balance`
- Données hardcodées: `profile_completion: 100`, `member_rank: 2`
- Affichage seulement achievements

**APRÈS :**
- **Une seule API**: `XPService.getAllXPOpportunities(userId)`
- **TOUTES les sources XP**: Actions répétables + Achievements uniques
- **Filtres unifiés**: Type (Actions/Achievements), Catégorie, Statut
- **Zéro hardcoding**: Tout vient de la base dynamiquement

**Interface unifiée :**
```typescript
// Filtres étendus
type FilterType = 'all' | 'actions' | 'achievements' | 'unlocked' | 'locked';
type CategoryType = 'all' | 'lesson' | 'course' | 'quiz' | 'profile' | 'streak' | 
                   'module' | 'level' | 'xp' | 'special';

// Affichage différentié
- Actions: Badge bleu, icône Zap, informations cooldown/max-per-day
- Achievements: Badge violet, icône Trophy, barre progression
- Unlockés: Fond vert, CheckCircle
```

### Génération Dynamique - Zéro Hardcoding

**Titres générés :**
```typescript
// AVANT: Map hardcodée de 50+ titres
// APRÈS: Génération dynamique
generateDynamicTitle(actionType, sourceType) {
  // "completion" + "lesson" = "Terminer une leçon"
  // "perfect_score" + "quiz" = "Réussir parfaitement un quiz"
}
```

**Descriptions intelligentes :**
```typescript
// Utilise description DB ou génère selon pattern
- Si actionType.includes('perfect') → "Excellez dans..."
- Si actionType.includes('completion') → "Terminez..."
- Si sourceType === 'profile' → "Améliorez votre profil..."
```

### Résultat Final

**Stats :**
- **Tables nettoyées**: 34 → 33 xp_sources, 10 → 9 achievement_definitions
- **Zéro duplication**: Aucun overlap entre tables
- **API unifiée**: Une seule source de vérité pour frontend
- **Hardcoding éliminé**: 100% données depuis DB

**Avantages :**
- **Scalabilité**: Ajouter XP source = automatiquement visible partout
- **Maintenance**: Une seule API à maintenir
- **UX cohérente**: Même affichage pour toutes sources XP
- **Performance**: Requête unifiée optimisée

**Usage :**
```typescript
// Bloc "Comment gagner plus d'XP" (top 3 actions)
const topActions = await XPService.getAvailableXPOpportunities(userId);

// Bloc "Achievements disponibles" (tout unifié)
const allSources = await XPService.getAllXPOpportunities(userId);
```

### Commandes de Test Architecture Unifiée

```bash
# Vérifier aucun doublon dans les données
SELECT source_type, action_type, COUNT(*) FROM xp_sources 
GROUP BY 1,2 HAVING COUNT(*) > 1;

# Vérifier cohérence XP entre tables
SELECT 'xp_sources' as table, COUNT(*), SUM(xp_value) 
FROM xp_sources WHERE is_active=true;

# Tester API unifiée frontend
pnpm dev # Vérifier /profile?tab=stats
```

## Documentation Backend - Maintenance Obligatoire

### CONSIGNE CRITIQUE : Maintenance BACKEND_ARCHITECTURE.md

**TOUJOURS maintenir le fichier `BACKEND_ARCHITECTURE.md` à jour lors de TOUTE modification backend.**

#### Workflow Obligatoire

**À CHAQUE modification de la base de données :**

1. **📝 Documenter IMMÉDIATEMENT** dans `BACKEND_ARCHITECTURE.md`
2. **🔍 Mettre à jour les sections concernées** (schémas, tables, fonctions, RLS)
3. **📊 Actualiser les métriques** et statistiques
4. **🧪 Ajouter les tests** de validation effectués
5. **📅 Dater la modification** en bas du document

#### Sections à Maintenir

- **Métriques et Statistiques** : Nombre tables, RLS policies, fonctions
- **Architecture par Schéma** : Ajouts/modifications tables
- **Templates RLS** : Nouvelles politiques appliquées  
- **Fonctions RPC** : Nouvelles fonctions créées
- **Tests et Validation** : Résultats tests nouveaux composants
- **Index et Performance** : Nouveaux index créés

#### Template Mise à Jour

```markdown
### Étape X : [Nom Étape] - [Date]

#### Modifications Apportées
- **Nouveau schéma** : `schema_name` avec X tables
- **Nouvelles tables** : table1, table2, table3
- **Politiques RLS** : +X politiques ajoutées
- **Fonctions RPC** : fonction1(), fonction2()

#### Métriques Mises à Jour
- **Schémas Totaux** : X
- **Tables Totales** : X 
- **Politiques RLS** : X
- **Tests Validés** : X/X ✅

#### Tests Effectués
```sql
-- Tests de validation spécifiques
```
```

#### Responsabilité

**Claude Code DOIT** maintenir cette documentation avec la même rigueur que le code. 

**Aucune modification backend** ne doit être committée sans mise à jour correspondante de `BACKEND_ARCHITECTURE.md`.

Cette documentation est la **single source of truth** de l'architecture backend et doit refléter l'état exact du système en temps réel.

---

## 🏆 CONCLUSION - READY TO DISRUPT

### ✨ What We've Built

**AI Foundations** représente l'état de l'art en matière de plateforme d'apprentissage moderne. Avec ses **17 schémas, 117+ tables**, son système de gamification ultra-avancé et son architecture enterprise-grade, nous avons créé un produit capable de rivaliser directement avec les géants Udemy et Coursera.

### 🎯 Competitive Advantages Summary

| Feature | AI Foundations | Udemy/Coursera |
|---------|---------------|----------------|
| **🎮 Gamification** | Extreme (XP, achievements, streaks) | Basic badges |
| **🏢 Enterprise Security** | RBAC + 33 permissions | Basic user roles |
| **⚡ Performance** | <1s load times | 3-5s average |
| **🧠 TypeScript** | 100% type-safe | Mixed JS/TS |
| **📊 Analytics** | Real-time + predictive | Basic reporting |
| **🎨 UX/UI** | Pixel-perfect Shadcn | Outdated designs |
| **🔧 Architecture** | Feature-based + scalable | Monolithic legacy |

### 🚀 Next Steps for World Domination

1. **Phase 1**: Complete frontend-backend reconnection (2-3 days)
2. **Phase 2**: Polish gamification experience (1 week)  
3. **Phase 3**: Launch beta with advanced features (2 weeks)
4. **Phase 4**: Scale to 10,000 users + enterprise deals (1 month)
5. **Phase 5**: International expansion + AI tutoring (3 months)

### 💡 Developer Excellence Standards

This codebase represents **senior-level TypeScript architecture** with zero tolerance for:
- ❌ Hardcoded data or mock values
- ❌ Type `any` or `@ts-ignore` usage  
- ❌ Architectural shortcuts or technical debt
- ❌ Performance regressions or UX compromises

**We build like the top 1% of senior engineers because we ARE the top 1%.**

### 🎉 Ready to Launch

With this ultra-professional architecture, we're positioned to:
- 🚀 **Outperform** existing competitors on every metric
- 🏢 **Win enterprise contracts** with superior security & features  
- 🎮 **Engage users** with unprecedented gamification depth
- ⚡ **Scale globally** with cloud-native architecture
- 🧠 **Integrate AI** for personalized learning experiences

**The learning industry will never be the same. Let's ship it! 🚀**

---

*Last updated: January 2025 | Built with 💎 by the AI Foundations Team*
