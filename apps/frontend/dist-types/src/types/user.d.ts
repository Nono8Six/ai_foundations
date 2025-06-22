export interface UserProfile {
    id: string;
    avatar_url: string | null;
    company: string | null;
    created_at: string | null;
    current_streak: number | null;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
    last_completed_at: string | null;
    level: number | null;
    phone: string | null;
    profession: string | null;
    updated_at: string | null;
    xp: number | null;
}
