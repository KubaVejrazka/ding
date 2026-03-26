<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { formatPhoneNumber } from '$lib/utils/phone';
	import MemberListItem from '$lib/components/dashboard/MemberListItem.svelte';
	import LatestMessageCard from '$lib/components/dashboard/LatestMessageCard.svelte';

	let { data } = $props();

	let expandedIndex = $state(-1);
	let showReplySentButton = $state(true);
	let errorMessage = $state('');
	let checkingForReply = $state(false);

	const phoneString = $derived(data.user ? formatPhoneNumber(data.user.phone) : '');

	function startReplyCheck() {
		let i = 0;
		const interval = setInterval(async () => {
			if (!checkingForReply || i >= 10) {
				clearInterval(interval);
				if (i >= 10) {
					errorMessage =
						'Vaše zpráva zatím nepřišla. Zkuste za chvíli stisknout tlačítko znovu, pokud to nepomůže, pošlete novou zprávu. Ujistěte se, že odpovídáte správnému číslu a že před číslem příjemce máte předvolbu +420.';
					checkingForReply = false;
					showReplySentButton = true;
				}
				return;
			}
			console.log('Reply check...');
			await invalidateAll();

			if (data.user?.lastMessageContent) {
				clearInterval(interval);
				checkingForReply = false;
			}

			i++;
		}, 1000);
	}
</script>

<div class="m-4 grid gap-4 md:grid-cols-2">
	<div class="h-min border bg-white p-4">
		{#if !data.user?.welcomeMessageSent}
			<!-- STEP 1: WELCOME MESSAGE -->
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
					return async ({ update }) => {
						await update();
					};
				}}
				action="?/welcomeMessage"
				method="POST"
			>
				<button
					class="h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>
					Odeslat přivítací SMS
				</button>
			</form>

			<p class="mt-8 text-justify">
				Číslo je špatně? <a
					href="/dashboard/fixNumber"
					class="text-start text-red-400 underline hover:cursor-pointer"
				>
					Klikněte sem a opravte ho.
				</a>
			</p>
		{:else if !data.user.lastMessageContent}
			<!-- STEP 2: FIRST REPLY -->
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
				doručen vůbec.
				<br /><br />
				Po odeslání odpovědi stiskněte tlačítko níže.
			</p>

			{#if showReplySentButton}
				<button
					type="button"
					onclick={() => {
						showReplySentButton = false;
						checkingForReply = true;
						errorMessage = '';
						startReplyCheck();
					}}
					class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>
					Odeslal/a jsem odpověď
				</button>
			{/if}

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
			<!-- STEP 3: MAIN DASHBOARD -->
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
				<hr class="my-4 border-t-gray-200" />
				<h4 class="mt-4 font-semibold">
					Seznam členů ({data.group.users.length}):
				</h4>
				<ul class="mt-2 divide-y divide-gray-100">
					{#each data.group.users as member, i}
						<MemberListItem
							{member}
							currentUser={data.user}
							isOwner={data.user.id === data.group.ownerId}
							expanded={expandedIndex === i}
							ontoggle={() => (expandedIndex = expandedIndex === i ? -1 : i)}
						/>
					{/each}
				</ul>
				{#if data.user.id === data.group.ownerId}
					<button
						class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
						onclick={() => goto('/dashboard/addMember')}>Pozvat nového člena</button
					>
				{/if}

				<h4 class="mt-8">Aktuální cena za zprávu:</h4>
				<span class="text-4xl font-semibold">{(data.group.users.length - 1) * 2} Kč</span>
			{/if}
		{/if}
	</div>

	<div class="flex flex-col gap-4">
		<!-- CREDIT -->
		<div class="border bg-white p-4">
			<h2 class="mb-8 font-2 text-2xl font-semibold">Váš kredit</h2>
			<p class="mb-8 text-justify">
				Na začátek máte zkušební kredit 10 Kč (5 zpráv), pak je potřeba si dobíjet kredit dopředu.
				Cena za každou odeslanou zprávu je 2 Kč, tzn. pokud píšete do skupiny, kde jsou kromě vás 3
				další lidé, platíte za každou zprávu 6 Kč (3×2).
			</p>
			<h4 class="text-lg font-semibold">Váš kredit:</h4>
			<span class="text-6xl font-semibold">{data.user?.credit} Kč</span>

			<p class="mt-8 text-center text-gray-500">
				Služba je v testovacím režimu a kredit momentálně nelze dobíjet. Administrátoři a ověření
				testeři ale můžou do mínusu :)
			</p>
		</div>

		<!-- LATEST MESSAGE -->
		<div class="border bg-white p-4">
			<h2 class="mb-8 font-2 text-2xl font-semibold">Poslední doručená SMS</h2>
			<p class="mb-8 text-justify">
				Zde se můžete podívat, jaká vaše zpráva jako poslední úspěšně dorazila do systému. Pokud
				jste nějakou zprávu odeslali před víc než minutou a stále ji po stisknutí tlačítka níže
				nevidíte, zkontrolujte, že splňuje všechny podmínky a zkuste to, prosím, znovu.
			</p>

			<LatestMessageCard
				message={data.user?.lastMessageContent}
				time={data.user?.lastMessageReceivedAt}
			/>

			{#if data.user?.lastMessageContent}
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
						>
							Znovu načíst
						</button>
					{:else}
						<div class="mt-8 flex items-center justify-center p-4">
							<img src="/spinner.svg" alt="Načítám..." class="mr-2 size-6 animate-spin" />
							<span>Načítám...</span>
						</div>
					{/if}
				</form>
			{/if}
		</div>
	</div>
</div>
