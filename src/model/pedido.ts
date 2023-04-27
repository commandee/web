import { z } from "zod";

const urgencias = ["baixa", "media", "alta"] as const;

export const UrgenciaSchema = z.enum(urgencias, {
    required_error: "Informe a urgência do pedido.",
    invalid_type_error: "As urgências permitidas são:  " + urgencias.join(" | ") + "."
});
export type Urgencia = z.infer<typeof UrgenciaSchema>;

export const PedidoSchema = z.object({
    prato: z.string({
        required_error: "Informe o prato do pedido.",
        invalid_type_error: "O prato informado é inválido."
    }).min(3).max(255).trim(),
    horario: z.coerce.date({
        required_error: "Informe o horário em que o pedido foi realizado.",
        invalid_type_error: "O horário informado é inválido."
    }).min(new Date("2023-00-00T00:00Z+03:00")),
    urgencia: UrgenciaSchema,
    anotacoes: z.string({
        invalid_type_error: "Anotações inválidas."
    }).optional()
});

export type Pedido = z.infer<typeof PedidoSchema>;

export function parse(pedido: unknown): Pedido | Error {
    const parsed = PedidoSchema.safeParse(pedido);
    return parsed.success ? parsed.data : new Error(parsed.error.message);
}

export function parseArray(pedidos: unknown): Pedido[] | Error {
    const parsed = PedidoSchema.array().safeParse(pedidos);
    return parsed.success ? parsed.data : new Error(parsed.error.message);
}
