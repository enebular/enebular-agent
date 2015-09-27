var uuid = require('uuid');
var store = require('../store');

module.exports = {
	agent_id : null,
	init : function(cb) {
		var that = this;
		store.get('agentid', function(err, agent_id) {
			if(err) {
				throw err;
			}
			if(agent_id) {
				if(cb) cb(err, agent_id)
			}else{
				agent_id = uuid.v1();
				store.set('agentid', agent_id, function(err) {
					if(err) throw err;
					if(cb) cb(err, agent_id);
				});
			}
			that.agent_id = agent_id;
			console.log('agent_id', agent_id);
		});

	},
	getAgentId : function() {
		return this.agent_id;
	}
}