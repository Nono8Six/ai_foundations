interface BulkOperationsProps {
    selectedItems: string[];
    onClose: () => void;
    onExecute: (operationId: string, items: string[]) => void;
}
declare const BulkOperations: ({ selectedItems, onClose, onExecute, }: BulkOperationsProps) => import("react/jsx-runtime").JSX.Element;
export default BulkOperations;
