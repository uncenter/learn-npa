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

import longWordsRaw from '@/data/long-words.txt?raw';
import medWordsRaw from '@/data/med-words.txt?raw';
import shortWordsRaw from '@/data/short-words.txt?raw';

export const LONG_WORDS = longWordsRaw.split('\n');
export const MEDIUM_WORDS = medWordsRaw.split('\n');
export const SHORT_WORDS = shortWordsRaw.split('\n').filter((word: string) => word.length > 3);

export const WORD_DICTS: Record<string, string[]> = {
	long: LONG_WORDS,
	medium: MEDIUM_WORDS,
	short: SHORT_WORDS,
};
