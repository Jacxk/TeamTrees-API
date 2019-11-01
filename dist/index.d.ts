export declare class TeamTrees {
    private readonly _rateLimit;
    private readonly _cache;
    private _retryIn;
    private _data;
    private readonly _maxTrees;
    private readonly _endDate;
    constructor(opt?: {
        rateLimit?: boolean;
        cache?: {
            enable?: boolean;
            duration?: number;
        };
    });
    getLeft(): Promise<object>;
    getTotalTrees(formatted?: boolean): Promise<string>;
    getMostRecent(): Promise<Array<object>>;
    getMostTrees(): Promise<Array<object>>;
    private result;
    private getBody;
    private loadCache;
    private assert;
}
