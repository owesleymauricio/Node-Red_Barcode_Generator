// Import the 'bitgener' module that will be used to generate barcodes
const bitgener = require('bitgener');

// Exports the function that will be used as a Node-RED node
module.exports = function (RED) {

    // Asynchronous function that generates the barcode based on the
    // parameters provided
    async function generator(
        dt,
        barcodeType,
        outputFormat,
        encoding,
    ) {
        try {
            // Use the 'bitgener' module to generate the barcode
            const ret = await bitgener({
                data: dt,
                type: barcodeType || 'code128',
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

            return ret; // Returns the barcode generated according to the output format
        } catch (e) {
            console.error(e.toString());
            return null;
        }
    }

    // Constructor function of the "CodeGenerate" node
    function CodeGenerate(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', async function (msg) {
            try {
                // Gets the barcode type of the configurable field or
                // use a default value
                var barcodeType = config.barcodeType || 'CODE128';

                //Defines the height and width of the generated barcode
                //var barHeightFormat = msg.barHeightFormat || 150;
                //var barWidthFormat = msg.barWidthFormat || 5;

                // Get the message output format or use 'buffer'
                // as default
                var outputFormat = config.outputFormat || 'Buffer';

                // Get the node configuration encoding or use 'utf8' as default
                var encoding = config.encoding || 'UTF-8';

                // Call the generator function to generate the barcode with
                // based on input data
                msg.payload = await generator(
                    msg.payload,
                    barcodeType,
                    outputFormat,
                    encoding
                );

                // Send the message to the next step in the flow
                node.send(msg);

            } catch (error) {

                node.error("Erro na geração do código de barras: " + error, msg);
            }
        });
    }

    // Registers the "CodeGenerate" node type in Node-RED
    RED.nodes.registerType("CodeGenerate", CodeGenerate);
};
