import fs from "fs";
import path from "path";

const FILE_PATH = path.join(__dirname, "..", "iplist.txt");

class IpHandler {
  static async getIpList(): Promise<string[]> {
    try {
      const data = await fs.promises.readFile(FILE_PATH, "utf8");
      return data.split("\n").filter((ip) => ip);
    } catch (error) {
      console.error("Error reading IP list file:", error);
      return [];
    }
  }

  static async addIpAddress(ip: string): Promise<void> {
    const ipList = await IpHandler.getIpList();

    if (!ipList.includes(ip)) {
      try {
        await fs.promises.appendFile(FILE_PATH, `${ip}\n`);
        console.log(`IP ${ip} added to the file.`);
      } catch (error) {
        console.error("Error writing to file:", error);
      }
    }
  }

  static async deleteIpAddress(ip: string): Promise<void> {
    const ipList = (await IpHandler.getIpList()).filter((item) => item !== ip);
    try {
      await fs.promises.writeFile(FILE_PATH, ipList.join("\n"));
    } catch (error) {
      console.error("Error deleting IP from file:", error);
    }
  }
}

export default IpHandler;
