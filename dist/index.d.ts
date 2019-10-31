export declare class TeamTrees {
    private readonly _rateLimit;
    private readonly _cache;
    private _retryIn;
    private _data;
    constructor(opt?: {
        rateLimit?: boolean;
        cache?: {
            enable?: boolean;
            duration?: number;
        };
    });
    getTotalTrees(formatted?: boolean): Promise<number | string>;
    getMostRecent(): Promise<Array<object>>;
    getMostTrees(): Promise<Array<object>>;
    private result;
    private getBody;
    private loadCache;
    private assert;
}
