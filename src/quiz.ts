import FuzzySet from 'fuzzyset';
import { NATO_ALPHABET } from './constants';

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

export function countCharOccurrences(word: string, charMap: Record<string, number>) {
	return [...word].reduce((count, char) => count + (charMap[char.toUpperCase()] || 0), 0);
}
