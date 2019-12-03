/**
 * @class this is a utility class for pathfinding that can be used to find a path between any two parts of a connected network
 */
export class AStarPath {
    /**
     * @constructor this is a utility class for pathfinding that can be used to find a path between any two parts of a connected network
     * @param start the node to start the path from
     * @param end the node to end the path from
     * @param hermeneutic A Hermeneutic Function is a predictive algorithm that should return the minimum possible 'distance' between any two nodes.  Optional - if provided it will shorten the processing time by a great deal
     */
    constructor(start, end, tileValue, hermeneutic) {
        this.tileValue = tileValue;
        /**
         * @function call this to generate a new path.
         */
        this.makePath = (start, end) => {
            let open = [];
            this.closed = [];
            open.push({ current: start, previous: null, pValue: 0, hValue: this.hermeneutic(start, end) });
            while (open.length) {
                let node = open.shift();
                let current = node.current;
                let cValue = this.tileValue(current);
                if (current === end) {
                    this.path = [node.current];
                    while (node.previous) {
                        node = node.previous;
                        this.path.unshift(node.current);
                    }
                    return this.path;
                }
                else {
                    main: for (let i = 0; i < current.outlets.length; i++) {
                        for (let j = 0; j < open.length; j++) {
                            if (current.outlets[i] === open[j].current) {
                                if (node.pValue + cValue < open[j].pValue) {
                                    open[j].pValue = node.pValue + cValue;
                                    open[j].previous = node;
                                }
                                continue main;
                            }
                        }
                        for (let j = 0; j < this.closed.length; j++) {
                            if (current.outlets[i] === this.closed[j].current) {
                                if (node.pValue + cValue < this.closed[j].pValue) {
                                    this.closed[j].pValue = node.pValue + cValue;
                                    this.closed[j].previous = node;
                                }
                                continue main;
                            }
                        }
                        let node2 = { current: current.outlets[i], previous: node, pValue: node.pValue + 1, hValue: this.hermeneutic(current.outlets[i], end) };
                        // for (let j=0;j<open.length;j++){
                        //   if (node2.hValue+node2.pValue < open[j].hValue+open[j].pValue){
                        //     open.splice(j,0,node2);
                        //     continue main;
                        //   }
                        // }
                        open.push(node2);
                    }
                    open.sort((a, b) => {
                        if (a.pValue + a.hValue < b.pValue + b.hValue) {
                            return -1;
                        }
                        else if (a.pValue + a.hValue > b.pValue + b.hValue) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    });
                    this.closed.push(node);
                }
            }
            this.path = null;
            return null;
        };
        this.hermeneutic = hermeneutic || astarBlankHermeneutic;
        tileValue = tileValue || (() => 1);
        this.makePath(start, end);
    }
}
/**
 * @constant astarBlanklHermeneutic a null hermeneutic for when you don't have another option
 */
const astarBlankHermeneutic = (node, end) => {
    return 0;
};
/**
 * @constant astarSpacialHermeneutic used for a 2d grid.  Nodes must have x,y coordinates
 */
export const astarSpacialHermeneutic = (node, end) => {
    return Math.sqrt((node.x - end.x) * (node.x - end.x) + (node.y - end.y) * (node.y - end.y));
};
/**
 * @constant astarGridHermeneutic used for a 2d grid where you don't care about diagonal distance
 */
export const astarGridHermeneutic = (node, end) => {
    return Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
    //return Math.sqrt((node.x-end.x)*(node.x-end.x)+(node.y-end.y)*(node.y-end.y));
};
