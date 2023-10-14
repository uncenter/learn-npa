/* eslint-disable solid/reactivity */
import { makePersisted } from '@solid-primitives/storage';
import { createSignal, For, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Checkbox,
	CheckboxControl,
	CheckboxLabel,
} from '@/components/ui/checkbox';
import {
	Dialog,
	DialogAction,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Sheet,
	SheetAction,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { TextField, TextFieldInput } from '@/components/ui/textfield';
import {
	Toast,
	ToastContent,
	ToastDescription,
	ToastList,
	ToastProgress,
	ToastRegion,
	ToastTitle,
} from '@/components/ui/toast';
import { As, toaster } from '@kobalte/core';

import { BIAS_WORDS, NATO_ALPHABET, WORD_DICTS } from '@/constants';
import { cn, getRandomItem } from '@/lib/utils';
import {
	convertToPhoneticWords,
	countCharOccurrences,
	isCorrect,
} from '@/quiz';
import { Icons } from '@/components/icon';

const AnswerCard = (props: {
	correct: boolean;
	word: string;
	input?: string;
	answer: string;
	next: () => void;
}) => {
	return (
		<>
			<Card class="m-8 text-center">
				<CardHeader
					class={cn(
						props.correct ? 'bg-green-500' : 'bg-[#b71c1c]',
						'rounded-t-xl py-4',
					)}
				>
					<CardTitle
						class={`flex font-bold text-white justify-center`}
					>
						{props.word}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class={`p-6 flex text-lg uppercase`}>
						<div class=" block basis-0 grow shrink p-3">
							<h3 class="mb-2">Your answer</h3>
							<p class="font-bold text-2xl">
								{props.input || 'N/A'}
							</p>
						</div>
						<div class="block basis-0 grow shrink p-3">
							<h3 class="text-md mb-2">Correct answer</h3>
							<p class="font-bold text-2xl">{props.answer}</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Button onClick={() => props.next()} class="flex mx-auto mt-2">
				Next
			</Button>
		</>
	);
};

const ReferenceCard = () => {
	const alphabet = Object.entries(NATO_ALPHABET),
		middleIndex = Math.ceil(alphabet.length / 2),
		leftAlphabet = alphabet.slice(0, middleIndex),
		rightAlphabet = alphabet.slice(middleIndex);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<As component={Button} variant="outline">
					Lookup
				</As>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>NATO/FAA Phonetic Alphabet</DialogTitle>
				</DialogHeader>
				<DialogDescription class="text-black">
					<div class="inline-block py-2 w-2/5 text-base">
						<table class="min-w-full text-left font-light ml-[50%]">
							<tbody>
								<For each={leftAlphabet}>
									{(entry) => {
										const letter = entry[0];
										const phonetic = entry[1];

										return (
											<tr class="border-none">
												<th class="text-right px-4 py-2">
													{letter}
												</th>
												<td class="text-left px-4 py-2">
													{phonetic}
												</td>
												<th class="text-right px-4 py-2">
													{
														rightAlphabet[
															leftAlphabet.indexOf(
																entry,
															)
														][0]
													}
												</th>
												<td class="text-left px-4 py-2">
													{
														rightAlphabet[
															leftAlphabet.indexOf(
																entry,
															)
														][1]
													}
												</td>
											</tr>
										);
									}}
								</For>
							</tbody>
						</table>
					</div>
				</DialogDescription>
				<DialogFooter>
					<DialogAction>Continue</DialogAction>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default function Quiz() {
	const [bias, setBias] = makePersisted(createSignal(2), { name: 'bias' });
	const [wordLists, setWordLists] = makePersisted(createSignal(['short']), {
		name: 'wordLists',
	});
	const [pastCharacters, setPastCharacters] = makePersisted(
		createSignal({}),
		{
			name: 'pastCharacters',
		},
	);

	const words = () => wordLists().flatMap((list) => WORD_DICTS[list]);

	const [submitted, setSubmitted] = createSignal(false);
	const [text, setText] = createSignal('');
	const [word, setWord] = createSignal('');

	function generateNewWord() {
		if (bias() === 0) {
			return getRandomItem(words()).toUpperCase();
		} else {
			const sortedWords = words()
				.map((word: string) => ({
					word,
					count: countCharOccurrences(word, pastCharacters()),
				}))
				.sort((a, b) => a.count - b.count);
			const wordsWithLowestChars = sortedWords.filter(
				(word) => word.count === sortedWords[0].count,
			);

			const biasScore: Record<number, number> = {
				1: 3, // 33% biased.
				2: 2, // 50% biased.
				3: 1, // Always biased.
			};
			return Math.floor(Math.random() * biasScore[bias()]) === 0
				? getRandomItem(wordsWithLowestChars).word.toUpperCase()
				: getRandomItem(words()).toUpperCase();
		}
	}

	onMount(() => {
		setWord(generateNewWord());
	});

	function addCharacters(word: string) {
		const characters = [...word];
		for (const character of characters) {
			if (character in pastCharacters()) {
				const key = character as keyof typeof pastCharacters;
				setPastCharacters({
					...pastCharacters,
					[key]: pastCharacters()[key] + 1,
				});
			} else {
				setPastCharacters({
					...pastCharacters(),
					[character]: 1,
				});
			}
		}
	}

	function next() {
		setSubmitted(false);
		setWord(generateNewWord());
		setText('');
	}

	function updateWords(checked: boolean, wordList: string) {
		if (checked) {
			setWordLists([...new Set([...wordLists(), wordList])]);
		} else {
			if (wordLists().length === 1) {
				toaster.show((props) => (
					<Toast toastId={props.toastId} variant="destructive">
						<ToastContent>
							<ToastTitle>
								Cannot remove all word lists!
							</ToastTitle>
							<ToastDescription>
								Make sure you have at least one word list
								selected.
							</ToastDescription>
						</ToastContent>
						<ToastProgress />
					</Toast>
				));
				return;
			}
			setWordLists(wordLists().filter((item) => item !== wordList));
		}
		next();
	}

	return (
		<div class="p-4">
			<Sheet>
				<SheetTrigger asChild>
					<As
						component={Button}
						variant="outline"
						class="fixed top-5 right-8"
					>
						<Icons.settings />
					</As>
				</SheetTrigger>
				<SheetContent side="right" class="flex flex-col">
					<SheetHeader>
						<SheetTitle>Settings</SheetTitle>
					</SheetHeader>
					<div>
						<div class="flex flex-col gap-6">
							<div>
								<h4 class="self-center font-medium text-base">
									Word length
								</h4>
								<div class="flex flex-row justify-around gap-2 mt-4">
									<Checkbox
										class="flex flex-row gap-2 cursor-pointer"
										value="short"
										defaultChecked={wordLists().includes(
											'short',
										)}
										onChange={(checked: boolean) => {
											updateWords(checked, 'short');
										}}
									>
										<CheckboxControl />
										<CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											Short
										</CheckboxLabel>
									</Checkbox>
									<Checkbox
										class="flex flex-row gap-2 cursor-pointer"
										value="medium"
										defaultChecked={wordLists().includes(
											'medium',
										)}
										onChange={(checked: boolean) => {
											updateWords(checked, 'medium');
										}}
									>
										<CheckboxControl />
										<CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											Medium
										</CheckboxLabel>
									</Checkbox>
									<Checkbox
										class="flex flex-row gap-2 cursor-pointer"
										value="long"
										defaultChecked={wordLists().includes(
											'long',
										)}
										onChange={(checked: boolean) => {
											updateWords(checked, 'long');
										}}
									>
										<CheckboxControl />
										<CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											Long
										</CheckboxLabel>
									</Checkbox>
								</div>
							</div>
							<div>
								<h2 class="font-medium self-center text-base">
									Smart selection
								</h2>
								<p class="text-sm mt-2">
									With a higher "smart selection" bias,
									selected words will have a more even
									distribution of characters. Without, words
									will be selected at random, leaning towards
									words with common characters.
								</p>
								<Select
									class="mt-4"
									options={['None', 'Low', 'Medium', 'High']}
									itemComponent={(props) => (
										<SelectItem item={props.item}>
											{props.item.rawValue}
										</SelectItem>
									)}
									onChange={(value: string) => {
										setBias(
											BIAS_WORDS[
												value as keyof typeof BIAS_WORDS
											] || bias(),
										);
									}}
									defaultValue={Object.keys(BIAS_WORDS).find(
										(key) =>
											BIAS_WORDS[
												key as keyof typeof BIAS_WORDS
											] === bias(),
									)}
								>
									<SelectTrigger>
										<SelectValue<string>>
											{(state) => state.selectedOption()}
										</SelectValue>
									</SelectTrigger>
									<SelectContent />
								</Select>
							</div>
						</div>
					</div>
					<SheetFooter class="mt-auto gap-2">
						<Button
							variant="destructive"
							class="m-0"
							onclick={() => {
								localStorage.clear();
								window.location.reload();
							}}
							type="submit"
						>
							Reset
						</Button>
						<SheetAction class="m-0">Save & Close</SheetAction>
					</SheetFooter>
				</SheetContent>
			</Sheet>
			<div class="flex flex-col gap-4 mt-4">
				<div class="self-center text-4xl bg-gray-200 text-zinc-700 rounded-lg p-4 mb-4 h-16 flex flex-row items-center">
					<Show
						when={word() !== ''}
						fallback={
							<Icons.spinner class="h-full w-full animate-spin" />
						}
					>
						{word()}
					</Show>
				</div>
				<div class="flex flex-row gap-1 justify-center">
					<ReferenceCard />
					<TextField
						disabled={submitted()}
						value={text()}
						onChange={setText}
						class="uppercase w-full"
						onkeypress={(event: KeyboardEvent) => {
							if (event.key === 'Enter') {
								setSubmitted(true);
							}
						}}
					>
						<TextFieldInput type="text" class="h-12 w-full" />
					</TextField>
					<Button
						disabled={submitted() || text()?.length === 0}
						onclick={() => {
							setSubmitted(true);
							addCharacters(word());
						}}
					>
						Check
					</Button>
					<Button disabled={submitted()} onclick={() => next()}>
						Skip
					</Button>
				</div>
			</div>
			{submitted() && (
				<AnswerCard
					word={word()}
					input={text()}
					answer={convertToPhoneticWords(word()).join(' ')}
					correct={isCorrect(
						(text() || '').split(' '),
						convertToPhoneticWords(word()),
					)}
					next={next}
				/>
			)}
			<Portal>
				<ToastRegion>
					<ToastList />
				</ToastRegion>
			</Portal>
		</div>
	);
}
