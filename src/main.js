#!/usr/bin/env node

const AGIHandler = require('./utils/handlers');
const logger = require('./utils/logger');

const main = async () => {
    const agiHandler = new AGIHandler();

    try {
        const { channelId, uniqueId } = await agiHandler.process();

        const args = process.argv.slice(2);
        logger.info(`[${channelId}] [${uniqueId}] Arguments received: ${args.join(', ')}`);

        agiHandler.setVariable('RESULTADO1', `Resultado para ${args[0] || 'arg1'}`);
        agiHandler.setVariable('RESULTADO2', `Resultado para ${args[1] || 'arg2'}`);
        agiHandler.setVariable('RESULTADO3', `Resultado para ${args[2] || 'arg3'}`);
        agiHandler.setVariable('nome_cliente', 'RAFAEL RIZZO');

        agiHandler.sendVariables(channelId, uniqueId);

        agiHandler.rl.close();
    } catch (err) {
        logger.error(`Erro no AGI: ${err.message}`);
        process.exit(1);
    }
};

main();
