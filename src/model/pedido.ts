export type Urgencia = "baixa" | "media" | "alta";

export class Pedido {
    prato: string;
    horario: Date;
    urgencia: Urgencia;
    anotacoes?: string;

    constructor(prato: string, horario: Date, urgencia: Urgencia, anotacoes?: string) {
        this.prato = prato;
        this.horario = horario;
        this.urgencia = urgencia;
        anotacoes && (this.anotacoes = anotacoes);
    }

    static fromDTO({ prato, horario, urgencia, anotacoes }: PedidoDTO): Pedido {
        return new Pedido(prato, new Date(horario), urgencia, anotacoes);
    }
}