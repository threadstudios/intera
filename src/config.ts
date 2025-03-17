import path from "node:path";

export class Intera__Config {
  public appDirectory: string;
  public moduleDirectory: string;

  constructor(apiClientPath?: string) {
    this.appDirectory = process.cwd();
    this.moduleDirectory = apiClientPath || path.join(__dirname, "../../");
  }
}
