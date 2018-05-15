module.exports = function(RED) {
    "use strict";

    function AWSSDKAnything(n) {
        
        RED.nodes.createNode(this, n);
        
        
      
        this.awsConfig = RED.nodes.getNode(n.aws);
        this.region = this.awsConfig.region;
        this.accessKey = this.awsConfig.accessKey;
        this.secretKey = this.awsConfig.secretKey;
        this.service = n.servicename;
        this.method = n.methodname;
        this.operation = n.operation;
      
        var node = this;
        

      	var AWS = require("aws-sdk");
        AWS.config.update({
          accessKeyId: this.accessKey,
          secretAccessKey: this.secretKey,
          region: this.region
        });

        var targetService = new AWS[node.service]();

        node.on("input", function (msg) {
          node.status({ fill: "blue", shape: "dot", text: "Processing..." });
          
          var callback = function (err, data) {
            if (err) {
              node.status({ fill: "red", shape: "dot", text: "error" });
              node.error("failed: " + err.toString(), msg);
              msg.err = err;
              msg.params = msg.payload;
              msg.payload = {};
              node.send(msg);
            } else {
              node.status({});
              msg.err = {};
              msg.params = msg.payload;
              msg.payload = data;
              node.send(msg);
            }
          }
          if (this.operation) {
            console.log("operation ❗");
            targetService[node.method](this.operation, msg.payload, callback);
          } else {
            console.log("none operation 👍");
            targetService[node.method](msg.payload, callback);
          }
      });
    }
    RED.nodes.registerType("aws-sdk-anything", AWSSDKAnything);
};
