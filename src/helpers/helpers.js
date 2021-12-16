import * as d3 from "d3";

export function getLength(arr) {
    return arr.length;
}

export function getMaxX(arr) {
    return d3.max(arr, (d) => d.position);
}

export function getMaxY(arr) {
    return d3.max(arr, (d) => d.varIndex);
}

export function getReverseArr(arr) {
    return arr.reverse();
}

export function normalize(min, max) {
    const delta = max - min;
    return val => ( (val < min? min: (val > max? max : val)) - min ) / delta;
}

export function closestPosition(array, goal) {
    return array.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
}

export function matchingValue(array1, val){
    return array1.find(element => {
        if(val === element.norm) {
            return element.color
        }
    })
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

