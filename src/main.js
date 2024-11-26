#!/usr/bin/env node

/**
 * Script AGI (Asterisk Gateway Interface) para processar chamadas no Asterisk.
 * Este script captura dados do Asterisk via stdin, processa-os, e define
 * variáveis que podem ser usadas no dialplan.
 * Ele também grava logs detalhados para auditoria e depuração.
 */

// Importando os módulos necessários
const readline = require('readline'); // Para capturar entrada padrão (stdin)
const winston = require('winston'); // Para gerenciamento de logs
const path = require('path'); // Para manipulação de caminhos de arquivos/diretórios
const fs = require('fs'); // Para operações de sistema de arquivos

// Configuração do caminho para armazenamento de logs
const logDirectory = path.join('/var/lib/asterisk/js-agi/src/logs'); // Diretório onde os logs serão salvos
const logFilePath = path.join(logDirectory, 'agi.log'); // Nome do arquivo de log

// Garantir que o diretório de logs existe
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Configuração do logger utilizando o winston
const logger = winston.createLogger({
    levels: { info: 0, error: 1 }, // Definindo níveis de log
    transports: [
        // Log para arquivo
        new winston.transports.File({
            filename: logFilePath,
            level: 'info', // Nível mínimo de log salvo no arquivo
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(
                    ({ timestamp, level, message }) =>
                        `[${timestamp}] [${level.toUpperCase()}]: ${message}`
                )
            ),
        }),
        // Log para console (útil para depuração ao vivo)
        new winston.transports.Console({
            level: 'info', // Nível mínimo de log mostrado no console
            format: winston.format.printf(({ message }) => message),
        }),
    ],
});

// Criando uma interface para capturar entrada padrão do Asterisk
const rl = readline.createInterface({
    input: process.stdin, // Entrada padrão (stdin) para o AGI
    output: process.stdout, // Saída padrão (stdout) para o AGI
});

// Buffer para armazenar as variáveis que serão enviadas ao Asterisk
const variableBuffer = [];

/**
 * Adiciona uma variável ao buffer que será enviada ao Asterisk.
 * @param {string} name - Nome da variável.
 * @param {string} value - Valor da variável.
 */
const setVariable = (name, value) => {
    variableBuffer.push(`SET VARIABLE ${name} "${value}"`);
};

/**
 * Envia todas as variáveis armazenadas no buffer para o Asterisk.
 * @param {string} channelId - ID do canal Asterisk.
 * @param {string} uniqueId - Identificador único da chamada.
 */
const sendVariablesToAsterisk = (channelId, uniqueId) => {
    if (variableBuffer.length > 0) {
        // Logando o envio de variáveis
        logger.info(
            `[${channelId}] [${uniqueId}] Variables sent to Asterisk:\n${variableBuffer.join("\n")}`
        );

        // Enviando comandos para o Asterisk via stdout
        console.log(variableBuffer.join("\n"));

        // Limpando o buffer após envio
        variableBuffer.length = 0;
    }
};

/**
 * Função principal para processar os dados recebidos do AGI e enviar respostas ao Asterisk.
 */
const processAGI = async () => {
    const agiData = []; // Armazena os dados recebidos do AGI
    let channelId = ''; // Identificador do canal
    let uniqueId = ''; // Identificador único da chamada

    // Lendo a entrada padrão (dados do Asterisk) linha por linha
    for await (const line of rl) {
        if (line.trim() === '') break; // Interrompe a leitura ao encontrar uma linha vazia
        agiData.push(line); // Adiciona a linha ao array de dados

        // Captura o ID do canal a partir dos dados
        if (line.startsWith('agi_channel:')) {
            channelId = line.split(':')[1].trim();
        }

        // Captura o identificador único da chamada
        if (line.startsWith('agi_uniqueid:')) {
            uniqueId = line.split(':')[1].trim();
        }
    }

    // Logando os dados recebidos do AGI
    logger.info(`[${channelId}] [${uniqueId}] AGI Data: ${JSON.stringify(agiData)}`);

    // Capturando argumentos passados ao script pelo Asterisk
    const args = process.argv.slice(2); // Ignora os dois primeiros argumentos (node e script.js)
    logger.info(`[${channelId}] [${uniqueId}] Arguments received: ${args.join(', ')}`);

    // Definindo variáveis baseadas nos argumentos recebidos
    setVariable('RESULTADO1', `Resultado para ${args[0] || 'arg1'}`);
    setVariable('RESULTADO2', `Resultado para ${args[1] || 'arg2'}`);
    setVariable('RESULTADO3', `Resultado para ${args[2] || 'arg3'}`);
    setVariable('nome_cliente', `RAFAEL RIZZO`);

    // Enviando variáveis ao Asterisk
    sendVariablesToAsterisk(channelId, uniqueId);

    // Fechando a interface de leitura após o processamento
    rl.close();
};

// Executando a função principal e tratando erros
processAGI().catch((err) => {
    // Logando qualquer erro ocorrido
    logger.error(`Erro no AGI: ${err.message}`);
    process.exit(1); // Encerra o processo com código de erro
});
