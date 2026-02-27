<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { data } = $props();

	let expandedIndex = $state(-1);

	let showReplySentButton = $state(true);
	let errorMessage = $state('');
	let phoneString = $state('');

	// svelte-ignore non_reactive_update
	let checkForReplyForm: HTMLFormElement;
	let checkingForReply = $state(false);

	function checkForReply() {
		let i = 1;
		if (checkForReplyForm) {
			const interval = setInterval(() => {
				if (!checkingForReply) return;
				console.log('Reply check...');
				checkForReplyForm.requestSubmit();
				i++;
				if (i >= 10) {
					clearInterval(interval);
					errorMessage =
						'Vaše zpráva zatím nepřišla. Zkuste za chvíli stisknout tlačítko znovu, pokud to nepomůže, pošlete novou zprávu. Ujistěte se, že odpovídáte správnému číslu a že před číslem příjemce máte předvolbu +420.';
					checkingForReply = false;
					showReplySentButton = true;
				}
			}, 1000);
		}
	}

	onMount(() => {
		phoneString =
			'+' +
			data.user!.phone.slice(0, 3) +
			' ' +
			data.user!.phone.slice(3, 6) +
			' ' +
			data.user!.phone.slice(6, 9) +
			' ' +
			data.user!.phone.slice(9, 12);
	});
</script>

<div class="m-4 grid gap-4 md:grid-cols-2">
	<div class="h-min border bg-white p-4">
		{#if !data.user?.welcomeMessageSent}
			<h2 class="mb-8 font-2 text-2xl font-semibold">Vytvořte si kontakt</h2>
			<p class="text-justify">
				Poslední krok, než budete moci začít využívat SMS skupiny, je ověření telefonního čísla a
				funkční obousměrné komunikace. Zkontrolujte si, že toto je vaše primární telefonní číslo:
			</p>
			<h2 class="my-8 text-2xl font-semibold">{phoneString}</h2>
			<p class="mb-8 text-justify">
				Jakmile si necháte poslat přivítací SMS, už ho <span class="font-semibold text-red-400"
					>nebudete moci změnit</span
				>. Po obdržení přivítací SMS je doporučené si číslo odesílatele uložit jako kontakt, např.
				"Ding" nebo "Skupina".
			</p>

			<form
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result) await update();
					};
				}}
				action="?/welcomeMessage"
				method="POST"
			>
				<button
					class="h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
					>Odeslat přivítací SMS</button
				>
			</form>

			<p class="mt-8 text-justify">
				Číslo je špatně? <a
					href="/dashboard/fixNumber"
					class="text-start text-red-400 underline hover:cursor-pointer"
					>Klikněte sem a opravte ho.</a
				>
			</p>
		{:else if !data.user.latestMessage}
			<h2 class="mb-8 font-2 text-2xl font-semibold">Pošlete svou první zprávu</h2>
			<p class="text-justify">
				Měli byste za chvíli dostat přivítací SMS. Pokud do několika minut nedorazí, prosím, <a
					href="mailto:jakvejr@gmail.com"
					class="text-red-400 underline">kontaktujte vývojáře.</a
				>
				<br /><br />
				Pokud zpráva dorazila, uložte si kontakt odesílatele a odpovězte na ni (např. "odpoved" nebo něco
				podobného).
				<br /><br />
				<span class="font-semibold"
					>Odpověď na přivítací zprávu ani žádná jiná zpráva poslaná na Ding by neměla:</span
				>
			</p>
			<ol class="mt-2 ml-4 list-inside list-decimal text-justify">
				<li>Obsahovat speciální znaky (á,č,ř atd.)</li>
				<li>Být delší než 140 znaků</li>
			</ol>
			<br />
			<p class="text-justify">
				Pokud pošlete zprávu, která bude obsahovat speciální znaky, přijde ostatním členům skupiny
				upravená (např. Á bude změněno na A apod.). Smajlíci se změní v nečitelné sekvence znaků,
				nepoužívejte je. Pokud přesáhnete 140 znaků, vaše zpráva nebude ostatním členům skupiny
				doručena vůbec.
				<br /><br />
				Po odeslání odpovědi stiskněte tlačítko níže.
			</p>
			<form
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							checkingForReply = false;
							await update();
						}
					};
				}}
				action="?/checkForReply"
				method="POST"
				bind:this={checkForReplyForm}
			>
				{#if showReplySentButton}
					<button
						type="button"
						onclick={() => {
							showReplySentButton = false;
							checkingForReply = true;
							errorMessage = '';
							checkForReplyForm.requestSubmit();
							checkForReply();
						}}
						class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
						>Odeslal/a jsem odpověď</button
					>
				{/if}
			</form>

			{#if checkingForReply}
				<div class="flex h-32 items-center justify-center p-4">
					<img src="/spinner.svg" alt="Načítám..." class="mr-2 size-6 animate-spin" />
					<span>Načítám...</span>
				</div>
			{/if}

			{#if errorMessage}
				<p class="mt-8 text-center text-red-400">
					{errorMessage}
				</p>
			{/if}
		{:else}
			<h2 class="mb-8 font-2 text-2xl font-semibold">Moje skupina</h2>
			{#if !data.group}
				<p>
					Momentálně nejste v žádné skupině. Můžete buď vytvořit novou, nebo se přidat do
					existující. Pro přidání do existující skupiny musíte požádat jejího autora, aby vám poslal
					pozvánku.
				</p>
				<button
					class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
					onclick={() => goto('/dashboard/createGroup')}>Vytvořit novou skupinu</button
				>
			{:else}
				<div class="flex w-full items-center justify-between">
					<h3 class="flex items-center text-xl">
						<span class="material-symbols-outlined mr-2">group</span>{data.group.name}
					</h3>
					{#if data.user.id === data.group.ownerId}
						<a href="/dashboard/manageGroup" class="text-red-400 underline">Spravovat skupinu</a>
					{/if}
				</div>
				<hr />
				<h4 class="mt-4">
					Seznam členů ({data.group.users.length}):
				</h4>
				<ul class="ml-4">
					{#each data.group.users as member, i}
						{#if i !== 0}
							<hr class="mt-2 border-t-gray-100" />
						{/if}
						<li class="mt-2 flex items-center justify-between">
							<div class="flex flex-col">
								<span class="font-semibold">{member.name}</span>
								<span class="text-xs">{member.email}</span>
							</div>
							{#if (data.user.id === data.group.ownerId && member.id !== data.user.id) || (data.user.id !== data.group.ownerId && member.id === data.user.id)}
								<div>
									<button
										class="flex items-center hover:cursor-pointer"
										onclick={() => (expandedIndex = i === expandedIndex ? -1 : i)}
									>
										<span class="material-symbols-outlined">more_vert</span>
									</button>
								</div>
							{/if}
						</li>
						<div
							class="flex justify-end transition-transform {expandedIndex === i
								? 'scale-y-100'
								: 'scale-y-0'}"
						>
							<form
								use:enhance={() => {
									return async ({ update }) => {
										await update();
									};
								}}
								method="POST"
								action="?/removeFromGroup"
							>
								<input type="hidden" name="id" value={member.id} />
								{#if expandedIndex === i}
									<button
										class="items-centergap-2 mt-2 flex gap-2 border border-red-400 bg-red-400 p-2 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-red-400"
									>
										<span class="material-symbols-outlined">logout</span>
										{member.id === data.user.id ? 'Opustit skupinu' : 'Odstranit ze skupiny'}
									</button>
								{/if}
							</form>
						</div>
					{/each}
				</ul>
				{#if data.user.id === data.group.ownerId}
					<button
						class="mt-4 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
						onclick={() => goto('/dashboard/addMember')}>Pozvat nového člena</button
					>
				{/if}

				<h4 class="mt-8">Aktuální cena za zprávu:</h4>
				<span class="text-4xl">{(data.group.users.length - 1) * 2} Kč</span>
			{/if}
		{/if}
	</div>
	<div class="flex flex-col gap-4">
		<div class="border bg-white p-4">
			<h2 class="mb-8 font-2 text-2xl font-semibold">Váš kredit</h2>
			<p class="mb-8 text-justify">
				Na začátek máte zkušební kredit 10 Kč (5 zpráv), pak je potřeba si dobíjet kredit dopředu.
				Cena za každou odeslanou zprávu je 2 Kč, tzn. pokud píšete do skupiny, kde jsou kromě vás 3
				další lidé, platíte za každou zprávu 6 Kč (3×2).
			</p>
			<h4 class="text-lg font-semibold">Váš kredit:</h4>
			<span class="text-6xl">{data.user?.credit} Kč</span>

			<p class="mt-8 text-center text-gray-500">
				Služba je v testovacím režimu a kredit momentálně nelze dobíjet. Administrátoři a ověření
				testeři ale můžou do mínusu :)
			</p>
		</div>
		<div class="border bg-white p-4">
			<h2 class="mb-8 font-2 text-2xl font-semibold">Poslední doručená SMS</h2>
			<p class="mb-8 text-justify">
				Zde se můžete podívat, jaká vaše zpráva jako poslední úspěšně dorazila do systému. Pokud
				jste nějakou zprávu odeslali před víc než minutou a stále ji po stisknutí tlačítka níže
				nevidíte, zkontrolujte, že splňuje všechny podmínky a zkuste to, prosím, znovu.
			</p>
			{#if data.user?.latestMessage}
				<div
					class="mx-auto flex min-h-32 flex-col justify-between rounded-xl border border-red-400 bg-red-50 p-4 lg:w-1/2"
				>
					<p class="font-2 text-lg text-red-400">{data.user?.latestMessage}</p>
					<span class="mt-2 text-end text-xs text-red-400"
						>{data.user?.latestMessageTime.getDate()}.{data.user?.latestMessageTime.getMonth()! +
							1}. {data.user?.latestMessageTime.getHours()}:{data.user?.latestMessageTime
							.getMinutes()
							.toString()
							.padStart(2, '0')}</span
					>
				</div>
				<form
					use:enhance={() => {
						checkingForReply = true;
						return async ({ update }) => {
							setTimeout(() => {
								checkingForReply = false;
							}, 500);
							await update();
						};
					}}
					action="?/checkForReply"
					method="POST"
				>
					{#if !checkingForReply}
						<button
							class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
							>Znovu načíst</button
						>
					{:else}
						<div class="mt-8 flex items-center justify-center p-4">
							<img src="/spinner.svg" alt="Načítám..." class="mr-2 size-6 animate-spin" />
							<span>Načítám...</span>
						</div>
					{/if}
				</form>
			{:else}
				<p class="text-center text-gray-500">Zatím nebyla doručena žádná vaše zpráva.</p>
			{/if}
		</div>
	</div>
</div>
