/* eslint-disable solid/reactivity */
import { createSignal, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { makePersisted } from '@solid-primitives/storage';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogAction,
} from '@/components/ui/dialog';
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
import { Checkbox, CheckboxControl, CheckboxLabel } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { As, toaster } from '@kobalte/core';

import { NATO_ALPHABET, WORD_DICTS } from '@/constants';
import { convertToPhoneticWords, isCorrect, countCharOccurrences } from '@/quiz';
import { cn, getRandomItem } from '@/lib/utils';

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
					class={cn(props.correct ? 'bg-green-500' : 'bg-[#b71c1c]', 'rounded-t-xl py-4')}
				>
					<CardTitle class={`flex font-bold text-white justify-center`}>{props.word}</CardTitle>
				</CardHeader>
				<CardContent>
					<div class={`p-6 flex text-lg uppercase`}>
						<div class=" block basis-0 grow shrink p-3">
							<h3 class="mb-2">Your answer</h3>
							<p class="font-bold text-2xl">{props.input || 'N/A'}</p>
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
				</DialogDescription>
				<DialogFooter>
					<DialogAction>Continue</DialogAction>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default function Quiz() {
	const [wordLists, setWordLists] = makePersisted(createSignal(['short']), { name: 'wordLists' });
	const [bias, setBias] = makePersisted(createSignal(2), { name: 'bias' });
	const [pastCharacters, setPastCharacters] = makePersisted(createSignal({}), {
		name: 'pastCharacters',
	});

	const [submitted, setSubmitted] = createSignal(false);
	const [text, setText] = createSignal('');
	const words = () =>
		wordLists()
			.map((list) => WORD_DICTS[list])
			.flat();
	const [word, setWord] = createSignal(getRandomItem(words()).toUpperCase());

	function generateNewWord() {
		if (bias() !== 0) {
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
			if (Math.floor(Math.random() * biasScore[bias()]) !== 0) {
				return getRandomItem(words()).toUpperCase();
			} else {
				return getRandomItem(wordsWithLowestChars).word.toUpperCase();
			}
		} else {
			return getRandomItem(words()).toUpperCase();
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

	function next() {
		setSubmitted(false);
		setWord(generateNewWord());
		setText('');
	}

	function updateWords(checked: boolean, wordList: string) {
		if (checked) {
			setWordLists(Array.from(new Set([...wordLists(), wordList])));
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
			setWordLists(wordLists().filter((item) => item !== wordList));
		}
		next();
	}

	return (
		<>
			<Sheet>
				<SheetTrigger asChild>
					<As component={Button} variant="outline" class="fixed top-5 right-8">
						Settings
					</As>
				</SheetTrigger>
				<SheetContent side="right" class="flex flex-col">
					<SheetHeader>
						<SheetTitle>Settings</SheetTitle>
						<SheetDescription>
							Make changes to your profile here. Click save when you're done.
						</SheetDescription>
					</SheetHeader>
					<div>
						<div class="flex flex-col gap-6">
							<div>
								<h4 class="self-center font-medium text-base">Word length</h4>
								<div class="flex flex-row justify-around gap-2 mt-4">
									<Checkbox
										class="flex flex-row gap-2 cursor-pointer"
										value="short"
										defaultChecked={wordLists().includes('short')}
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
										defaultChecked={wordLists().includes('medium')}
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
										defaultChecked={wordLists().includes('long')}
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
								<h2 class="font-medium self-center text-base">Smart selection</h2>
								<p class="text-sm mt-2">
									With a higher "smart selection" bias, selected words will have a more even
									distribution of characters. Without, words will be selected at random, leaning
									towards words with common characters.
								</p>
								<Select
									class="mt-4"
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
			<div class="flex flex-col gap-4 mt-4">
				<div class="self-center text-4xl bg-gray-200 text-zinc-700 rounded-lg p-4 mb-4">
					{word()}
				</div>
				<div class="flex flex-row gap-1 justify-center">
					<ReferenceCard />
					<TextField
						disabled={submitted()}
						value={text()}
						onChange={setText}
						class="uppercase"
						onkeypress={(e: KeyboardEvent) => {
							if (e.key === 'Enter') {
								setSubmitted(true);
							}
						}}
					>
						<TextFieldInput type="text" />
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
					correct={isCorrect((text() || '').split(' '), convertToPhoneticWords(word()))}
					next={next}
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
