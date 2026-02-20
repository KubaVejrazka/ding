<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	let { data } = $props();

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
						'Vaše zpráva zatím nepřišla. Zkuste za chvíli stisknout tlačítko znovu, pokud to nepomůže, pošlete novou zprávu. Ujistěte se, že vaše zpráva splňuje podmínky výše, a že před číslem příjemce máte předvolbu +420.';
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
	<!-- <form use:enhance action="?/testSMS" method="POST"> -->
	<!-- 	<button -->
	<!-- 		class="border bg-black p-2 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black" -->
	<!-- 		>Test SMS API (admin only)</button -->
	<!-- 	> -->
	<!-- </form> -->
	<div class="h-min border bg-white p-4">
		{#if !data.user?.welcomeMessageSent}
			<h2 class="mb-8 font-2 text-2xl font-semibold">Vytvořte si kontakt</h2>
			<p>
				Poslední krok, než budete moci začít využívat SMS skupiny, je ověření telefonního čísla a
				funkční obousměrné komunikace. Zkontrolujte si, že toto je vaše primární telefonní číslo:
			</p>
			<h2 class="mb-8 text-2xl font-semibold">{phoneString}</h2>
			<p class="mb-8">
				Jakmile si necháte poslat přivítací SMS, už ho <span class="font-semibold text-red-400"
					>nebudete moci změnit</span
				>.
				<br />
				Po obdržení přivítací SMS je doporučené si číslo odesílatele uložit jako kontakt, např. "Ding"
				nebo "Skupina". Na mnoha zařízeních jinak vznikají problémy.
				<span class="font-semibold text-red-400"
					>Je nutné, abyste si kontakt uložili i s předvolbou +420</span
				>, jinak se vámi odeslané zprávy nebudou doručovat.
			</p>

			<form
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') await update();
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

			{#if errorMessage}
				<p class="mt-8 text-center text-red-400">
					{errorMessage}
				</p>
			{/if}

			<p class="mt-8">
				Číslo je špatně? <a
					href="/dashboard/fixNumber"
					class="text-start text-red-400 underline hover:cursor-pointer"
					>Klikněte sem a opravte ho.</a
				>
			</p>
		{:else if !data.user.latestMessage}
			<h2 class="mb-8 font-2 text-2xl font-semibold">Pošlete svou první zprávu</h2>
			<p>
				Měli byste za chvíli dostat přivítací SMS. Pokud do několika minut nedorazí, prosím, <a
					href="mailto:jakvejr@gmail.com"
					class="text-red-400 underline">kontaktujte vývojáře.</a
				>
				<br />
				<br />
				Pokud zpráva dorazila, uložte si kontakt odesílatele a odpovězte na ni (např. "odpoved" nebo něco
				podobného).
				<span class="font-semibold"
					>Odpověď na přivítací zprávu ani žádná jiná zpráva poslaná na Ding NESMÍ:</span
				>
			</p>
			<ol class="mt-2 ml-4 list-inside list-decimal">
				<li>Obsahovat speciální znaky (á,č,ř atd.)</li>
				<li>Obsahovat odstavce nebo prázdné řádky</li>
				<li>Být delší než 140 znaků</li>
			</ol>
			<br />
			<p>
				Jakákoliv zpráva, která nesplní tyto podmínky, nebude doručena. Na stránce <a
					href="/"
					class="text-red-400 underline">poslední doručená SMS</a
				>
				se můžete kdykoliv podívat, která vaše zpráva dorazila do systému jako poslední.
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
			{#if !data.user.groupId}
				<p>
					Momentálně nejste v žádné skupině. Můžete buď vytvořit novou, nebo se přidat do
					existující. Pro přidání do existující skupiny musíte požádat jejího autora, aby vám poslal
					pozvánku.
				</p>
				<p class="mt-8 text-center text-red-400">Work in progress</p>
			{/if}
		{/if}
	</div>
	<div class="h-min border bg-white p-4">
		<h2 class="mb-8 font-2 text-2xl font-semibold">Váš kredit</h2>
		<p class="mb-8">
			Na začátek máte zkušební kredit 10 Kč (5 zpráv), pak je potřeba si dobíjet kredit dopředu.
			Cena za každou odeslanou zprávu je 2 Kč, tzn. pokud píšete do skupiny, kde jsou kromě vás 3
			další lidé, platíte za každou zprávu 6 Kč (3×2).
		</p>
		<h4 class="text-lg font-semibold">Váš kredit:</h4>
		<span class="text-6xl">{data.user?.credit} Kč</span>

		<button class="mt-8 h-12 w-full border bg-red-50">Dobít kredit</button>

		<p class="mt-8 text-center text-red-400">
			Služba je v testovacím režimu a kredit momentálně nelze dobíjet. Administrátoři a ověření
			testeři ale můžou do mínusu :)
		</p>
	</div>
</div>
