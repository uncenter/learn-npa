import FuzzySet from 'fuzzyset';

export const NATO_ALPHABET: Record<string, string> = {
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

export function convertToPhoneticWords(word: string) {
	return [...word.toUpperCase()].map((char) => NATO_ALPHABET[char]);
}

export function isCorrect(words: string[], correctWords: string[]) {
	const fuzzy = FuzzySet();
	for (const word of Object.values(NATO_ALPHABET)) fuzzy.add(word);
	return (
		words.length === correctWords.length &&
		words.every(
			(word, i) =>
				word.length > 1 &&
				(fuzzy.get(word)[0][0] >= 0.85 || fuzzy.get(word)[0][1] === correctWords[i]),
		)
	);
}

export function mergeArrays<T>(...arrays: T[][]): T[] {
	return ([] as T[]).concat(...arrays);
}
