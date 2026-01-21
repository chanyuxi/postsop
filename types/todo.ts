export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    timeline: TodoTimeline;
}

export interface TodoTimeline {
    start: Date;
    end: Date;
}
