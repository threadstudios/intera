import { Service } from "typedi";

export function Module(metadata: {
  providers: Function[];
  controllers: Function[];
  modules: Function[];
}) {
  return Service();
}
