import type { Ticket } from './Ticket.type';

export type TicketsResponse = {
    success: boolean;
    data: Ticket[];
};
