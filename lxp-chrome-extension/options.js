
window.addEventListener('load', function() {

    options.username.value = localStorage.username;
    options.password.value = localStorage.password;
    options.idUser.value = localStorage.idUser;

    options.agendaevents.value = localStorage.agendaEvents;

    options.username.onchange = function() {
        localStorage.username = options.username.value;
    };
    options.password.onchange = function() {
        localStorage.password = options.password.value;
    };
    options.idUser.onchange = function() {
        localStorage.idUser = options.idUser.value;
    };

    options.agendaevents.onchange = function() {
        localStorage.agendaEvents= options.agendaevents.value;
    };

});



$(document).ready(function() {
    const loginDetailsNotValid = {
        type: "basic",
        iconUrl: "images/48.png",
        title: "Login details",
        message: "Please fill all the field to login!"
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

    $('#login-submit').click(function () {

        let siteurl = $('#siteurl').val();
        let userName = $('#username').val();
        let password = $('#password').val();

        if (!siteurl || !userName || !password) {
            chrome.notifications.create('loginDetailsNotValid', loginDetailsNotValid);
            return;
        }
        // doAjax('post_requests', 'get-ad-info', {"id": $(this).data('ad')}, '158', false)
        //     .then(function(addataObj) {
        //         if (addataObj) {
        //             console.log(addataObj);
        //         }
        //     });
        // let result = doRequest('POST',`${siteurl}/login`,`username=${userName}&password=${password}`)

        let data = `username=${userName}&password=${password}`;
        fetch(`${siteurl}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
            body: data
        })
        .then(function (response) {
            console.log(response)
        })
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
            console.log(error)
        });

    });
});

async function doRequest(method, url,data) {
    // await code here
    let result = await makeRequest(method, url,data);
    // code below here will only execute when await makeRequest() finished loading
    return result;
}


function makeRequest(method, url,data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(data);
    });
}



//
//     $.ajax({
//         url:  `${siteurl}/login`,
//         type: "POST",
//         data:  `username=${userName}&password=${password}`,
//         // username: userName,
//         // password: password,
//         async:false,
//         contentType: "application/x-www-form-urlencoded",
//         crossDomain : true, //mandatory
//         success: function (data, status, jqXHR) {
//             if ( this.responseText && this.responseText.authentication === true){
//                 chrome.storage.sync.set({'authentication':true,'userId':this.responseText.userId});
//                 chrome.notifications.create('loginSuccess', loginDetailsNotValid);
//                 return;
//             }
//             chrome.notifications.create('loginFailed', loginFailed);
//
//
//         },
//         error: function (jqXHR, status) {
//             console.log(jqXHR);
//             alert("Error: "+status);
//         }
//     });
// });
// const params = {
//     username: userName,
//     password: password
// };
//
// var http = new XMLHttpRequest();
// var url = 'http://mapp.exphosted.com/login';
// http.open('POST', url, true);
//
// // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
// http.setRequestHeader('Content-type', 'application/json')
//
// http.onreadystatechange = function() {//Call a function when the state changes.
//     if(http.readyState == 4 && http.status == 200) {
//         alert(http.responseText);
//     }
// }
// http.send(JSON.stringify(params)  );

// const req = new XMLHttpRequest();
// const baseUrl = `${siteurl}/login`;
// const urlParams = `username=${userName}&password=${password}`;

// req.open("POST", baseUrl,false);
// req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// req.send(urlParams);
// setTimeout(function(){
//     req.onreadystatechange = function() { // Call a function when the state changes.
//         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//             if ( this.responseText && this.responseText.authentication === true){
//                 chrome.storage.sync.set({'authentication':true,'userId':this.responseText.userId});
//                 chrome.notifications.create('loginSuccess', loginDetailsNotValid);
//                 return;
//             }
//             chrome.notifications.create('loginFailed', loginFailed);
//
//         }
//     }
// },5000);


//     let data = `username=${userName}&password=${password}`;
//     fetch(`${siteurl}/login`, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
//         body: data
//     })
//         .then(function (response) {
//             console.log(response)
//         })
//         .then(function (response) {
//             console.log(response)
//         })
//         .catch(function (error) {
//             console.log(error)
//         });
//
// });



