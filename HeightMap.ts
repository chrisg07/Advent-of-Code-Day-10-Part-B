module.exports = class HeightMap {
	openingSymbols = ['(', '{', '[', '<']
	closingSymbols = [')', '}', ']', '>']
	scoreCard = [1, 3, 2, 4]
	corruptedLines = new Array<string>()
	incompleteLines = new Array<Array<string>>()
	illegalCharacters = new Array<string>()
	answer = 0
	
  constructor(lines) {
		for (let [index, entry] of lines.entries()) {
			if (entry) {
				this.parseLine(entry)
			}
		}
		// console.log(this.incompleteLines)
		this.answer = this.calculateScore(this.incompleteLines)
		console.log('answer:', this.answer)
  }

	calculateScore(incompleteLines: Array<Array<string>>): number {
		let scores = incompleteLines.map((line) => {
			console.log(line)
			return line.map(char => {
				const index = this.openingSymbols.indexOf(char)
				return this.scoreCard[index]
			}).reduce((a, b) => (a * 5) + b, 0)
		}).sort((a, b) => a - b)
		console.log(scores)
		return scores[Math.floor(scores.length / 2)]
	}
	parseLine(line) {
		let incompleteChunks = new Array<string>()
		const chars = line.split('')
		for (let char of chars) {
			if (this.isOpeningSymbol(char)) {
				incompleteChunks.unshift(char)
			} else {
				// try to close chunk
				const openChunk = incompleteChunks.shift()
				const openChunkIndex = this.openingSymbols.indexOf(openChunk ? openChunk : '')
				if (this.closingSymbols[openChunkIndex] !== char) {
					// corrupted
					const closingChunkIndex = this.closingSymbols.indexOf(char ? char : '')
					this.illegalCharacters.push(char)
					this.answer += this.scoreCard[closingChunkIndex]
					console.log(`Expected '${this.closingSymbols[openChunkIndex]}' but found '${char}'' instead. Added ${this.scoreCard[openChunkIndex]} score from index ${openChunkIndex}`)
					this.corruptedLines.push(line)
					return 
				}
			}
		}
		this.incompleteLines.push(incompleteChunks)
	}

	isOpeningSymbol(char: string): boolean {
		return this.openingSymbols.indexOf(char) >= 0
	}
}
