const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess;

function startBackend() {
  const backendPath = path.join(
    __dirname,
    "..",
    "backend",
    "build",
    "bin",
    "server.js"
  );

  backendProcess = spawn("node", [backendPath], {
    cwd: path.join(__dirname, "..","backend")
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`API: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`ERROR API: ${data}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: true
  });

  win.on("closed", () => {
    console.log("Ventana cerrada");
  });

  win.on("ready-to-show", () => {
    console.log("Ventana lista");
    win.show();
  });

  win.webContents.openDevTools();

  win.loadFile(
    path.join(__dirname, "..", "frontend", "dist", "index.html")
  );

  win.webContents.on("did-finish-load", () => {
    console.log("Frontend cargado correctamente");
  });

  win.webContents.on("did-fail-load", (_, code, desc) => {
    console.error("Error:", code, desc);
  });
}

console.log("Cargando:", __dirname, "..", "frontend", "dist", "index.html");

app.whenReady().then(() => {
  startBackend();

  setTimeout(() => {
    createWindow();
  }, 5000);
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});