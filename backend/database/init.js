import { initPostsTable } from "./posts";
import { initUsersTable } from "./users";

export async function initAllTables() {
    await initUsersTable();
    await initPostsTable();
}
