<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	function getErrorMessage(code: string | undefined): string {
		if (code == undefined) return '';
		switch (code) {
			case 'INVALID_EMAIL':
				return 'Neplatný email.';
			case 'INVALID_PHONE':
				return 'Neplatné telefonní číslo.';
			case 'INVALID_USERNAME':
				return 'Neplatná přezdívka.';
			case 'INVALID_EMAIL_OR_PASSWORD':
				return 'Špatný email nebo heslo.';
			case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
				return 'Uživatel s tímto emailem už existuje.';
			case 'PASSWORD_TOO_SHORT':
				return 'Heslo je moc krátké.';
			case 'FAILED_TO_CREATE_USER':
				return 'Něco se nepovedlo. Ujistěte se, že toto telefonní číslo ještě není zaregistrované.';
			case 'PASSWORD_MISMATCH':
				return 'Hesla se neshodují.';
			default:
				console.log(code);
				return 'Něco se nepovedlo :(';
		}
	}

	let existingUser = $state(false);
	let errorMessage = $derived(getErrorMessage(form?.code));

	let phoneValue = $state('');
	function updatePhoneValue() {
		if (phoneValue[phoneValue.length - 1] < '0' || phoneValue[phoneValue.length - 1] > '9')
			phoneValue = phoneValue.slice(0, -1);
	}
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
		<div class="border bg-white p-4">
			<h2 class="mb-8 font-2 text-2xl font-semibold">
				{existingUser ? 'Vítejte zpátky!' : 'Zaregistrujte se'}
			</h2>

			<form use:enhance action="?/{existingUser ? 'signIn' : 'signUp'}" method="POST">
				<label for="email" class="font-semibold">Email:</label><br />
				<div class="mb-4 flex items-center">
					<input
						type="email"
						name="email"
						placeholder="jan.novak@email.cz"
						class="h-8 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
					/>
					<span class="material-symbols-outlined w-10 text-end">email</span>
				</div>

				{#if !existingUser}
					<label for="phone" class="font-semibold">Telefon:</label><br />
					<div class="mb-1 flex items-center">
						<span class="flex h-8 items-center border border-r-0 bg-gray-100 px-2">+420</span>
						<input
							type="tel"
							name="phone"
							bind:value={phoneValue}
							oninput={updatePhoneValue}
							maxlength="9"
							placeholder="765 432 111"
							class="h-8 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
						/>
						<span class="material-symbols-outlined w-10 text-end">phone</span>
					</div>

					<p class="mb-4 pr-10 text-center text-sm text-gray-500">
						Služba je momentálně dostupná pouze pro uživatele s českým telefonním číslem.
					</p>

					<label for="name" class="font-semibold">Přezdívka:</label><br />
					<div class="mb-1 flex items-center">
						<input
							type="text"
							name="name"
							maxlength="15"
							placeholder="Honza Novak"
							class="h-8 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
						/>
						<span class="material-symbols-outlined w-10 text-end">badge</span>
					</div>

					<p class="mb-4 pr-10 text-center text-sm text-gray-500">
						Přezdívka nesmí obsahovat žádné speciální znaky (á,č,ř atd.).
					</p>
				{/if}

				<label for="password" class="font-semibold">Heslo:</label><br />
				<div class="mb-4 flex items-center">
					<div class="flex grow flex-col gap-2">
						<input
							type="password"
							name="password"
							class="h-8 rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
							placeholder="Zadejte heslo"
						/>
						{#if !existingUser}
							<input
								type="password"
								name="passwordConfirmation"
								class="h-8 rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
								placeholder="Zadejte heslo znovu"
							/>
						{/if}
					</div>
					<span class="material-symbols-outlined w-10 text-end">key_vertical</span>
				</div>
				{#if errorMessage}
					<p class="mt-8 text-center text-red-400">
						{errorMessage}
					</p>
				{/if}

				<button
					class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
					>{existingUser ? 'Přihlásit se' : 'Registrovat'}</button
				>
			</form>

			<h4 class="mt-4 text-center">
				{existingUser ? 'Jste tu noví?' : 'Už máte účet?'}
				<button
					class="text-red-400 underline hover:cursor-pointer"
					onclick={() => {
						existingUser = !existingUser;
						errorMessage = '';
					}}
					>{existingUser ? 'Zaregistrujte se!' : 'Přihlašte se!'}
				</button>
			</h4>
		</div>
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
