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


const EXTENSION_DEVICE_DETAILS_PAGE = 'https://continuitybrowser.com/extension_device_details';


function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const device_to_windowid_map = new Map();
const windowid_to_device_map = new Map();
const tab_ids = new Map();

const methods = {
    "open_tab": async ({ is_incognito, url, window_id, target_device_type }, sendResponse) => {
        if (device_to_windowid_map.has(window_id)) {
            const id = device_to_windowid_map.get(window_id);
            chrome.windows.getAll({ populate: false, windowTypes: ['normal'] }, async function (windows) {
                const idx = windows.findIndex((w) => w?.id === id);
                if (idx !== -1) {
                    const tab = await chrome.tabs.create({ url, windowId: id });
                    tab_ids.set(tab.id, tab.pendingUrl);
                    chrome.windows.update(id, {
                        focused: true
                    });
                }
                else {
                    // Clear the unfound window data
                    device_to_windowid_map.delete(window_id);
                    windowid_to_device_map.delete(id);

                    // window was closed. Open a new window
                    const window = await chrome.windows.create({ url: [`${EXTENSION_DEVICE_DETAILS_PAGE}?device_name=${window_id}&device_type=${target_device_type}`, url], incognito: is_incognito });
                    for (const tab of window.tabs) {
                        tab_ids.set(tab.id, tab.pendingUrl);
                    }
                    device_to_windowid_map.set(window_id, window?.id);
                    windowid_to_device_map.set(window?.id, window_id);
                }
            })
        }
        else {
            const window = await chrome.windows.create({ url: [`${EXTENSION_DEVICE_DETAILS_PAGE}?device_name=${window_id}&device_type=${target_device_type}`, url], incognito: is_incognito });
            for (const tab of window.tabs) {
                tab_ids.set(tab.id, tab.pendingUrl);
            }
            device_to_windowid_map.set(window_id, window?.id);
            windowid_to_device_map.set(window?.id, window_id);
        }
    }
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (methods[request?.type] !== undefined && methods[request?.type] !== null) {
        methods[request?.type](request?.data, sendResponse);
    }
});


chrome.tabs.onRemoved.addListener(function (tabId) {
    tab_ids.delete(tabId);
})

chrome.windows.onRemoved.addListener(function (window_id) {
    if (windowid_to_device_map.has(window_id)) {
        const device = windowid_to_device_map.get(window_id);
        device_to_windowid_map.delete(device);
        windowid_to_device_map.delete(window_id);;
    }
})


// ============== Event listners ==============
chrome.tabs.onUpdated.addListener(function (tabid, changeinfo, tab) {
    const url = tab.url;
    if (url !== undefined && changeinfo.status == "complete") {
        if (windowid_to_device_map.has(tab.windowId)) {
            // Window already exist for given device.
            if (tab_ids.has(tabid)) {
                if (tab_ids.get(tabid) !== url) {
                    // Tab is already added --> an update. Get the device and emit update!
                    console.log(`UPDATE url: ${url} \n\nto device: ${windowid_to_device_map.get(tab.windowId)}`);
                }
            }
            else {
                // New tab added to device. Create a new tab.
                console.log(`CREATE url: ${url} \n\nto device: ${windowid_to_device_map.get(tab.windowId)}`);

                tab_ids.set(tabid, url);
            }
        }

        else {
            // Window doesn't exist for any device. Add these tabs to current (this) device!

            chrome.storage.local.get('device_name', function (curr) {
                const curr_device = curr?.device_name;

                if (tab_ids.has(tabid)) {
                    if (tab_ids.get(tabid) !== url) {
                        // Tab is already added --> an update. Get the device and emit update!
                        console.log(`UPDATE url: ${url} \n\nto device: ${windowid_to_device_map.get(tab.windowId)}`);
                    }
                }
                else {
                    // New tab added to device. Create a new tab.
                    console.log(`CREATE url: ${url} \n\nto device: ${curr_device}`);

                    tab_ids.set(tabid, url);
                }

                windowid_to_device_map.set(tab.windowId, curr_device);
                device_to_windowid_map.set(curr_device, tab.windowId);
            });
        }
    }
})