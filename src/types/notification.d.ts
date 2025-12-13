/**
 * Defines the possible string values for the 'category' field.
 * These should match the choices defined in NotificationCategories in Django.
 */
export type NotificationCategory =
    | 'AUCTION_CREATED'
    | 'AUCTION_JOINED'
    | 'AUCTION_OUTBID'
    | 'SYSTEM_UPDATE'
    | string; // Allows for future categories


export interface Notification {
    readonly id: number;
    readonly created_at: string; // ISO 8601 string
    readonly updated_at: string; // ISO 8601 string
    user: number; // Foreign Key to User model's ID
    sender: number | null; // Foreign Key to User model's ID
    category: NotificationCategory;
    content: string | null;
    is_read: boolean;
    content_type: number | null;
    object_id: number | null;
}

export interface NotificationPagination {
    count: number;
    results: Notification[];
    next: string | null;
    previous: string | null;
}

