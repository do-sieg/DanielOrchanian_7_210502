import { initUsersTable } from "./users";

export async function initAllTables() {
    await initUsersTable();
}
