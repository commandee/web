import type { Priority } from "@prisma/client";

export const priorityColors = new Map<Priority, string>([
    ["low", "green"],
    ["medium", "yellow"],
    ["high", "red"],
])
