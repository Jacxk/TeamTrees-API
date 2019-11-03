// @ts-ignore
import fetch from "node-fetch";

export class TeamTrees {
    private readonly _rateLimit: boolean | undefined;
    private readonly _cache: { enable?: boolean; duration?: number };
    private _retryIn: number;
    private _data: Promise<string>;
    private readonly _maxTrees: number;
    private readonly _endDate: number;

    constructor(opt: { rateLimit?: boolean, cache?: { enable?: boolean, duration?: number } } =
                    {rateLimit: false, cache: {enable: true, duration: 5}}) {
        this._cache = opt.cache || {enable: false, duration: 5};
        this._rateLimit = opt.rateLimit;
        this._retryIn = Date.now() + ((this._cache.duration || 5) * 60 * 1000);
        this._data = this.getBody();
        this._maxTrees = 20000000;
        this._endDate = new Date(2020, 0, 1).getTime();
    }

    public async getLeft(): Promise<object> {
        await this.assert();

        const totalTrees = parseInt(await this.getTotalTrees());
        const fixed = String(this._maxTrees - totalTrees);

        return {
            daysLeft: parseInt(((this._endDate - Date.now()) / (1000 * 60 * 60 * 24)).toFixed()),
            treesLeft: {
                amount: {
                    fixed: fixed.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
                    value: this._maxTrees - totalTrees
                },
                percent: ((totalTrees / this._maxTrees) * 100).toFixed(2)
            }
        };
    }

    public async getTotalTrees(formatted?: boolean): Promise<string> {
        await this.assert();

        const body = await this._data;
        if (body == null) throw "There was a error while getting the data";

        const regex: RegExp = /<div id="totalTrees" class="counter" data-count="\d+">/g;
        const total_trees: string = ((body.match(regex) || [])[0].match(/\d+/g) || [])[0];

        if (formatted) return total_trees.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        else return total_trees;
    }

    public async getMostRecent(): Promise<Array<object>> {
        await this.assert();

        const body = await this._data;
        if (body == null) throw "There was a error while getting the data";

        const regex: RegExp = /<div class="media pt-3">(.*?)<\/div>/gms;
        const data = (body).match(regex) || [];
        const result: Array<object> = [];

        for (let i = 0; i < data.length - 1; i++) this.result(data, i, result);
        return result;
    }

    public async getMostTrees(): Promise<Array<object>> {
        await this.assert();

        const body = await this._data;
        if (body == null) throw "There was a error while getting the data";

        const regex: RegExp = /<div class="media pt-3" data-trees-top="(\d+)">(.*?)<\/div>/gms;
        const data = (body).match(regex) || [];
        const result: Array<object> = [];

        for (let i = 0; i < data.length; i++) this.result(data, i, result, true);
        return result;
    }

    private result(data: Array<any>, i: number, result: Array<object>, top?: boolean): void {
        const name = (data[i].match(/<strong.*?>(.*?)<\/strong>/m) || [])[1];
        const trees = (data[i].match(/<span.*?class="(feed-tree-count.*)">(.*) tree.*<\/span>/m) || [])[2];
        const message = (data[i].match(/<span.*?class="((?!feed-datetime|feed-tree-count).)*">(.*?)<\/span>/m) || [])[2];
        const date = (data[i].match(/<span.*?>(.*(\d+:\d+:\d+).*)<\/span>/m) || [])[1];
        const img = (data[i].match(/<img.*?src="(.*?)">/m) || [])[1];
        const val = {name, trees, message, date: new Date(date), img: `https://teamtrees.org/${img}`};
        if (top) Object.assign(val, {rank: i + 1});
        result.push(val)
    }

    private getBody(): Promise<string> {
        // @ts-ignore
        return fetch('https://teamtrees.org/').then(res => res.text());
    }

    private async loadCache(): Promise<void> {
        this._data = this.getBody();
        this._retryIn = Date.now() + ((this._cache.duration || 5) * 60 * 1000);
    }

    private async assert() {
        if (!this._cache.enable) {
            if (this._rateLimit && this._retryIn > Date.now()) throw "Too many requests!";
            else this._retryIn = Date.now() + (1000 * 30);
        } else if (this._cache.enable && Date.now() > this._retryIn) this.loadCache();
    }
}
