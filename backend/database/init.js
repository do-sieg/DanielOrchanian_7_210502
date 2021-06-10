import { initPostsTable } from "./posts";
import { initUsersTable } from "./users";

// Initialize all tables
export async function initAllTables() {
    await initUsersTable();
    await initPostsTable();
}
