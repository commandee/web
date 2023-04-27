import mysql from 'mysql2/promise';
import { db } from './env';

let connection: mysql.Connection;

try {
    connection = await mysql.createConnection(db);
} catch (error) {
    console.error("Credenciais do banco de dados inválidas.\n\n", error);
    process.exit(1);
}

export default connection;
