$(function () {

var client = new Dropbox.Client({key: 'iiz72ijenjkeuw9'});

client.authDriver(new Dropbox.AuthDriver.Popup({
receiverUrl: window.location.origin + '/oauth_receiver.html'
}));

// Authenticate when the user clicks the connect button.
$('#connectDropbox').click(function (e) {
e.preventDefault();
client.authenticate(updateAuthenticationStatus);
});

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