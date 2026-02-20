<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	let { data } = $props();
	let phoneString = $state('');
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
	let errorMessage = $state('');
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
			<p>Zkontrolujte si, že toto je správné číslo:</p>
			<h2 class="mb-8 text-2xl font-semibold">{phoneString}</h2>
			<p class="mb-8 text-sm">
				Jakmile si necháte poslat přivítací SMS, už ho <span class="font-semibold text-red-400"
					>nebudete moci změnit</span
				>.
				<br />
				Po obdržení přivítací SMS je doporučené si uložit kontakt, např. "Skupina" nebo "Ding". Prostřednictvím
				tohoto čísla budete komunikovat se svou skupinou.
			</p>

			<form
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type !== 'success')
							errorMessage = 'Něco se nepovedlo :( Zkuste to znovu později.';
						else await update();
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
				<p class="mt-8 text-center text-sm text-red-400">
					{errorMessage}
				</p>
			{/if}

			<p class="mt-8 text-sm">
				Číslo je špatně? <button class="text-start text-red-400 underline hover:cursor-pointer"
					>Klikněte sem a opravte ho.</button
				>
			</p>
		{:else if !data.user.latestMessage}
			<h2 class="mb-8 font-2 text-2xl font-semibold">Pošlete svou první zprávu</h2>
			<p class="text-sm">
				Měli byste za chvíli dostat přivítací SMS. Pokud do několika minut nedorazí, prosím, <a
					href="jakvejr@gmail.com"
					class="text-red-400 underline">kontaktujte podporu</a
				>.
				<br />
				<br />
				Pokud zpráva dorazila, odpovězte na ni (na obsahu odpovědi nezáleží).
				<span class="font-semibold"
					>Odpověď na přivítací zprávu ani žádná jiná zpráva poslaná na Ding NESMÍ:</span
				>
			</p>
			<ol class="ml-4 list-inside list-decimal text-sm">
				<li>Obsahovat speciální znaky (á,é,í,š,č,ř atd.)</li>
				<li>Obsahovat odstavce nebo prázdné řádky</li>
				<li>Být delší než 140 znaků</li>
			</ol>
			<br />
			<p class="text-sm">
				Jakákoliv zpráva, která nesplní tyto podmínky, nebude doručena. Na stránce <a
					href="/"
					class="text-red-400 underline">poslední doručená SMS</a
				>
				se můžete kdykoliv podívat, která vaše zpráva dorazila do systému jako poslední.
				<br /><br />
				Po odeslání odpovědi počkejte cca 10 sekund a stiskněte tlačítko níže nebo refreshněte stránku.
			</p>
			<form
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type !== 'success')
							errorMessage =
								'Zpráva zatím nedorazila do systému. Prosím, ujistěte se, že splňuje všechny podmínky uvedené výše. Pokud ano, zkuste tlačítko za chvíli stisknout znovu. Pokud ne, napište novou zprávu.';
						else await update();
					};
				}}
				action="?/checkForReply"
				method="POST"
			>
				<button
					class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
					>Odeslal jsem odpověď</button
				>
			</form>

			{#if errorMessage}
				<p class="mt-8 text-center text-sm text-red-400">
					{errorMessage}
				</p>
			{/if}
		{/if}
	</div>
	<div class="h-min border bg-white p-4"></div>
</div>
