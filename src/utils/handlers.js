const readline = require('readline');
const logger = require('../utils/logger');

class AGIHandler {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.variableBuffer = [];
    }

    /**
     * Adiciona uma variável ao buffer.
     * @param {string} name - Nome da variável.
     * @param {string} value - Valor da variável.
     */
    setVariable(name, value) {
        this.variableBuffer.push(`SET VARIABLE ${name} "${value}"`);
    }

    /**
 * Envia as variáveis do buffer ao Asterisk.
 * @param {string} channelId - ID do canal Asterisk.
 * @param {string} uniqueId - Identificador único da chamada.
 */
    sendVariables(channelId, uniqueId) {
        if (this.variableBuffer.length > 0) {
            logger.info(
                `[${channelId}] [${uniqueId}] Variables sent to Asterisk:\n${this.variableBuffer.join("\n")}`
            );

            // Enviar variáveis para o Asterisk
            for (const command of this.variableBuffer) {
                logger.log(command);
            }

            // Limpando o buffer para evitar duplicações
            this.variableBuffer.length = 0;
        }
    }

    /**
     * Processa a entrada do AGI.
     */
    async process() {
        const agiData = [];
        let channelId = '';
        let uniqueId = '';

        for await (const line of this.rl) {
            if (line.trim() === '') break;
            agiData.push(line);

            if (line.startsWith('agi_channel:')) {
                channelId = line.split(':')[1].trim();
            }
            if (line.startsWith('agi_uniqueid:')) {
                uniqueId = line.split(':')[1].trim();
            }
        }

        logger.info(`[${channelId}] [${uniqueId}] AGI Data: ${JSON.stringify(agiData)}`);
        return { agiData, channelId, uniqueId };
    }
}

module.exports = AGIHandler;
