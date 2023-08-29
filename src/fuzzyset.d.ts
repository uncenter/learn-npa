// Based on types for https://github.com/washt/fuzzyset.
// Definitions by: Louis Grignon <https://github.com/lgrignon>
//                Narain Sagar <https://github.com/narainsagar>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'fuzzyset' {
	interface FuzzySet {
		get(value: string): Array<[number, string]>;
		get<DEFAULT>(
			value: string,
			defaultValue?: DEFAULT,
			minScore?: number,
		): Array<[number, string]> | DEFAULT;
		add(value: string): false | undefined;
		length(): number;
		isEmpty(): boolean;
		values(): string[];
	}

	function FuzzySet(
		source?: string[],
		useLevenshtein?: boolean,
		gramSizeLower?: number,
		gramSizeUpper?: number,
	): FuzzySet;

	export = FuzzySet;
}
