class Trie {
    constructor(c) {
        this.fs = require("fs").promises;
        this.path = require("path");
        this.s = false;
        this.g = 1;
    }

    async init(d, g) {
        if (typeof d !== "string") throw new Error("Directory must be a string.");
        try {
            this.dir = this.path.join(process.cwd(), d);
            await this.fs.mkdir(this.dir);
        } catch (e) {
            if (e.code !== "EEXIST") throw new Error("Invalid directory.");
        }
        if (typeof g === "number") this.g = g > 0 ? parseInt(g) : 1;
        this.s = true;
    }

    makePath(s) {
        if (!this.s) throw new Error("Call init() first.");
        if (typeof s !== "string") throw new Error("Path must be a string.");
        let c = 0, t = "", d = "";
        for (const p in s) {
            let ch = s[p] === " " ? "-" : s[p];
            t += ch;
            c++;
            if (c === this.g) {
                if (parseInt(p) !== s.length - 1) d += "-";
                d += t + "/";
                c = 0;
                t = "";
            }
        }
        d += t;
        return d;
    }

    async add(s, r) {
        if (!this.s) throw new Error("Call init() first.");
        if (typeof s !== "string") throw new Error("Path must be a string.");
        const d = r ? s : this.makePath(s);
        const f = this.path.join(this.dir, d);
        await this.fs.mkdir(f, { recursive: true });
        return f;
    }

    async search(s, r) {
        if (!this.s) throw new Error("Call init() first.");
        if (typeof s !== "string") throw new Error("Path must be a string.");
        const d = r ? s : this.makePath(s);
        const f = this.path.join(this.dir, d);
        try {
            const i = await this.fs.readdir(f, { withFileTypes: true });
            return [f, i];
        } catch (e) {
            return e.code === "ENOENT" ? [null, null] : Promise.reject(e);
        }
    }

    async delete(s) {
        if (!this.s) throw new Error("Call init() first.");
        if (typeof s !== "string") throw new Error("Path must be a string.");
        let p = this.dir, c = 0, t = "", d = null;
        for (const l in s) {
            let ch = s[l] === " " ? "-" : s[l];
            t += ch;
            c++;
            if (c === this.g) {
                if (parseInt(l) !== s.length - 1) t = "-" + t;
                p = this.path.join(p, t);
                const e = await this.fs.readdir(p, { withFileTypes: true });
                const subdirs = e.filter(f => f.isDirectory()).length;
                if (subdirs > 1) d = null;
                else if (!d) d = p;
                c = 0;
                t = "";
            }
        }
        if (t && !d) d = this.path.join(p, t);
        if (d) await this.fs.rm(d, { recursive: true });
    }
}

module.exports = { Trie };