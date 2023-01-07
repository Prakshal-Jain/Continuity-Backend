import "./websocket.js";

var socket = io("http://continuitybrowser.com");

socket.on('connect', function () {
    console.log("User connected")
});

socket.on('disconnect', function () {
    console.log("User disconnected")
});

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
// chrome.identity.getProfileUserInfo().then(function (userInfo){
//     console.log(userInfo);
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

// In the background script or content script: