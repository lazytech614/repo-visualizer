export interface Hotspot {
    file: string;
    incoming: number;
    outgoing: number;
    score: number;
    severity: "low" | "medium" | "high";
}