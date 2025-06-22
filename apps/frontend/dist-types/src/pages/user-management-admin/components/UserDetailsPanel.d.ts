interface UserDetailsPanelProps {
    user: Record<string, unknown> | null;
    onClose: () => void;
}
declare const UserDetailsPanel: ({ user, onClose }: UserDetailsPanelProps) => import("react/jsx-runtime").JSX.Element | null;
export default UserDetailsPanel;
