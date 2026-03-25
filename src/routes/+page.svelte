<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let existingUser = $state(false);
</script>

<div class="m-4 grid grow grid-cols-1 gap-4 lg:grid-cols-2">
	<div class="h-min border bg-white p-4">
		<h1 class="mb-8 font-2 text-4xl font-semibold">Groupchaty i bez internetu.</h1>
		<p class="mb-8 text-justify">
			Ding je platforma, která přináší svět skupinových konverzací do klasických SMS zpráv. Je
			určena primárně uživatelům tlačítkových telefonů, na kterých si WhatsApp nebo podobnou
			aplikaci zkrátka nestáhnete. Ding vám umožňuje zůstat v kontaktu i bez přístupu k internetu a
			platíte jen za zprávy, které odešlete.
		</p>
		<img src="/img.svg" alt="" class="mx-auto w-full md:w-2/3" />
		<p class="mt-8 text-justify">
			Ding je ideální volbou např. pro organizování rodinných sešlostí, komunikaci s blízkými z míst
			bez internetu, nebo třeba pro rodinnou skupinu s malými dětmi, které ještě nemají na internetu
			co dělat.
		</p>
	</div>

	<div class="flex h-min w-full flex-col gap-4">
		<AuthForm {form} bind:existingUser />

		<div class="border bg-white p-4">
			<h2 class="mb-8 font-2 text-2xl font-semibold">Jak to funguje?</h2>
			<p class="text-justify">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus aliquam risus et
				malesuada. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus
				mus. Nunc luctus urna vel ex posuere dignissim. Donec elementum pharetra volutpat. Nulla
				placerat leo at nunc maximus, feugiat dignissim arcu porta. Nulla porta blandit augue ac
				finibus. Nullam vitae tincidunt lacus. Etiam lacinia mi nunc. Phasellus id arcu euismod,
				iaculis ex vitae, cursus lectus. Donec eu posuere leo. Sed odio dui, congue non ullamcorper
				in, gravida a purus.
			</p>
		</div>
	</div>
</div>
