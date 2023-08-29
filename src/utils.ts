import FuzzySet from 'fuzzyset';

export const natoAlphabet: Record<string, string> = {
	A: 'Alpha',
	B: 'Bravo',
	C: 'Charlie',
	D: 'Delta',
	E: 'Echo',
	F: 'Foxtrot',
	G: 'Golf',
	H: 'Hotel',
	I: 'India',
	J: 'Juliett',
	K: 'Kilo',
	L: 'Lima',
	M: 'Mike',
	N: 'November',
	O: 'Oscar',
	P: 'Papa',
	Q: 'Quebec',
	R: 'Romeo',
	S: 'Sierra',
	T: 'Tango',
	U: 'Uniform',
	V: 'Victor',
	W: 'Whiskey',
	X: 'X-ray',
	Y: 'Yankee',
	Z: 'Zulu',
};

export function phoneticWords(word: string) {
	const phoneticWords = [];
	for (let i = 0; i < word.length; i++) {
		phoneticWords.push(natoAlphabet[word[i].toUpperCase()]);
	}
	return phoneticWords;
}

export function isCorrect(inputWords: string[], correctWords: string[]) {
	const fuzzy = FuzzySet();
	for (let word of Object.values(natoAlphabet)) {
		fuzzy.add(word);
	}
	if (inputWords.length !== correctWords.length || inputWords.every((word) => word.length === 1)) {
		return false;
	}
	for (let i = 0; i < inputWords.length; i++) {
		if (inputWords[i].length === 1) {
			return false;
		}
		const fuzzyMatch = fuzzy.get(inputWords[i])[0];
		if (fuzzyMatch[0] < 0.85 && fuzzyMatch[1] !== correctWords[i]) {
			return false;
		}
	}
	return true;
}

export function mergeArrays(...arrays: any[]) {
	let merged: any[] = [];
	for (let array of arrays) {
		merged = merged.concat(array);
	}
	return merged;
}
