// Importa o módulo 'bitgener' que será usado para gerar códigos de barras
const bitgener = require('bitgener');

// Exporta a função que será utilizada como um nó Node-RED
module.exports = function (RED) {

    // Função assíncrona que gera o código de barras com base nos
    // parâmetros fornecidos
    async function gerador(dt, tipo, outputFormat, encoding) {
        try {
            // Utiliza o módulo 'bitgener' para gerar o código de barras
            const ret = await bitgener({
                data: dt,
                type: tipo || 'code128',
                output: outputFormat || 'buffer',
                encoding: encoding || 'utf8',
                crc: false,
                padding: 25,
                barWidth: 5,
                barHeight: 150,
                original1DSize: true,
                addQuietZone: true,
                color: '#000',
                opacity: 1,
                bgColor: '#F7931A',
                bgOpacity: 0.1,
                hri: {
                    show: true,
                    fontFamily: 'Futura',
                    fontSize: 25,
                    marginTop: 9,
                },
            });

            return ret; // Retorna o código de barras gerado conforme o formato de saída
        } catch (e) {
            console.error(e.toString());
            return null;
        }
    }

    // Função construtora do nó "GerarCodigo"
    function GerarCodigo(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', async function (msg) {
            try {
                // Obtém o tipo de código de barras do campo configurável ou
                // usa um valor padrão
                var barcodeType = config.barcodeType || 'CODE128';

                // Obtém o formato de saída da mensagem ou usa 'buffer' 
                // como padrão
                var outputFormat = config.outputFormat || 'Buffer';

                // Obtém o encoding da configuração do nó ou usa 'utf8' como padrão
                var encoding = config.encoding || 'UTF-8';

                // Obtém o caminho do arquivo da configuração do nó
              

                // Chama a função geradora para gerar o código de barras com
                // base nos dados de entrada
                msg.payload = await gerador(msg.payload, barcodeType, outputFormat, encoding);

                // Envia a mensagem para a próxima etapa do fluxo
                node.send(msg);

            } catch (error) {
                // Em caso de erro, emite uma mensagem de erro no console e na 
                // saída do nó
                node.error("Erro na geração do código de barras: " + error, msg);
            }
        });
    }

    // Registra o tipo de nó "GerarCodigo" no Node-RED
    RED.nodes.registerType("GerarCodigo", GerarCodigo);
};
