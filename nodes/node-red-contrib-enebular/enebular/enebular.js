module.exports = function(RED) {
	var url = 'https://enebular.com';

    function EnebularNode(config) {
    	url = config.url;
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function(msg) {
            node.send(msg);
        });
    }
	RED.httpAdmin.get("/enebular/url", function (req, res) {
		res.json({url : url})
	});
    RED.nodes.registerType("enebular", EnebularNode);
}
