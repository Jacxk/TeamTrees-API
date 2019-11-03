"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const node_fetch_1 = __importDefault(require("node-fetch"));
class TeamTrees {
    constructor(opt = { rateLimit: false, cache: { enable: true, duration: 5 } }) {
        this._cache = opt.cache || { enable: false, duration: 5 };
        this._rateLimit = opt.rateLimit;
        this._retryIn = Date.now() + ((this._cache.duration || 5) * 60 * 1000);
        this._data = this.getBody();
        this._maxTrees = 20000000;
        this._endDate = new Date(2020, 0, 1).getTime();
    }
    getLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assert();
            const totalTrees = parseInt(yield this.getTotalTrees());
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
        });
    }
    getTotalTrees(formatted) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assert();
            const body = yield this._data;
            if (body == null)
                throw "There was a error while getting the data";
            const regex = /<div id="totalTrees" class="counter" data-count="\d+">/g;
            const total_trees = ((body.match(regex) || [])[0].match(/\d+/g) || [])[0];
            if (formatted)
                return total_trees.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
            else
                return total_trees;
        });
    }
    getMostRecent() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assert();
            const body = yield this._data;
            if (body == null)
                throw "There was a error while getting the data";
            const regex = /<div class="media pt-3">(.*?)<\/div>/gms;
            const data = (body).match(regex) || [];
            const result = [];
            for (let i = 0; i < data.length - 1; i++)
                this.result(data, i, result);
            return result;
        });
    }
    getMostTrees() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assert();
            const body = yield this._data;
            if (body == null)
                throw "There was a error while getting the data";
            const regex = /<div class="media pt-3" data-trees-top="(\d+)">(.*?)<\/div>/gms;
            const data = (body).match(regex) || [];
            const result = [];
            for (let i = 0; i < data.length; i++)
                this.result(data, i, result, true);
            return result;
        });
    }
    result(data, i, result, top) {
        const name = (data[i].match(/<strong.*?>(.*?)<\/strong>/m) || [])[1];
        const trees = (data[i].match(/<span.*?class="(feed-tree-count.*)">(.*) tree.*<\/span>/m) || [])[2];
        const message = (data[i].match(/<span.*?class="((?!feed-datetime|feed-tree-count).)*">(.*?)<\/span>/m) || [])[2];
        const date = (data[i].match(/<span.*?>(.*(\d+:\d+:\d+).*)<\/span>/m) || [])[1];
        const img = (data[i].match(/<img.*?src="(.*?)">/m) || [])[1];
        const val = { name, trees, message, date: new Date(date), img: `https://teamtrees.org/${img}` };
        if (top)
            Object.assign(val, { rank: i + 1 });
        result.push(val);
    }
    getBody() {
        // @ts-ignore
        return node_fetch_1.default('https://teamtrees.org/').then(res => res.text());
    }
    loadCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this._data = this.getBody();
            this._retryIn = Date.now() + ((this._cache.duration || 5) * 60 * 1000);
        });
    }
    assert() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._cache.enable) {
                if (this._rateLimit && this._retryIn > Date.now())
                    throw "Too many requests!";
                else
                    this._retryIn = Date.now() + (1000 * 30);
            }
            else if (this._cache.enable && Date.now() > this._retryIn)
                this.loadCache();
        });
    }
}
exports.TeamTrees = TeamTrees;
