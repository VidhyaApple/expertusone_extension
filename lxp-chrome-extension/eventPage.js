window.addEventListener('beforeunload', function (e) {
    chrome.storage.local.clear();
});
const menuItem = {
    "id": "lmsMenu",
    "title": "Add Video Content to ExpertusONE",
    "contexts": ["all"]
};

const notLoggedInMsg = {
    type: "basic",
    iconUrl: "images/48.png",
    title: "Please Sign In!",
    message: "Uh oh, look's like you haven't logged in yet! Please Log In to add video to ExpertusONE"
};

const notValidUrl = {
    type: "basic",
    iconUrl: "images/48.png",
    title: "Video URL Invalid",
    message: "Please select/open a valid video!"
};

const videoAdded = {
    type: "basic",
    iconUrl: "images/48.png",
    title: "Video URL Added!",
    message: "Video content is added successfully!"
};

const videoFailedToAdd = {
    type: "basic",
    iconUrl: "images/48.png",
    title: "Video URL Failed To Add!",
    message: "Error Occurred while adding video content to ExpertusONE!"
};


const loginFailed = {
    type: "basic",
    iconUrl: "images/48.png",
    title: "Login Failed!",
    message: "Username/password doesn't exist"
};

const loginSuccess = {
    type: "basic",
    iconUrl: "images/48.png",
    title: "Logged In Successfully!",
    message: "You are logged in successfully. Start adding videos to ExpertusONE"
};
chrome.contextMenus.removeAll();

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){

    if ( clickData.menuItemId !== "lmsMenu") return;

    addVideo(clickData);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.todo){
        case 'addVideo':
            addVideo(request.data);
            break;
        case 'login':
            doLogin(request.params);
            break;
    }

});

function addVideo(clickData = null ){

    if ( ! clickData ) null;


    chrome.storage.local.get('expertusone', function (login) {
        if ( ! login.expertusone || login.expertusone.authentication !== true) {
            chrome.notifications.create('notLoggedIn', notLoggedInMsg);
            return;
        }

        let videoURL = false;
        if ( clickData.selectionText ) videoURL = clickData.selectionText;
        else if ( clickData.mediaType == "image" && clickData.linkUrl ) videoURL = clickData.linkUrl;
        else if ( clickData.mediaType == 'video' && clickData.pageUrl ) videoURL = clickData.pageUrl;
        else if ( clickData.pageUrl ) videoURL = clickData.pageUrl;

        if ( ! videoURL ) return;

        if ( ! isValidHttpUrl(videoURL)){
            chrome.notifications.create('notValidUrl', notValidUrl);
            return;
        }

        try {
            var params = {
                'api_name': 'createContent',
                'learner_id': login.expertusone.userId,
                'description': clickData.title ?? 'Video added through chrome extension',
                'video_url': videoURL,
                'display_cols':'status,message'
            };
            axios.get('http://f3dev.exphosted.com/v2/rest/api', {
                params: params
            })
                .then(res => {
                    if ( ! res.data || ! res.data.status || res.data.status !== 'Success'){
                        chrome.notifications.create('videoFailedToAdd', videoFailedToAdd);
                        return;
                    }
                    chrome.notifications.create('videoAdded', videoAdded);
                })
                .catch(error => {
                    console.log(error);
                    chrome.notifications.create('videoFailedToAdd', videoFailedToAdd);
                });

        } catch (e) {
            // TODO: handle exception
            console.log(e, e.stack);
        }


    });
}


function doLogin(params){
    try {

        let data = new FormData();
        data.set('username',params.username);
        data.set('password',params.password);

        axios.post(`${params.siteurl}/login`, data)
            .then(res => {
                if ( ! res.data || ! res.data.authenticated || res.data.authenticated !== true ){
                    chrome.notifications.create('loginFailed', loginFailed);
                    return;
                }
                let storage = {
                    'authentication' : true,
                    'userId': res.data.userId,
                    'username': params.username
                }
                chrome.storage.local.set({'expertusone': storage});

                chrome.notifications.create('loginSuccess', loginSuccess);

                chrome.runtime.sendMessage({todo: "loggedin",'username':params.username});

            })
            .catch(error => {
                console.log(error);
            });

    } catch (e) {
        // TODO: handle exception
        console.log(e, e.stack);
    }
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}




