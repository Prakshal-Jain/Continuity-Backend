
// const socket = new WebSocket('ws://10.3.12.22/websocket')

// socket.onopen = (event) => {
//     console.log('Connection Established');
//     const data = {
//         event_name: "login",
//         data: { 'device_name': 'Blahhh', 'email': 'prashaljain42@gail.com', 'family_name': 'Jain', 'given_name': 'prakshal', 'id': '108536725217798960329', 'locale': 'en', 'name': 'prakshal Jain', 'picture': 'https://lh3.googleusercontent.com/a/AEdFTp46EBCoVhTqDq7Nb_9C79dOLPFqb1bxJ4g-B9RAyQ=s96-c', 'verified_email': true, 'device_type': 'tablet', 'user_id': 'prashaljain42@gail.com' }
//     }
//     socket.send(JSON.stringify(data));
// };

// socket.onclose = (event) => {
//     console.log('Connection Closed');
// }

// socket.onmessage = (event) => {
//     console.log(event);
// }


// Get tab URL
// chrome.tabs.onUpdated.addListener(async function (id) {
//     const tab_url = await chrome.tabs.get(id);
//     console.log(tab_url);
// })


// For adding a new tab
// chrome.tabs.create({
//     url: "https://linkedin.com/",
// })


// For creating new window with multiple tabs
// chrome.windows.create({
//     url: ["https://linkedin.com/", "https://github.com/"],
// })


// For creating new window with single tab
// chrome.windows.create({
//     url: ["https://linkedin.com/", "https://github.com/"],
// })


// Get user info
let profile = {};
chrome.identity.getProfileUserInfo().then(function (userInfo) {
    profile = userInfo;
},
    (err) => console.log(err)
)


// Storage
// chrome.storage.local.set({ 'token': Math.random() });
// chrome.storage.local.get('token', (data) => {
//     console.log(data);
// });
// chrome.storage.local.remove('token', (data) => {
//     console.log(data);
// });


// Privacy tracker --> TODO


const readLocalStorage = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['device_name', 'device_token', 'user_id'], function (result) {
            if (result === undefined || result === null) {
                reject();
            } else {
                resolve(result);
            }
        });
    })
};


const methods = {
    "login": (data, sendResponse) => {
        const to_send = { message: { ...(data ?? {}), email: profile?.email, user_id: profile?.email } };
        sendResponse(to_send);
        return true;
    },
    "on_login": (data, sendResponse) => {
        const to_save = { device_name: data?.device_name, device_token: data?.device_token, user_id: data?.user_id };
        chrome.storage.local.set(to_save);
    },

    "auto_authenticate": (data, sendResponse) => {
        sendResponse(readLocalStorage());
    }
}



chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (methods[request?.message?.type] !== undefined && methods[request?.message?.type] !== null) {
        methods[request?.message?.type](request?.message?.data, sendResponse);
    }
});