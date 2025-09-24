export type DbUser = { id: string; username: string; password: string };

export interface AuthRepo {
  createUser(
    username: string,
    hashed: string
  ): Promise<{ id: string; username: string }>;
  getUser(username: string): Promise<DbUser | undefined>;
  getUser(
    username: string,
    column: "id" | "username"
  ): Promise<DbUser | undefined>;
}
