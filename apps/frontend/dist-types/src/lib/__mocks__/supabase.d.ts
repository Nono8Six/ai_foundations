export declare const supabase: {
    from: import("vitest").Mock<() => {
        select: import("vitest").Mock<(...args: any[]) => any>;
        insert: import("vitest").Mock<(...args: any[]) => any>;
        update: import("vitest").Mock<(...args: any[]) => any>;
        delete: import("vitest").Mock<(...args: any[]) => any>;
        eq: import("vitest").Mock<(...args: any[]) => any>;
        neq: import("vitest").Mock<(...args: any[]) => any>;
        gt: import("vitest").Mock<(...args: any[]) => any>;
        gte: import("vitest").Mock<(...args: any[]) => any>;
        lt: import("vitest").Mock<(...args: any[]) => any>;
        lte: import("vitest").Mock<(...args: any[]) => any>;
        in: import("vitest").Mock<(...args: any[]) => any>;
        is: import("vitest").Mock<(...args: any[]) => any>;
        order: import("vitest").Mock<(...args: any[]) => any>;
        limit: import("vitest").Mock<(...args: any[]) => any>;
        range: import("vitest").Mock<(...args: any[]) => any>;
        single: import("vitest").Mock<(...args: any[]) => any>;
        then: import("vitest").Mock<(onFulfilled: any, onRejected: any) => Promise<any>>;
        mockResolvedValueOnce: (value: any) => any;
    }>;
};
