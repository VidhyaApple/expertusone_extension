// Future JavaScript will go here
$(document).ready(function() {

    window.addEventListener('beforeunload', function (e) {
        chrome.storage.local.clear();
    });


    const loginDetailsNotValid = {
        type: "basic",
        iconUrl: "images/48.png",
        title: "Login details",
        message: "Please fill all the field to login!"
    };

    chrome.storage.local.get('expertusone',function(data){
        if ( ! data.expertusone || ! data.expertusone.authentication ) return;
        showLoggedInScreen(data.expertusone.username);
    });


    $('#add-video').click(function(){
        let data = {};

        chrome.tabs.query(
            {
                currentWindow: true,    // currently focused window
                active: true            // selected tab
            },
            function (foundTabs) {
                if (foundTabs.length <= 0) return;
                 data.pageUrl = foundTabs[0].url;
                 if ( foundTabs[0].title) data.title = foundTabs[0].title;
                 chrome.runtime.sendMessage({todo: "addVideo",data:data});
            }

        );

       // if (window.getSelection && window.getSelection().toString() !== '' ) data.selectionText = window.getSelection().toString();


    });

    $('#sign-in').click(function(){
        $('#showloginform').show();
        $('#notloggedin').hide();

    });

    $('#login-submit').click(function () {

        let siteurl = $('#siteurl').val();
        let userName = $('#username').val();
        let password = $('#password').val();

        if (!siteurl || !userName || !password) {
            chrome.notifications.create('loginDetailsNotValid', loginDetailsNotValid);
            return;
        }

        params = {
            siteurl:siteurl,
            username: userName,
            password: password
        }
        chrome.runtime.sendMessage({todo: "login",params:params});


    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        switch(request.todo){
            case 'loggedin':
                showLoggedInScreen(request.username);
                break;
        }

    });


});

function showLoggedInScreen(username){
    $('#showloginform').hide();
    $('#notloggedin').hide();
    $('#loggedin').show();
    $('#loggedin-user').text("Hi," + username);

}
