const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Configuração do caminho para armazenamento de logs
const logDirectory = path.join('/var/lib/asterisk/js-agi/src/logs'); // Diretório onde os logs serão salvos
const logFilePath = path.join(logDirectory, 'agi.log'); // Nome do arquivo de log

// Garantir que o diretório de logs existe
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Configuração do logger utilizando o winston
const logger = winston.createLogger({
    levels: { info: 0, error: 1 },
    transports: [
        new winston.transports.File({
            filename: logFilePath,
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(
                    ({ timestamp, level, message }) =>
                        `[${timestamp}] [${level.toUpperCase()}]: ${message}`
                )
            ),
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.printf(({ message }) => message),
        }),
    ],
});

module.exports = logger;
