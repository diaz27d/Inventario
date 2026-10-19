const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess;

/*function startBackend() {
  const backendPath = path.join(
    __dirname,
    "..",
    "backend",
    "build",
    "bin",
    "server.js"
  );

  const backendExe = path.join(
    process.resourcesPath,
    "backend",
    "backend.exe"
  );

  console.log(backendExe);
  backendProcess = spawn("node", [backendPath], {
    cwd: path.join(__dirname, "..","backend")
  });

  //backendProcess = spawn(backendExe);

  backendProcess.stdout.on("data", (data) => {
    console.log(`API: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`ERROR API: ${data}`);
  });
}*/

function startBackend() {

  try {

    let nodePath;
    let backendPath;
    let backendCwd;

    if (app.isPackaged) {

      nodePath = path.join(
        process.resourcesPath,
        "node",
        "node.exe"
      );

      backendPath = path.join(
        process.resourcesPath,
        "backend",
        "build",
        "bin",
        "server.js"
      );

      backendCwd = path.join(
        process.resourcesPath,
        "backend"
      );

    } else {

      nodePath = "node";

      backendPath = path.join(
        __dirname,
        "..",
        "backend",
        "build",
        "bin",
        "server.js"
      );

      backendCwd = path.join(
        __dirname,
        "..",
        "backend"
      );
    }

    console.log("Node:", nodePath);
    console.log("Backend:", backendPath);
    console.log("Cwd:", backendCwd);

    backendProcess = spawn(
      nodePath,
      [backendPath],
      {
        cwd: backendCwd
      }
    );

    backendProcess.on("exit", (code) => {
      console.log("BACKEND EXIT:", code);
    });

    backendProcess.on("close", (code) => {
      console.log("BACKEND CLOSE:", code);
    });

    backendProcess.on("error", (err) => {
      console.error("BACKEND ERROR:", err);
    });

    //console.log("Spawn:", backendProcess);

    if (!backendProcess) {
      console.error("No se pudo crear el proceso");
      return;
    }

    backendProcess.on("error", (err) => {
      console.error("ERROR SPAWN:", err);
    });

    if (backendProcess.stdout) {
      backendProcess.stdout.on("data", (data) => {
        console.log("API:", data.toString());
      });
    }

    if (backendProcess.stderr) {
      backendProcess.stderr.on("data", (data) => {
        console.error("API ERROR:", data.toString());
      });
    }

  } catch (e) {
    console.error("ERROR startBackend");
    console.error(e);
  }
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

  /*win.webContents.openDevTools();*/

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