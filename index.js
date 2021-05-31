const exec = require('child_process').exec;
const RPC = require('discord-rpc');
const clientId = '849060974643773460';
const client = new RPC.Client({transport: 'ipc'});
const cron = require('node-cron');
const activity = {};

/** Refresh the RPC data */
function refreshRPC() {
  exec(`osascript -e 'tell application "System Events" to set listOfProcesses to (name of every process where background only is false and frontmost is true)'; sw_vers -productVersion`, (err, stdout, stderr) => {
    if (stdout.length !== 0 && !err && stdout.split(/\r?\n/)[0] !== activity.details) {
      let text;
      if (stdout.split(/\r?\n/)[1].split('.')[1] < 12 && stdout.split(/\r?\n/)[1].split('.')[0] == 10) {
        text = `OS X ${stdout.split(/\r?\n/)[1]}`;
      } else {
        text = `macOS ${stdout.split(/\r?\n/)[1]}`;
      }
      activity.details = stdout.split(/\r?\n/)[0];
      activity.largeImageKey = 'icon';
      activity.largeImageText = text;
      activity.startTimestamp = Date.now();
      try {
        client.setActivity(activity);
      } catch (e) {
        console.error(e);
      }
    }
  });
}
client.on('ready', () => {
  console.log('Authorized for', client.user.username);
  refreshRPC();
});
cron.schedule('*/2 * * * * * *', () => {
  refreshRPC();
});
client.login({clientId});
