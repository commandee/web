import connection from "../database";
import { parseArray, parse, Pedido, Urgencia } from "../model/pedido";

export async function findAll(): Promise<Pedido[] | Error> {
    return parseArray(await connection.query('SELECT * FROM pedido'));
}

export async function findById(id: number): Promise<Pedido> {
    const pedido = parse(await connection.query('SELECT * FROM pedido WHERE id = ?', [id]));
    if (pedido instanceof Error) throw pedido;
    return pedido;
}

export async function findByUrgencia(urgencia: Urgencia): Promise<Pedido[]> {
    const pedidos = parseArray(await connection.query('SELECT * FROM pedido WHERE urgencia = ?', [urgencia]));
    if (pedidos instanceof Error) throw pedidos;
    return pedidos;
}

export async function insert(pedido: Pedido)  {
    return await connection.query('INSERT INTO pedido SET ?', [pedido]);
}
