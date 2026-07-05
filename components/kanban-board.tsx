"use client";

import { Board, Column } from "@/lib/models/models.types";
import { Award, Calendar, CheckCircle2, Mic, XCircle, MoreHorizontal, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";

interface kanbanBoardProps {
    board: Board;
    userId: string;
}

// map colums to color and
interface ColConfig {
    color: string;
    icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<ColConfig> = [
    {
        color: "bg-cyan-500",
        icon: <Calendar className="h-4 w-4" />,
    },
    {
        color: "bg-purple-500",
        icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
        color: "bg-green-500",
        icon: <Mic className="h-4 w-4" />,
    },
    {
        color: "bg-yellow-500",
        icon: <Award className="h-4 w-4" />,
    },
    {
        color: "bg-red-500",
        icon: <XCircle className="h-4 w-4" />,
    },
];

function DroppableColumn({
    column, config, boardId
}: {
    column: Column; config: ColConfig; boardId: string;
}) {
    return (
        <Card className="w-full md:min-w-75 md:w-75 flex shrink-0 shadow-md p-0 rounded-b-none">
            <CardHeader className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-white text-base font-semibold">{column.name}
                        </CardTitle>
                    </div>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20">
                                <MoreVertical className="w-4 h-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className={`space-y-2 pt-4 bg-gray-50 min-h-[400px] rounded-b-lg}`}>

                <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
            </CardContent>
        </Card>
    );
}

export default function KanbanBoard({ board, userId }: kanbanBoardProps) {
    const columns = board.columns;
    return (
        <>
            <div className="overflow-hidden">
                <div className="mb-2 flex flex-col md:flex-row gap-2 overflow-x-auto pb-2 scrollbar-hidden">
                    {columns.map((col, key) => {
                        const config = COLUMN_CONFIG[key] || {
                            color: "bg-gray-500",
                            icon: <Calendar className="h-4 w-4" />
                        };
                        return (
                            <DroppableColumn key={col._id} column={col} config={config} boardId={board._id} />
                        );
                    })}
                </div>
            </div>
        </>
    );
}