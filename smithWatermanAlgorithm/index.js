import {readFileSync, writeFileSync} from 'fs'
const MATCH = 3
const MISMATCH = -1 
const GAP = -2

const input = readFileSync('input.txt', 'utf8')
const onlyValues = input.split('=')[1]
const [vertical, horizontal] = onlyValues.split(',').map(str => str.replace(/'/g, '').trim())

// do smith-waterman algorithm to find the best alignment
function smithWaterman(vertical, horizontal) {
  const verticalLength = vertical.length
  const horizontalLength = horizontal.length
  const matrix = new Array(verticalLength + 1).fill(0).map(() => new Array(horizontalLength + 1).fill(0))
  for (let i = 1; i <= verticalLength; i++) {
    matrix[i][0] = matrix[i - 1][0] + GAP
  }
  for (let j = 1; j <= horizontalLength; j++) {
    matrix[0][j] = matrix[0][j - 1] + GAP
  }
  for (let i = 1; i <= verticalLength; i++) {
    for (let j = 1; j <= horizontalLength; j++) {
      const match = matrix[i - 1][j - 1] + (vertical[i - 1] === horizontal[j - 1] ? MATCH : MISMATCH)
      const gap = matrix[i - 1][j] + GAP
      const gap2 = matrix[i][j - 1] + GAP
      matrix[i][j] = Math.max(match, gap, gap2)
    }
  }
  return [matrix[verticalLength][horizontalLength], matrix]
}

// do the backtracking to find the best alignment and print the sequences with gaps as - and print the alignment 
function backtrack( vertical, horizontal) {
  let verticalLength = vertical.length
  let horizontalLength = horizontal.length
  let [score, backtrackMatrix] = smithWaterman(vertical, horizontal)
  let [verticalAlignment, horizontalAlignment] = ['', '']
  let i = verticalLength
  let j = horizontalLength
  while (i > 0 && j > 0) {
    const current = backtrackMatrix[i][j]
    const diagonal = backtrackMatrix[i - 1][j - 1]
    const up = backtrackMatrix[i - 1][j]
    const left = backtrackMatrix[i][j - 1]
    if (current === diagonal + (vertical[i - 1] === horizontal[j - 1] ? MATCH : MISMATCH)) {
      verticalAlignment = vertical[i - 1] + verticalAlignment
      horizontalAlignment = horizontal[j - 1] + horizontalAlignment
      i--
      j--
    } else if (current === up + GAP) {
      verticalAlignment = '-' + verticalAlignment
      horizontalAlignment = horizontal[j - 1] + horizontalAlignment
      j--
    } else if (current === left + GAP) {
      verticalAlignment = vertical[i - 1] + verticalAlignment
      horizontalAlignment = '-' + horizontalAlignment
      i--
    }
  }
  while (i > 0) {
    verticalAlignment = vertical[i - 1] + verticalAlignment
    horizontalAlignment = '-' + horizontalAlignment
    i--
  }
  while (j > 0) {
    verticalAlignment = '-' + verticalAlignment
    horizontalAlignment = horizontal[j - 1] + horizontalAlignment
    j--
  }
  return [score, verticalAlignment, horizontalAlignment]
}

//backtracking of the best alignment and print the solution to the output file
function backtracking(matrix, vertical, horizontal) {
  const verticalLength = vertical.length
  const horizontalLength = horizontal.length
  let i = verticalLength
  let j = horizontalLength
  let solution = ''
  while (i > 0 && j > 0) {
    if (matrix[i][j] === matrix[i - 1][j - 1] + (vertical[i - 1] === horizontal[j - 1] ? MATCH : MISMATCH)) {
      solution += vertical[i - 1]
      i--
      j--
    } else if (matrix[i][j] === matrix[i - 1][j] + GAP) {
      solution += '-'
      i--
    } else {
      solution += horizontal[j - 1]
      j--
    }
  }
  while (i > 0) {
    solution += vertical[i - 1]
    i--
  }
  while (j > 0) {
    solution += horizontal[j - 1]
    j--
  }
  return solution.split('').reverse().join('')
}

const [_, matrix] = smithWaterman(vertical, horizontal)
const solution = backtracking(matrix, vertical, horizontal)
const [score, verticalAlignment, horizontalAlignment] = backtrack(vertical, horizontal)

console.log(`alignment: ${solution}`)
console.log(`l1: ${verticalAlignment}`)
console.log(`l2: ${horizontalAlignment}`)
console.log(`Score: ${score}`)
console.log(`Gap: ${GAP}`)
console.log(`MATCH: ${MATCH}`)
console.log(`MISMATCH: ${MISMATCH}`)
const values = {solution, verticalAlignment, horizontalAlignment, score, GAP, MATCH, MISMATCH}


writeFileSync('output.txt', `l1: ${verticalAlignment} \nl2: ${horizontalAlignment} \nScore: ${score} \nGap: ${GAP} \nMATCH: ${MATCH} \nMISMATCH: ${MISMATCH} \nalignment: ${solution}`)
