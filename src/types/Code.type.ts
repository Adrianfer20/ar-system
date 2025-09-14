export type Code = {
    code: string;
    status: boolean;
    usedAt: {
        _seconds: number;
        _nanoseconds: number;
    };
};