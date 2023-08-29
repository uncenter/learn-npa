/* eslint-disable solid/reactivity */
import { createSignal, createEffect, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { makePersisted } from '@solid-primitives/storage';

import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
	Toast,
	ToastContent,
	ToastDescription,
	ToastList,
	ToastProgress,
	ToastRegion,
	ToastTitle,
} from '@/components/ui/toast';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetFooter,
	SheetTrigger,
} from '@/components/ui/sheet';
import { TextField, TextFieldInput } from '@/components/ui/textfield';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { As, toaster } from '@kobalte/core';

import longWordsRaw from '../data/long-words.txt?raw';
import medWordsRaw from '../data/med-words.txt?raw';
import shortWordsRaw from '../data/short-words.txt?raw';

import {
	NATO_ALPHABET,
	convertToPhoneticWords,
	isCorrect,
	mergeArrays,
	countCharOccurrences,
} from '../utils';

const wordListValues: Record<string, string[]> = {
	long: longWordsRaw.split('\n'),
	medium: medWordsRaw.split('\n'),
	short: shortWordsRaw.split('\n').filter((word: string) => word.length > 3),
};

const AnswerCard = (props: {
	correct: boolean;
	word: string;
	input?: string;
	answer: string;
	reset: () => void;
}) => {
	return (
		<div class="flex flex-col gap-4">
			<div class="rounded-lg shadow-lg mt-8 text-center mx-6 uppercase">
				<h2
					class={`flex font-bold ${
						props.correct ? 'bg-green-500' : 'bg-[#b71c1c]'
					} text-white justify-center py-2 rounded-t-lg`}
				>
					{props.word}
				</h2>
				<div class={`p-6 flex text-lg`}>
					<div class=" block basis-0 grow shrink p-3">
						<h3 class="mb-2">Your answer</h3>
						<p class="font-bold text-2xl">{props.input || 'N/A'}</p>
					</div>
					<div class="block basis-0 grow shrink p-3">
						<h3 class="text-md mb-2">Correct answer</h3>
						<p class="font-bold text-2xl">{props.answer}</p>
					</div>
				</div>
			</div>
			<Button onClick={() => props.reset()} class="mx-auto">
				Next
			</Button>
		</div>
	);
};

const ReferenceCard = () => {
	const alphabet = Object.entries(NATO_ALPHABET),
		middleIndex = Math.ceil(alphabet.length / 2),
		leftAlphabet = alphabet.slice(0, middleIndex),
		rightAlphabet = alphabet.slice(middleIndex);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<As component={Button} variant="outline">
					Lookup
				</As>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>NATO/FAA Phonetic Alphabet</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					<div class="inline-block py-2 w-2/5 text-base">
						<table class="min-w-full text-left font-light ml-[50%]">
							<tbody>
								<For each={leftAlphabet}>
									{(entry) => {
										const letter = entry[0];
										const phonetic = entry[1];

										return (
											<tr class="border-none">
												<th class="text-right px-4 py-2">{letter}</th>
												<td class="text-left px-4 py-2">{phonetic}</td>
												<th class="text-right px-4 py-2">
													{rightAlphabet[leftAlphabet.indexOf(entry)][0]}
												</th>
												<td class="text-left px-4 py-2">
													{rightAlphabet[leftAlphabet.indexOf(entry)][1]}
												</td>
											</tr>
										);
									}}
								</For>
							</tbody>
						</table>
					</div>
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogClose>Cancel</AlertDialogClose>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default function Quiz() {
	const [wordLists, setWordLists] = makePersisted(createSignal(['short']), { name: 'wordLists' });
	const [bias, setBias] = makePersisted(createSignal(2), { name: 'bias' });
	const [submitted, setSubmitted] = makePersisted(createSignal(false), { name: 'submitted' });
	const [text, setText] = makePersisted(createSignal(''), { name: 'text' });
	const [pastCharacters, setPastCharacters] = makePersisted(createSignal({}), {
		name: 'pastCharacters',
	});

	let words: string[] = wordLists().flatMap((list) => wordListValues[list]);
	const [word, setWord] = makePersisted(
		createSignal(words[Math.floor(Math.random() * words.length)].toUpperCase()),
		{ name: 'word' },
	);

	if (!submitted() && text().length > 0) {
		setText('');
	}

	function newWord() {
		if (words.length === 0) return;
		if (bias() > 0) {
			const sortedWords = words
				.map((word: string) => ({
					word,
					count: countCharOccurrences(word, pastCharacters()),
				}))
				.sort((a, b) => a.count - b.count);

			const minCount = sortedWords[0].count;
			const minCountWords = sortedWords.filter((word) => word.count === minCount);
			let randomIndex = Math.floor(Math.random() * minCountWords.length);
			const biasScore: Record<number, number> = {
				1: 3,
				2: 2,
				3: 1,
			};
			const randomOrBias = Math.floor(Math.random() * biasScore[bias()]);
			if (randomOrBias !== 0) {
				randomIndex = Math.floor(Math.random() * words.length);
				setWord(words[randomIndex].toUpperCase());
			} else {
				setWord(minCountWords[randomIndex].word.toUpperCase());
			}
		} else {
			const randomIndex = Math.floor(Math.random() * words.length);
			setWord(words[randomIndex].toUpperCase());
		}
	}
	function addCharacters(word: string) {
		const characters = word.split('');
		for (const character of characters) {
			if (!(character in pastCharacters())) {
				setPastCharacters({
					...pastCharacters(),
					[character]: 1,
				});
			} else {
				const key = character as keyof typeof pastCharacters;
				setPastCharacters({
					...pastCharacters,
					[key]: pastCharacters()[key] + 1,
				});
			}
		}
	}
	createEffect(() => {
		if (submitted()) {
			addCharacters(word());
			const input = document.querySelector('#input') as HTMLInputElement;
			if (input) input.value = text() || '';
			setSubmitted(true);
		}
	});
	function reset() {
		setSubmitted(false);
		newWord();
		(document.querySelector('#input') as HTMLInputElement).value = '';
		setText('');
	}
	function updateWords(e: Event, wordList: string) {
		if ((e.target as HTMLInputElement).checked) {
			words = mergeArrays(words, wordListValues[wordList]);
			if (!wordLists().includes(wordList)) setWordLists([...wordLists(), wordList]);
		} else {
			if (wordLists().length === 1) {
				toaster.show((props) => (
					<Toast toastId={props.toastId} variant="destructive">
						<ToastContent>
							<ToastTitle>Cannot remove all word lists!</ToastTitle>
							<ToastDescription>
								Make sure you have at least one word list selected.
							</ToastDescription>
						</ToastContent>
						<ToastProgress />
					</Toast>
				));
				return;
			}
			words = words.filter((word: string) => !wordListValues[wordList].includes(word));
			if (wordLists().includes(wordList))
				setWordLists(wordLists().splice(wordLists().indexOf(wordList), 1));
		}
		reset();
	}
	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<As component={Button} variant="outline" class="fixed top-5 right-8">
						Settings
					</As>
				</SheetTrigger>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Settings</SheetTitle>
						<SheetDescription>
							Make changes to your profile here. Click save when you're done.
						</SheetDescription>
					</SheetHeader>
					<div>
						<div class="flex flex-col mx-4 gap-6">
							<div>
								<h2 class="font-bold my-4 self-center text-2xl">Word length</h2>
								<div class="flex flex-row">
									<Checkbox
										id="short"
										value="short"
										defaultChecked={wordLists().includes('short')}
										onchange={(e: Event) => {
											updateWords(e, 'short');
										}}
									>
										Short
									</Checkbox>
									<Checkbox
										id="medium"
										value="medium"
										defaultChecked={wordLists().includes('medium')}
										onchange={(e: Event) => {
											updateWords(e, 'medium');
										}}
									>
										Medium
									</Checkbox>
									<Checkbox
										id="long"
										value="long"
										defaultChecked={wordLists().includes('long')}
										onchange={(e: Event) => {
											updateWords(e, 'long');
										}}
									>
										Long
									</Checkbox>
								</div>
							</div>
							<div>
								<h2 class="font-bold my-4 self-center text-2xl">Smart selection</h2>
								<p class="text-sm">
									With a higher "smart selection" bias, selected words will have a more even
									distribution of characters. Without, words will be selected at random, leaning
									towards words with common characters.
								</p>
								<Select
									options={[0, 1, 2, 3]}
									itemComponent={(props) => (
										<SelectItem item={props.item}>
											{{ 0: 'None', 1: 'Low', 2: 'Medium', 3: 'High' }[props.item.rawValue]}
										</SelectItem>
									)}
									onChange={setBias}
									defaultValue={bias()}
								>
									<SelectTrigger>
										<SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
									</SelectTrigger>
									<SelectContent />
								</Select>
							</div>
						</div>
					</div>
					<SheetFooter>
						<Button
							variant="destructive"
							class="mr-3"
							onclick={() => {
								localStorage.clear();
								window.location.reload();
							}}
							type="submit"
						>
							Reset
						</Button>
						<Button type="submit" class="mr-3">
							Save & Close
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<div class="flex flex-col gap-4 mx-6">
				<div class="self-center text-4xl bg-gray-200 text-zinc-700 rounded-lg p-4 mb-4">
					<span>{word()}</span>
				</div>
				<div class="flex flex-row gap-1">
					<ReferenceCard />
					<TextField
						id="input"
						disabled={submitted()}
						class="uppercase"
						oninput={(e: Event) => setText((e.target as HTMLInputElement).value)}
						onkeypress={(e: KeyboardEvent) => {
							if (e.key === 'Enter') {
								setSubmitted(true);
							}
						}}
					>
						<TextFieldInput type="text" />
					</TextField>
					<Button
						id="submit"
						disabled={submitted() || text()?.length === 0}
						onclick={() => {
							setSubmitted(true);
						}}
					>
						Check
					</Button>
					<Button
						id="reset"
						disabled={submitted()}
						onclick={() => {
							reset();
						}}
					>
						Skip
					</Button>
				</div>
			</div>
			{submitted() && (
				<AnswerCard
					word={word()}
					input={text()}
					answer={convertToPhoneticWords(word()).join(' ')}
					correct={isCorrect((text() || '').split(' '), convertToPhoneticWords(word()))}
					reset={reset}
				/>
			)}
			<Portal>
				<ToastRegion>
					<ToastList />
				</ToastRegion>
			</Portal>
		</>
	);
}
