/**
 * Copyright 2015 Atsushi Kojo.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

 module.exports = function (RED) {
 	'use strict';
 	function MetricsGraphicsNode (n) {
    RED.nodes.createNode(this, n);
    this.state = {
      data: [],
      active: 'enable'
    };
    this.name = n.name;
    this.column = n.column;
    this.routes = n.routes;
    var node = this;
    var keys = [];
    var legends = [];
    for(var i = 0; i < node.routes.length; i++) {
      keys.push(node.routes[i].key);
      legends.push(node.routes[i].legend);
    }

    this.on('input', function (msg) {
      msg.payload.date = new Date();
      node.state.data.push(msg.payload);
      if (node.state.data.length > node.column) node.state.data.shift();
      if (node.state.active === 'enable') {
        RED.comms.publish('chart', {
          id: node.id,
          name: node.name,
          data: node.state.data,
          chartOption: {
            title: node.name || 'metrics graphics',
            area: false,
            transition_on_update: false,
            full_width: true,
            x_accessor: 'date',
            y_accessor: keys,
            legend: legends
          }
        });
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType('metrics graphics', MetricsGraphicsNode);

  RED.httpAdmin.post("/metricsgraphics/:id/:state", function (req, res) {
    var node = RED.nodes.getNode(req.params.id);
    var state = req.params.state;
    if (node != null) {
      if (state === 'enable') {
        node.state.active = state;
        res.send(200);
      } else if (state === 'disable') {
        node.state.active = state;
        res.send(201);
      } else if (state === 'refresh') {
        node.state.data = [];
        res.send(202);
      } else {
        res.send(404);
      }
    } else {
      res.send(404);
    }
  });
};