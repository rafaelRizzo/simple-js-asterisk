const fs = require('fs');

/**
 * Cria um diretório se ele não existir.
 * @param {string} dirPath - Caminho do diretório.
 */
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

module.exports = { ensureDirectoryExists };
