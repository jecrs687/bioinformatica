import {writeFileSync, readFileSync} from 'fs';

const inputPath = 'input.txt'
const dna = readFileSync(inputPath, 'utf8',()=>{})
const rnaM = dna.split("").map((value)=>{
        switch(value){
                case "C":
                        return "G";
                case "G":
                        return "C";
                case "A":
                        return "U";
                case "T":
                        return "A";
        }

}).join().replace(/[,]/g, '');
writeFileSync('output.txt', rnaM, 'utf8', ()=>{})
console.log("DNA input: ",dna)
console.log("RNA output:",rnaM)