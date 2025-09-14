import type { Code } from './Code.type';

export type Ticket = {
    id: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    codes: Code[];
};