interface BulkActionsBarProps {
    selectedCount: number;
    onBulkAction: (action: string) => void;
    onClearSelection: () => void;
}
declare const BulkActionsBar: ({ selectedCount, onBulkAction, onClearSelection, }: BulkActionsBarProps) => import("react/jsx-runtime").JSX.Element;
export default BulkActionsBar;
