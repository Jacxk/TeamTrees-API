// @ts-ignore
import fetch from "node-fetch";

export class TeamTrees {
    private readonly _rateLimit: boolean | undefined;
    private readonly _cache: { enable?: boolean; duration?: number };
    private _retryIn: number;
    private _data: string | null;

    constructor(opt: { rateLimit?: boolean, cache?: { enable?: boolean, duration?: number } } =
                    {rateLimit: true, cache: {enable: false, duration: 1}}) {
        this._cache = opt.cache || {enable: false, duration: 1};
        this._rateLimit = opt.rateLimit;
        this._retryIn = this._cache.duration || Date.now();
        this._data = null;

        if (this._cache && this._cache.enable) this.loadCache();
    }

    public async getTotalTrees(formatted: boolean = false): Promise<number | string> {
        this.assert();

        const body = this._data || await this.getBody();

        if (body == null) throw "There was a error while getting the data";

        const regex: RegExp = /<div id="totalTrees" class="counter" data-count="\d+">/g;
        const total_trees: string = ((body.match(regex) || [])[0].match(/\d+/g) || [])[0];

        if (formatted) return total_trees.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
        else return parseInt(total_trees);
    }

    public async getMostRecent(): Promise<Array<object>> {
        this.assert();

        const body = this._data || await this.getBody();

        if (body == null) throw "There was a error while getting the data";

        const regex: RegExp = /<div class="media pt-3">(.*?)<\/div>/gms;
        const data = (body).match(regex) || [];
        const result: Array<object> = [];

        for (let i = 0; i < data.length - 1; i++) this.result(data, i, result);
        return result;
    }

    public async getMostTrees(): Promise<Array<object>> {
        this.assert();

        const body = await this.getBody();

        if (body == null) throw "There was a error while getting the data";

        const regex: RegExp = /<div class="media pt-3" data-trees-top="(\d+)">(.*?)<\/div>/gms;
        const data = (body).match(regex) || [];
        const result: Array<object> = [];

        for (let i = 0; i < data.length; i++) this.result(data, i, result);
        return result;
    }

    private result(data: Array<any>, i: number, result: Array<object>): void {
        const name = (data[i].match(/<strong.*?>(.*?)<\/strong>/m) || [])[1];
        const trees = (data[i].match(/<span.*?class="(feed-tree-count.*)">(.*) tree.*<\/span>/m) || [])[2];
        const message = (data[i].match(/<span.*?class="((?!feed-datetime|feed-tree-count).)*">(.*?)<\/span>/m) || [])[2];
        const date = (data[i].match(/<span.*?>(.*(\d+:\d+:\d+).*)<\/span>/m) || [])[1];
        const img = (data[i].match(/<img.*?src="(.*?)">/m) || [])[1];
        result.push({name, trees, message, date: new Date(date), img: `https://teamtrees.org/${img}`})
    }

    private getBody(): Promise<string> {
        // @ts-ignore
        return fetch('https://teamtrees.org/').then(res => res.text());
    }

    private async loadCache(): Promise<void> {
        this._data = await this.getBody();
    }

    private assert() {
        if (!this._cache.enable) {
            if (this._rateLimit && this._retryIn > Date.now()) throw "Too many requests!";
            else this._retryIn = Date.now() + (1000 * 30);
        } else if (this._retryIn < Date.now()) this.loadCache();
    }
}
