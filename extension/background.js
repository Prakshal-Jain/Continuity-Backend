
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
// let profile = {};
// chrome.identity.getProfileUserInfo().then(function (userInfo) {
//     profile = userInfo;
// },
//     (err) => console.log(err)
// )


// Storage
// chrome.storage.local.set({ 'token': Math.random() });
// chrome.storage.local.get('token', (data) => {
//     console.log(data);
// });
// chrome.storage.local.remove('token', (data) => {
//     console.log(data);
// });


// Privacy tracker --> TODO

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const device_window_id_map = new Map();

const methods = {
    "open_tab": async ({ is_incognito, url, window_id }, sendResponse) => {
        if (device_window_id_map.has(window_id)) {
            const id = device_window_id_map.get(window_id);
            chrome.windows.getAll({ populate: false, windowTypes: ['normal'] }, async function (windows) {
                console.log(windows);
                const idx = windows.findIndex((w) => w?.id === id);
                if (idx !== -1) {
                    chrome.tabs.create({ url, windowId: id });
                    chrome.windows.update(id, {
                        focused: true
                    });
                }
                else {
                    // window was closed. Open a new window
                    const window = await chrome.windows.create({ url, incognito: is_incognito });
                    device_window_id_map.set(window_id, window?.id);
                }
            })
        }
        else {
            const window = await chrome.windows.create({ url, incognito: is_incognito });
            device_window_id_map.set(window_id, window?.id);
        }
    }
}



chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (methods[request?.type] !== undefined && methods[request?.type] !== null) {
        methods[request?.type](request?.data, sendResponse);
    }
});