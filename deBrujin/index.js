import fs, { write } from 'fs'

function readFile() {
        const files = fs.readdirSync('./', 'utf8')
        return files.filter(
                file =>
                        file.endsWith('.txt') &&
                        file.includes('input')
        )

}
function readInput(file) {
        return fs.readFileSync(file, 'utf8').toString()
}
function writeOutput(text, fileName) {
        return fs.writeFileSync(fileName, text, 'utf8')
}
class Kmer {
        constructor(kmer, index, gap) {
                this.kmer = kmer
                this.prefix = kmer.slice(0, kmer.length - gap)
                this.suffix = kmer.slice(gap)
                this.next = []
                this.back = []
                this.equal = []
                this.index = index
                this.initial = 0
                this.final = 0
                this.used = 0
                this.isLoop = this.prefix === this.suffix
        }
        getNeighbors(kmers) {
                kmers.forEach(({ prefix, suffix, index }) => {
                        if (index === this.index) return;
                        if (this.prefix === suffix && this.suffix === prefix) {
                                this.equal.push(index)
                        } else {
                                if (this.prefix === suffix) {
                                        this.next.push(index)
                                }
                                if (this.suffix === prefix) {
                                        this.back.push(index)
                                }
                        }
                })
                this.back = this.back.sort(({ isLoop }) => isLoop ? 1 : -1)
                this.next = this.next.sort(({ isLoop }) => isLoop ? 1 : -1)
                return !this.back.length ? this.initial = 1 : !this.next.length ? this.final = 1 : 0
        }
        getNext() {
                return this.next.shift()
        }
        getEqual() {
                return this.equal.shift()
        }
}

function deBrujin(kmers, gap) {
        const edges = []
        const nodes = []
        for (let [index, value] of kmers.entries()) {
                if (value) {
                        const node = new Kmer(value, index, gap)
                        nodes.push(node)
                }
        }
        nodes.forEach(kmer => kmer.getNeighbors(nodes) ? edges.push(kmer) : 0)
        const [initial, final] = edges.sort(({ final }) => final - 1)
        const solution = []
        let current = initial
        while (current) {
                solution.push(current.kmer)
                current.used = 1
                if (current.equal.length) {
                        current = nodes[current.getEqual()]
                } else if (current.next.length) {
                        current = nodes[current.getNext()]
                } else {
                        current = null
                }
        }
        const result = solution
                .reverse()
                .map(
                        (value, index) =>
                                index === 0 ?
                                        value :
                                        value.slice(-1)
                )
                .join('')
        console.log({ solution: solution.length, kmers: nodes.length, last: solution[solution.length - 1] === final.kmer })
        return result
}




function main() {
        const files = readFile().reverse()
        const inputs = files.map(readInput)
        const arraysOfKmers = inputs.map((value) => value.split(','))
        const results = arraysOfKmers.map((value, index) => {
                console.log("\n_____________________________\n", "file:",
                        files[index], "\n_____________________________\n")

                console.time(`${files[index]} - Tempo de execução`)
                const result = deBrujin(value, 1)
                console.timeEnd(`${files[index]} - Tempo de execução`)
                console.log({ result })
                writeOutput(result, `output${index + 1}.txt`)
                return result

        })
        console.log({ results })
}

main();