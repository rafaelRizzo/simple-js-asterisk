# AGI Script para Asterisk

Este script é um exemplo de uso do Asterisk Gateway Interface (AGI) para processar chamadas no Asterisk. 

Ele captura dados do Asterisk via stdin, processa esses dados, define variáveis e as envia de volta para o Asterisk. Além disso, o script realiza logs detalhados para auditoria e depuração.

***

### Funcionalidades

- Captura de dados: Lê os dados de entrada do Asterisk via stdin, como o ID do canal e o identificador único da chamada.

- Definição de variáveis: Permite definir variáveis que podem ser utilizadas no dialplan do Asterisk.

- Log detalhado: Registra as ações em um arquivo de log e no console para depuração.

- Armazenamento de logs: Os logs são armazenados em um diretório configurável dentro do sistema de arquivos, com um formato de timestamp.

- Suporte a argumentos: Permite passar argumentos para o script a partir do Asterisk, definindo variáveis personalizadas.

### Dependências

- *readline*: Para capturar entrada de dados via stdin.
- *winston*: Para gerenciamento de logs, permitindo gravação de logs em arquivos e console.
- *path e fs*: Para manipulação de caminhos de arquivos e operações de sistema de arquivos.

### Instalação

Instalar as dependências:

O script utiliza Node.js e algumas bibliotecas que precisam ser instaladas via npm:

Clone o respositório e instale os pacotes com `npm install`

### Configuração do Asterisk:

Este script precisa ser integrado com o Asterisk via AGI. Certifique-se de que o Asterisk está configurado para executar scripts AGI.

### Criação do diretório de logs:

O script criará automaticamente o diretório de logs caso ele não exista. O caminho configurado é `/var/lib/asterisk/js-agi/src/logs`, mas você pode modificá-lo conforme necessário.

### Estrutura de Logs

Os logs são gerados em dois lugares:

- Arquivo de log (agi.log): Armazena logs detalhados com timestamp e nível de severidade (info, error).

- Console: Logs também são exibidos no console para depuração ao vivo.

### Como Funciona

- Leitura dos Dados: O script lê os dados enviados pelo Asterisk via stdin, capturando informações como agi_channel e agi_uniqueid.

- Processamento de Argumentos: O script processa os argumentos passados para ele (via Asterisk) e define variáveis com base nesses argumentos.

- Definição de Variáveis: As variáveis são adicionadas a um buffer e enviadas para o Asterisk.

- Envio de Variáveis: Quando todas as variáveis são processadas, o script envia essas variáveis de volta ao Asterisk usando a função SET VARIABLE.

- Finalização: Após o processamento, a interface de leitura é fechada, e o script termina.

## Exemplo de Uso

1. Integração no Asterisk
Configure o Asterisk para chamar o script AGI durante uma chamada, utilizando algo como:

```
exten => 1234,1,AGI(js-agi-script.js,arg1,arg2,arg3)
```

Neste exemplo, o Asterisk chama o script passando três argumentos: arg1, arg2, arg3.

2. Argumentos

- O script aceita até três argumentos, que são utilizados para definir variáveis como RESULTADO1, RESULTADO2, e RESULTADO3, mas que pode ser utilizando quantos quiser, basta ajustar no código.

```
RESULTADO1="Resultado para arg1"
RESULTADO2="Resultado para arg2"
RESULTADO3="Resultado para arg3"
```

Se os argumentos não forem passados, valores padrão serão utilizados.

#### Funções
`setVariable(name, value)`

Define uma variável que será enviada para o Asterisk.

name: O nome da variável.

value: O valor da variável.

`sendVariablesToAsterisk(channelId, uniqueId)`

Envia as variáveis armazenadas para o Asterisk.

channelId: O ID do canal Asterisk.

uniqueId: O identificador único da chamada.

`processAGI()`

Função principal que processa os dados do AGI e envia as variáveis para o Asterisk.
***

### Exemplo de Log:

```
[2024-11-26 15:30:22] [INFO]: [1234] [abc123] AGI Data: {"agi_channel":"SIP/1234-00000001","agi_uniqueid":"abc123"}
[2024-11-26 15:30:22] [INFO]: [1234] [abc123] Arguments received: arg1, arg2, arg3
[2024-11-26 15:30:22] [INFO]: [1234] [abc123] Variables sent to Asterisk:
SET VARIABLE RESULTADO1 "Resultado para arg1"
SET VARIABLE RESULTADO2 "Resultado para arg2"
SET VARIABLE RESULTADO3 "Resultado para arg3"
SET VARIABLE nome_cliente "RAFAEL RIZZO"
```

### Erros

Se ocorrer algum erro durante a execução do script, ele será registrado nos logs como um erro (ERROR) e o script será encerrado com um código de erro:

`[2024-11-26 15:30:23] [ERROR]: Erro no AGI: Descrição do erro aqui.`

Licença

Este script é distribuído sob a MIT License.

