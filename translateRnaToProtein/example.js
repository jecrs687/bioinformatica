import fs from 'fs'

const chunk = (value, size) => {
        const result = []
        for (let i = 0; i < value.length; i += size) {
                result.push(value.slice(i, i + size))
        }
        return result
}

var start_codon = ["AUG"]
var stop_codon = ["UAA","UAG","UGA"]

var geneticCode = {
    'UUU':'F', 'UUC':'F', 'UUA':'L', 'UUG':'L', 
    'UCU':'S', 'UCC':'S', 'UCA':'L', 'UCG':'L', 
    'UAU':'Y', 'UAC':'Y', 'UAA':'Ocre', 'UAG':'Âmbar', 
    'UGU':'C', 'UGC':'C', 'UGA':'Opala', 'UGG':'W', 
    'CUU':'L', 'CUC':'L', 'CUA':'L', 'CUG':'L',
    'CCU':'P', 'CCC':'P', 'CCA':'P', 'CCG':'P',
    'CAU':'H', 'CAC':'H', 'CAA':'Q', 'CAG':'Q',
    'CGU':'R', 'CGC':'R', 'CGA':'R', 'CGG':'R',
    'AUU':'I', 'AUC':'I', 'AUA':'I', 'AUG':'M',
    'ACU':'T', 'ACC':'T', 'ACA':'T', 'ACG':'T',
    'AAU':'N', 'AAC':'N', 'AAA':'K', 'AAG':'K',
    'AGU':'S', 'AGC':'S', 'AGA':'R', 'AGG':'R',
    'GUU':'V', 'GUC':'V', 'GUA':'V', 'GUG':'V',
    'GCU':'A', 'GCC':'A', 'GCA':'A', 'GCG':'A',
    'GAU':'D', 'GAC':'D', 'GAA':'E', 'GAG':'E',
    'GGU':'G', 'GGC':'G', 'GGA':'G', 'GGG':'G'
}
const rnaM = fs.readFileSync("input.txt", "utf8")
const rnaMSplitted = rnaM.split(".").length > 1 ? rnaM.split(".") : chunk(rnaM, 3)
var start = 0
var stop = 0
var protein = rnaMSplitted.map(rna=> {
        if(start_codon.includes(rna)){
                start = 1
        }
        if(start === 1 && stop === 0)
        {
                return geneticCode[rna]
        }
        if(stop_codon.includes(rna) && stop == 0){
                stop=1
                console.log("Stop codon found")
        }
}).filter(Boolean).join("")
fs.writeFileSync('output.txt', protein)

const proteinOfFile = fs.readFileSync("output.txt", "utf8")
console.log(proteinOfFile)
