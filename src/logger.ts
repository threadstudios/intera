import { Service } from "typedi";
import pino from "pino";

@Service()
export class Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });
  }

  public info(
    message: string,
    data?: Record<string | number | symbol, unknown>
  ) {
    return this.logger.info(data ?? undefined, message);
  }

  public error(
    message: string,
    data?: Record<string | number | symbol, unknown>
  ) {
    return this.logger.error(data ?? undefined, message);
  }

  public warn(
    message: string,
    data?: Record<string | number | symbol, unknown>
  ) {
    return this.logger.warn(data ?? undefined, message);
  }

  public debug(
    message: string,
    data?: Record<string | number | symbol, unknown>
  ) {
    return this.logger.debug(data ?? undefined, message);
  }
}
