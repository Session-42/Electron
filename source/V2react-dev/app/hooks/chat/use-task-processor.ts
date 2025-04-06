import { useRef, useState } from 'react';

interface TaskProcessor {
    processingTasks: React.RefObject<Set<string>>;
    abortControllers: Map<string, AbortController>;
    addTask: (taskId: string) => AbortController;
    removeTask: (taskId: string) => void;
    cleanupTasks: () => void;
    isProcessing: (taskId: string) => boolean;
}

export function useTaskProcessor<T>(): TaskProcessor {
    const abortControllers = useRef<Map<string, AbortController>>(new Map());
    const processingTasks = useRef(new Set<string>());

    const addTask = (taskId: string) => {
        const controller = new AbortController();
        abortControllers.current.set(taskId, controller);
        processingTasks.current.add(taskId);
        return controller;
    };

    const removeTask = (taskId: string) => {
        processingTasks.current.delete(taskId);
        abortControllers.current.get(taskId)?.abort();
    };

    const cleanupTasks = () => {
        abortControllers.current.forEach((controller) => controller.abort());
        processingTasks.current.clear();
    };

    const isProcessing = (taskId: string) => {
        return processingTasks.current.has(taskId);
    };

    return {
        processingTasks,
        abortControllers: abortControllers.current,
        addTask,
        removeTask,
        cleanupTasks,
        isProcessing,
    };
}
