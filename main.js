// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const menu = new Menu();

let mainWindow;

menu.append(new MenuItem({ label: 'Copy', role: 'copy', accelerator: 'CmdOrCtrl+C'}));
menu.append(new MenuItem({ label: 'Paste', role: 'paste', accelerator: 'CmdOrCtrl+V'}));

app.once('window-all-closed',function() { app.quit(); });

function createWindow () {
    mainWindow = new BrowserWindow({width: 400, height: 1000});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Create the Application's main menu
    var template = [{
        label: "Application",
        submenu: [
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // デバッグ用
    // mainWindow.webContents.openDevTools();

    // メインウィンドウが閉じられたときの処理
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    if (process.env.ELECTRON_IN_PAGE_SEARCH_DEBUG) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }
}

app.on('browser-window-created', function(event, win) {
    win.webContents.on('context-menu', function(e, params) {
        menu.popup(win, params.x, params.y);
    });
});

// 初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', function () {
    app.quit();
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', function () {
    /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
    if (mainWindow === null) {
        createWindow();
    }
});
