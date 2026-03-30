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
			<ol class="list-inside list-decimal space-y-6 text-justify">
				<li class="pl-2">
					<strong>Registrace a skupina:</strong> Na webu si vytvoříte účet a založíte skupinu (např.
					"Rodina"). Své blízké do ní pozvete jednoduše pomocí jejich e-mailu.
				</li>
				<li class="pl-2">
					<strong>Poslání zprávy:</strong> Jakmile členové pozvánku přijmou, můžete začít psát. Stačí
					poslat běžnou SMS na naše servisní číslo.
				</li>
				<li class="pl-2">
					<strong>Okamžité doručení:</strong> Ding vaši zprávu automaticky přepošle všem ostatním ve
					skupině. Ostatní členové uvidí vaše jméno a text zprávy přímo ve svých SMS zprávách.
				</li>
				<li class="pl-2">
					<strong>Žádná aplikace:</strong> Pro psaní i přijímání zpráv nepotřebujete chytrý telefon
					ani internet. Vše probíhá přes klasické SMS, které fungují na každém mobilu.
				</li>
				<li class="pl-2">
					<strong>Férová cena:</strong> Platíte jen za zprávy, které sami odešlete. Za každého
					člena, kterému Ding vaši zprávu doručí, se z vašeho kreditu odečtou 2 Kč.
				</li>
			</ol>
		</div>
	</div>
</div>
