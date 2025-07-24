import path from "node:path";

export class Intera__Config {
  public appDirectory: string;
  public moduleDirectory: string;
  public apiBaseUrl?: string | undefined;

  constructor(apiClientPath?: string, apiBaseUrl?: string) {
    this.appDirectory = process.cwd();
    this.apiBaseUrl = apiBaseUrl;
    this.moduleDirectory =
      apiClientPath || path.join(__dirname, "../../../", "@intera", "client");
  }
}
