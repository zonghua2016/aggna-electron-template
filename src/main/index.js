/*
 * @Author       : tongzonghua
 * @Date         : 2020-07-12 23:47:24
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-10-21 03:02:13
 * @Email        : tongzonghua@360.cn
 * @Description  : 
 * @FilePath     : /cli/aggna-electron-template/src/main/index.js
 */
import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  shell,
  globalShortcut,
  screen
} from 'electron'
import { autoUpdater } from "electron-updater";
import pkg from "../../package.json";
import log, { create } from "electron-log";
log.transports.console.level = false;
log.transports.console.level = "silly";
import { BASEURL } from '../../src/renderer/utils/config.js'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const productName = pkg.build.productName;
function createWindow() {
  // 注册快捷键
  globalShortcut.register("CommandOrControl+Alt+D", () => {
    mainWindow.webContents.openDevTools();
  });

  // 托盘
  app.setAppUserModelId(productName); // 设置通知标题
  const tray = new Tray(`${__static}/icon.png`);
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: "打开",
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip(productName);
  tray.on("click", () => {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  });
  tray.on("right-click", () => {
    tray.popUpContextMenu(trayContextMenu);
  });
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 420,
    useContentSize: true,
    frame: false, // 无边框
    resizable: false,
    transparent: false,
    webPreferences: { webSecurity: false },
    icon: `${__static}/icon.ico`
  })

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(winURL)

  // 加载好html再呈现window，避免白屏-->最好将程序背景色设置为html背景色
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // mainWindow.on('closed', () => {
  //   mainWindow = null
  // })
  handleUpdate();
}
// 单实例启动
const singleApp = app.requestSingleInstanceLock();
if (!singleApp) {
  app.quit();
} else {
  app.on("second-instance", (event, argv, cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  });
  app.on("ready", createWindow);
}
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 关闭窗口
let isQuitOrClose;
ipcMain.on("chgQuitOrClose", (e, data) => {
  isQuitOrClose = data;
});
ipcMain.on("close", e => {
  if (isQuitOrClose) {
    mainWindow.close();
  } else {
    mainWindow.hide();
  }
  e.preventDefault();
});

ipcMain.on("quit", e => {
  mainWindow.close();
  e.preventDefault();
});
// 最小化窗口
ipcMain.on("min", () => {
  mainWindow.minimize();
});

// AutoLaunch
import startOnBoot from "./startOnBoot.js";

// 是否打开启动项
ipcMain.on("chkAutoLaunch", e => {
  startOnBoot.getAutoStartValue(productName, (error, result) => {
    e.sender.send("isAutoLaunch", error ? false : true);
  });
});
// 加入启动项
ipcMain.on("addAutoLaunch", () => {
  startOnBoot.enableAutoStart(productName, process.execPath);
});
// 移除启动项
ipcMain.on("removeAutoLaunch", () => {
  startOnBoot.disableAutoStart(productName);
});
// 设置主窗体大小--助手更新使用
ipcMain.on("resetWinSize", (e, size) => {
  mainWindow.setSize(size.width, size.height);
  mainWindow.center();
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// 更新地址
const updateURL = `${BASEURL}upgrade/`;

// 检测更新
export function handleUpdate() {
  const message = {
    error: "检查更新出错",
    checking: "正在检查更新…",
    updateAva: "正在更新",
    updateNotAva: "已经是最新版本",
    downloadProgress: "正在下载..."
  };
  // 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
  autoUpdater.autoDownload = false;
  autoUpdater.setFeedURL(updateURL);
  autoUpdater.on("error", function (e) {
    log.warn("error", e);
    sendUpdateMessage({ cmd: "error", message: message.error });
  });
  autoUpdater.on("checking-for-update", function () {
    log.warn(message.checking);
    sendUpdateMessage({
      cmd: "checking-for-update",
      message: message.checking
    });
  });
  autoUpdater.on("update-available", function (info) {
    log.warn(message.updateAva);
    sendUpdateMessage({
      cmd: "update-available",
      message: message.updateAva,
      info
    });
  });
  autoUpdater.on("update-not-available", function (info) {
    log.warn(message.updateNotAva);
    sendUpdateMessage({
      cmd: "update-not-available",
      message: message.updateNotAva,
      info: info
    });
  });
  // 更新下载进度事件
  autoUpdater.on("download-progress", function (progressObj) {
    log.warn("触发下载。。。");
    log.warn(progressObj);
    sendUpdateMessage({
      cmd: "downloadProgress",
      message: message.downloadProgress,
      progressObj
    });
  });
  autoUpdater.on("update-downloaded", function (
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate
  ) {
    // ipcMain.on('isUpdateNow', (e, arg) => {
    log.warn("开始更新");
    autoUpdater.quitAndInstall();
    mainWindow.destroy();
    // callback()
    // })
    // sendUpdateMessage({ cmd: 'isUpdateNow', message: null })
  });

  ipcMain.on("checkForUpdate", () => {
    log.warn("执行自动更新检查");
    autoUpdater.checkForUpdates();
  });

  ipcMain.on("downloadUpdate", () => {
    log.warn("执行下载");
    autoUpdater.downloadUpdate();
  });
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(data) {
  mainWindow.webContents.send("message", data);
}
