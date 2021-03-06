
var os = require('os');

var upload = require('./lib/upload');
var watchFolder = require('./lib/watch-folder');




var couch_url = process.env.COUCH_URL || 'http://localhost:5984/my-path';
var deleteSuccess =  true;

var info = guess();
watchFolder.start(info.attach);

watchFolder.on('attached', function(f){
    console.log('connected');
    upload(info.folder, couch_url, deleteSuccess, function(err){
	if (err) return console.log('error: ', err);
        console.log('sync complete');
    });
});

watchFolder.on('detached', function(){
  console.log('disconnected');
});


function guess() {
    var info = {
        type: os.type(),
        platform: os.platform(),
        arch: os.arch()
    };

    if (info.platform === 'darwin') {
        info.attach = '/Volumes/SANSA CLIP/';
        info.folder = '/Volumes/SANSA CLIP/RECORD/VOICE/';
        return info;
    }

    if (info.platform === 'linux' && info.arch === 'arm') {
        // assume raspberry pi
        info.attach = '/media/usb0/';
        info.folder = '/media/usb0/RECORD/VOICE/';
        return info;
    }

}
