import { User } from "./User";

export type PageProps<T = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
};
