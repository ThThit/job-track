import connnectDb from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
    {
        name: "Wish List",
        order: 0,
    },
    { name: "Applied", order: 1 },
    { name: "Interviewing", order: 2 },
    { name: "Offer", order: 3 },
    { name: "Rejected", order: 4 },
];

export async function initializeUserBoard(userId: string) {
    try {
        await connnectDb();

        // check board is alrady exists
        const existingBoard = await Board.findOne({ userId, name: "Job Hunt" });

        if (existingBoard) {
            return existingBoard;
        }

        // crate if not
        const board = await Board.create({
            name: "Job Hunt",
            userId, 
            columnId: []
        });


        // crate defult column
        const columns = await Promise.all(
            DEFAULT_COLUMNS.map((col) =>
                Column.create({
                    name: col.name,
                    order: col.order,
                    boardId: board._id,
                    jobApplications: [],
                })
            )
        );

        // update the board with new column
        board.columns = columns.map((col) => col._id);
        await board.save();

    } catch (err) {
        throw err;
    }
}