import fs from 'fs'

async function readFile() {
        return new Promise((resolve, refect) => fs.readdir('./', (err, files) => {
                if (err) reject(err)
                resolve(files.filter(
                        file =>
                                file.endsWith('.txt') &&
                                file.includes('input_x')
                ))
        }))
}
async function readInput(file) {
        return new Promise((resolve, reject) => fs.readFile(file, (err, data) => {
                if (err) reject(err)
                resolve(data.toString())
        }))
}
//function to receive a sequence x and a gap and aplly the deBrujin algorithm to get all possible sequences
function deBrujin(kmers, gap) {
        let graphNext = {}
        let graphBack = {}
        let result = []
        let possibilities = new Set()
        //create the graph
        // const counter = kmers.reduce((acc, value) => {
        //         if (acc.hasOwnProperty(value)) {
        //                 acc[value]++
        //         } else {
        //                 acc[value] = 1
        //         }
        //         return acc;
        // }, {})


        for (let i = 0; i < kmers.length; i++) {
                let kmer = kmers[i]
                let prefix = kmer.substring(0, kmer.length - gap)
                let suffix = kmer.substring(gap)
                possibilities.add(suffix)
                possibilities.add(prefix)
                if (graphNext[prefix]) {
                        graphNext[prefix].push(suffix)
                } else {
                        graphNext[prefix] = [suffix]
                }
                if (graphBack[suffix]) {
                        graphBack[suffix].push(prefix)
                } else {
                        graphBack[suffix] = [prefix]
                }
        }
        const matrix = Array.from(possibilities.keys())
        console.log({ possibilities, matrix })

        for (let i = Object.keys(graphNext)[0]; graphNext[i];) {
                let suffix = graphNext[i].pop();
                var isEqual = graphNext[i].findIndex((value) => value === i);
                while (isEqual != undefined && isEqual != -1) {
                        graphNext[i].splice(isEqual, 1)
                        result.push(i)
                        isEqual = graphNext[i].findIndex((value) => value === i)
                }
                if (suffix)
                        result.push(i)
                i = suffix;
        }

        console.log({ graphNext, result, graphBack })

        return result.reduce((acc, value, index) => index != 0 ? acc + value.at(-1) : acc, result[0])
}




function main() {
        readFile().then(files => {
                Promise.all(files.map(readInput)).then(inputs => {
                        const arraysOfKmers = inputs.map((value) => value.split(','))
                        const results = arraysOfKmers.map((value, index) => {
                                console.log("_____________________________")
                                return deBrujin(value, 1)
                        })
                        console.log({ results })
                })
        }
        );
}

main();