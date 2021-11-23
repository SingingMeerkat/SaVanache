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

export function getColor(arrSource, arrChromosome, colorRange) {
    const maxX = getMaxX(arrChromosome) 
    let sourceStart = []
    let sourceStop = []
    let sourceStartStop = []
    let normValueStart = []
    let normValueStop = []
    let arrColorById = []
    let getClosestStart = []
    let getClosestStop = []
    let resultColorStart = []
    let resultColorStop = []
    arrSource.map(element => {
        if(element.sourceName === this.name) {
            sourceStart.push(element.sourceStart)
            sourceStop.push(element.sourceStop)
            sourceStartStop = sourceStart.map((item, i) => Object.assign({}, { sourceName: element.sourceName,sourceStart : item, sourceStop : sourceStop[i]} ));
        }
        
    })

    sourceStart.map(element => normValueStart.push(element/maxX))
    sourceStop.map(element => normValueStop.push(element/maxX))
    let mergeSourceStartAndStop = normValueStart.map((item, i) => Object.assign({}, { sourceStart : item, sourceStop : normValueStop[i]} ));

    colorRange.map((_, i) => arrColorById.push(i+1))
    let arrColorNormalized = arrColorById.map(normalize(1, colorRange.length))
    let mergeColorNorm = this.colorRange.map((item, i) => Object.assign({}, {color: item, norm: arrColorNormalized[i]} ));

    mergeSourceStartAndStop.map(element => {
        getClosestStart.push(closestPosition(arrColorNormalized, element.sourceStart))
        getClosestStop.push(closestPosition(arrColorNormalized, element.sourceStop))
    })
    getClosestStart.map(item => {
        resultColorStart.push(matchingValue(mergeColorNorm,item))
    })
    getClosestStop.map(item => {
        resultColorStop.push(matchingValue(mergeColorNorm,item))
    })
    let colorArrStartStop = resultColorStart.map((item, i) => Object.assign({}, {colorStart: item.color, colorStop: resultColorStop[i].color} ));
    let getColorBySourceName = sourceStartStop.map((item, i) => Object.assign({}, {sourceName: item.sourceName, sourceStart: item.sourceStart, sourceStop: item.sourceStop, colorStart: colorArrStartStop[i].colorStart, colorStop: colorArrStartStop[i].colorStop} ));

    return getColorBySourceName
      
}

