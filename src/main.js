#!/usr/bin/env node

const AGIHandler = require('./utils/handlers');
const logger = require('./utils/logger');

const main = async () => {
    const agiHandler = new AGIHandler();

    try {
        // Processa os dados recebidos do AGI
        const { channelId, uniqueId } = await agiHandler.process();

        // Captura os argumentos
        const args = process.argv.slice(2);
        logger.info(`[${channelId}] [${uniqueId}] Arguments received: ${args.join(', ')}`);

        // Adiciona as variáveis ao buffer
        agiHandler.setVariable('RESULTADO1', `Resultado para ${args[0] || 'arg1'}`);
        agiHandler.setVariable('RESULTADO2', `Resultado para ${args[1] || 'arg2'}`);
        agiHandler.setVariable('RESULTADO3', `Resultado para ${args[2] || 'arg3'}`);
        agiHandler.setVariable('nome_cliente', 'RAFAEL RIZZO');

        // Envia as variáveis ao Asterisk
        agiHandler.sendVariables(channelId, uniqueId);

        // Fecha a interface de leitura
        agiHandler.rl.close();
    } catch (err) {
        logger.error(`Erro no AGI: ${err.message}`);
        process.exit(1);
    }
};

main();
