module.exports = {
    apps: [{
      name: "node-rollback-project",
      script: "app.js",
      instances: 1,
      exec_mode: "fork"
    }]
  }