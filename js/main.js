$(function () {
var APP_KEY = 'jcmzj1dcn8fg7qv';

var client = new Dropbox.Client({key: APP_KEY});

// Try to finish OAuth authorization.
client.authenticate({interactive: false}, function (error) {
    if (error) {
        alert('Authentication error: ' + error);
    }
});

if (client.isAuthenticated()) {
    console.log("client authenticated");
} else {
	console.log("client not authenticated");
}

});