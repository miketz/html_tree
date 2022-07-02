// (function (window, document): void { // IIFE
namespace tree {
    "use strict";

    function renderTable(table:HTMLTableElement,
                         colHeaders: string[] | null,
                         datums: any[],
                         idCol: string,
                         idParent: string): void
    {
        // GAURD. no data to render!
        if (datums.length === 0) {
            alert("no data provided to render!!!");
            return;
        }
        // GUARD for <thead> presence.
        if (!table.tHead) {
            alert("no <thead> found!!!");
            return;
        }
        // GUARD for <tbody> presence.
        if (!table.tBodies[0]) {
            alert("no <tbody> found!!!");
            return;
        }
        // const divCanvas = <HTMLDivElement>document.getElementById('divCanvas');

        // Check for explict colHeaders.
        // if null, use object keys in first data record.
        const keys: string[] = Object.keys(datums[0]);
        if (!colHeaders) {
            colHeaders = keys;
        }

        // populate header
        const tr_head = table.tHead.insertRow();
        for (const headTxt of colHeaders) {
            const th = document.createElement("th");
            th.innerHTML = headTxt;
            tr_head.appendChild(th);
        }

        const tbody: HTMLTableSectionElement = table.tBodies[0];

        // add an "isDrawn" property to all nodes.
        const len = datums.length;
        for (let i = 0; i < len; i += 1) {
            let node = datums[i];
            node.isDrawn = false;
        }

        const topObjs = datums.filter(function (x) {
            return x[idParent] === null;
        });

        renderTable_r(0, colHeaders, topObjs, datums, idCol, idParent, tbody);
    }

    function sortFn (a: any, b: any) {
        let aDisplayOrder: number;
        let bDisplayOrder: number;
        if (a.DisplayOrder && a.DisplayOrder !== null) {
            aDisplayOrder = a.DisplayOrder;
        } else {
            aDisplayOrder = 9999;
        }
        if (b.DisplayOrder && b.DisplayOrder !== null) {
            bDisplayOrder = b.DisplayOrder;
        } else {
            bDisplayOrder = 9999;
        }
        return aDisplayOrder - bDisplayOrder; //asc
        // return bDisplayOrder - aDisplayOrder; //desc
    }

    function renderTable_r(level: number, colHeaders: string[], tops: any[], datums: any[], idCol: string, idParent: string, tbody: HTMLTableSectionElement): void {
        tops.sort(sortFn);
        const topCnt = tops.length;
        for (let r = 0; r < topCnt; r += 1) {
            const tr = tbody.insertRow();
            const firstTD: HTMLElement = tr.insertCell();

            const obj = tops[r];


            // indent based on current level.
            for (let l = 0; l < level; l += 1) {
                const newIndent = document.createElement("div");
                newIndent.className = "divNodeConnector";
                let char: string;
                let isNodeNext = level-l === 1;

                // l+1 here because the "id" node is drawn 1 level to the right.
                let hasAnsThisLevNotDrawn: boolean = hasAncestorThisLevelNotDrawnYet(datums, obj, l+1, level, idCol, idParent);
                let hasSibNotDrawn = hasSiblingNotDrawnYet(tops, obj, idCol);
                // box drawing unicode chars:
                // https://www.fileformat.info/info/unicode/block/box_drawing/utf8test.htm
                if (isNodeNext) {
                    if (hasSibNotDrawn) {
                        char = '&#x251C;'; // an "|-" shape
                    } else {
                        char = '&#x2517;'; // an "L" shape
                    }
                } else if (hasAnsThisLevNotDrawn) {
                    char = '|';
                } else {
                    char = ' ';
                }
                newIndent.innerHTML = char;

                firstTD.appendChild(newIndent); // divCanvas.appendChild(newIndent);
            }

            // create element for PK
            const pkDiv = document.createElement("div");
            pkDiv.className = "divNode";
            pkDiv.innerHTML = obj[idCol].toString();
            firstTD.appendChild(pkDiv);

            // cols. the regular cols, exluding ID pk
            // Check for explict colHeaders.
            // if null, use object keys in first data record.
            const lenC: number = colHeaders.length;
            for (let c = 1; c < lenC; c += 1) {  // start at 1 to skip first PK col.
                const td: HTMLElement = tr.insertCell();
                const key: string = colHeaders[c];
                const val: any = obj[key]; //vals[c]; //record[fieldName];
                const newText = document.createTextNode(val);
                td.appendChild(newText);
            }
            obj.isDrawn = true;

            const children = getChildNodes(obj, datums, idCol, idParent);
            // recur!!!!
            renderTable_r(level+1, colHeaders, children, datums, idCol, idParent, tbody);
        }
    }

    function hasAncestorThisLevelNotDrawnYet(datums: any[], currNode: any, levelToCheck: number, currNodeLevel: number, idCol:string, idParent: string): boolean {
        // walk up parent chain until reaching target level
        let walkUp = currNodeLevel - levelToCheck;
        for (let i = 0; i < walkUp; i += 1) {
            currNode = getParentNode(currNode, datums, idCol, idParent);
        }

        // look for siblings of this parent that are *not* drawn yet
        const siblings = getSiblingNodes(currNode, datums, idParent);
        return hasSiblingNotDrawnYet(siblings, currNode, idCol);
    }

    function hasSiblingNotDrawnYet(currTops: any[], currNode: any, idCol: string): boolean {
        let hasSibNotDrawn = false;
        const len = currTops.length;
        for (let i = 0; i < len; i += 1) {
            let node = currTops[i];
            let isSibling = node[idCol] !== currNode[idCol];
            if (isSibling && !node.isDrawn) {
                hasSibNotDrawn = true;
                break;
            }
        }
        return hasSibNotDrawn;
    }

    function getParentNode(obj: any, datums: any[], idCol:string, idParent: string): any {
        const parentIdVal = obj[idParent];

        const len = datums.length;
        for (let i = 0; i < len; i += 1) {
            let node = datums[i];
            let nodeIdVal = node[idCol];
            if (nodeIdVal === parentIdVal) {
                return node;    // early exit. can only have 1 parent.
            }
        }
        return null; // not found
    }

    function getChildNodes(obj: any, datums: any[], idCol:string, idParent: string): any[] {
        const children = datums.filter(function (x) {
            return x[idParent] === obj[idCol];
        });
        return children;
    }

    function getSiblingNodes(obj: any, datums: any[], idParent: string): any[] {
        const parentIdVal = obj[idParent];
        const siblings = datums.filter(function (x) {
            let xIdParentVal = x[idParent];
            return xIdParentVal === parentIdVal;
        });
        return siblings;
    }


    // use onload to wait for page to fully load before executing javascript
    window.onload = function(): void {
        const tree: HTMLTableElement = <HTMLTableElement>document.getElementById("idTree");
        // GUARD
        if (!tree) {
            alert('tree table not found!!!')
            return;
        }
        // pretend we got this data from a RESTful service.
        const emps: object[] = [
            { empId: 1, bossId: 3, name: "Tom", age: 39},
            { empId: 2, bossId: 3, name: "Joe", age: 45},
            { empId: 3, bossId: null, name: "John", age: 46},
            { empId: 4, bossId: 3, name: "Sue", age: 20},
            { empId: 5, bossId: 2, name: "Ken", age: 25},

            { empId: 6, bossId: 2, name: "Chris", age: 30},
            { empId: 9,  bossId: 6, name: "6-sub1", age: 30},
            { empId: 10, bossId: 6, name: "6-sub2", age: 30},
            { empId: 13, bossId: 10, name: "10-sub1", age: 30, Divcanvas: 3},
            { empId: 14, bossId: 10, name: "10-sub2", age: 30, DisplayOrder: null},
            { empId: 15, bossId: 10, name: "10-sub3", age: 30, DisplayOrder: 1},

            { empId: 11, bossId: 6, name: "6-sub3", age: 30},
            { empId: 12, bossId: 6, name: "6-sub4", age: 30},

            { empId: 7, bossId: null, name: "Captain America", age: 127, DisplayOrder: 1},
            { empId: 8, bossId: 7, name: "side kick", age: 18},
            { empId: 16, bossId: 8, name: "npc", age: 18},
            { empId: 17, bossId: 16, name: "npc", age: 18},
            { empId: 18, bossId: 17, name: "npc", age: 18},
            { empId: 19, bossId: 18, name: "npc", age: 18},
        ];
        // const colNames = ["id", "FullName", "Age", "BossId"];
        renderTable(tree, null, emps, "empId", "bossId");
    };


}
// }(window, document));
