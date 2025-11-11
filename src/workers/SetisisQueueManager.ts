import { parentPort, workerData } from "worker_threads";
import https from "https";
import http from "http";

if (!parentPort) throw new Error("Must be run as a worker");

const url: string = workerData;
const INTERVAL_MS = 2000;

function checkConnection(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;

    const req = client
      .get(url, (res) => {
        resolve(res.statusCode === 200);
      })
      .on("error", () => resolve(false));

    req.setTimeout(4000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startMonitoring() {
  while (true) {
    const isUp = await checkConnection(url);
    parentPort!.postMessage({ url, isUp, timestamp: new Date() });
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
}

startMonitoring().catch((err) => {
  parentPort!.postMessage({ error: err.message });
});