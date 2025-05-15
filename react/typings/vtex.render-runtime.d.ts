declare module 'vtex.render-runtime' {
    export const useRuntime: () => {
        setQuery: (query: Record<string, string>) => void
    }
} 