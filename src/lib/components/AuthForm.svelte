<script lang="ts">
	import { enhance } from '$app/forms';
	import { getErrorMessage } from '$lib/constants/errors';

	let { form, existingUser = $bindable(false) } = $props();

	let errorMessage = $derived(getErrorMessage(form?.code));
	let phoneValue = $state('');
	let showPassword1 = $state(false);
	let showPassword2 = $state(false);

	function updatePhoneValue(event: Event) {
		const target = event.target as HTMLInputElement;
		phoneValue = target.value.replace(/\D/g, '').slice(0, 9);
	}
</script>

<div class="border bg-white p-4">
	<h2 class="mb-8 font-2 text-2xl font-semibold">
		{existingUser ? 'Vítejte zpátky!' : 'Zaregistrujte se'}
	</h2>

	<form use:enhance action="?/{existingUser ? 'signIn' : 'signUp'}" method="POST">
		<label for="email" class="font-semibold">Email:</label><br />
		<div class="mb-4 flex items-center">
			<input
				id="email"
				type="email"
				name="email"
				required
				placeholder="jan.novak@email.cz"
				class="h-8 min-w-32 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
			/>
			<span class="material-symbols-outlined w-10 text-end">email</span>
		</div>

		{#if !existingUser}
			<label for="phone" class="font-semibold">Telefon:</label><br />
			<div class="mb-1 flex items-center">
				<span class="flex h-8 items-center border border-r-0 bg-gray-100 px-2">+420</span>
				<input
					id="phone"
					type="tel"
					name="phone"
					required
					value={phoneValue}
					oninput={updatePhoneValue}
					maxlength="9"
					placeholder="765 432 111"
					class="h-8 min-w-32 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
				/>
				<span class="material-symbols-outlined w-10 text-end">phone</span>
			</div>

			<p class="mb-4 pr-10 text-center text-sm text-gray-500">
				Služba je momentálně dostupná pouze pro uživatele s českým telefonním číslem.
			</p>

			<label for="name" class="font-semibold">Přezdívka:</label><br />
			<div class="mb-1 flex items-center">
				<input
					id="name"
					type="text"
					name="name"
					required
					maxlength="15"
					placeholder="Honza N"
					class="h-8 min-w-32 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
				/>
				<span class="material-symbols-outlined w-10 text-end">badge</span>
			</div>

			<p class="mb-4 pr-10 text-center text-sm text-gray-500">
				Přezdívka nesmí obsahovat žádné speciální znaky (á,č,ř atd.), max 15 znaků.
			</p>
		{/if}

		<label for="password" class="font-semibold">Heslo:</label><br />
		<div class="mb-4 flex items-center">
			<div class="flex grow flex-col gap-2">
				<div class="flex">
					<input
						id="password"
						type={showPassword1 ? 'text' : 'password'}
						name="password"
						required
						class="h-8 min-w-32 grow rounded-none border border-r-0 bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
						placeholder="Zadejte heslo"
					/>
					<button
						class="material-symbols-outlined flex h-8 items-center border border-l-0 border-black bg-gray-100 px-2 text-gray-500 hover:cursor-pointer"
						type="button"
						onclick={() => (showPassword1 = !showPassword1)}
					>
						{showPassword1 ? 'visibility_off' : 'visibility'}
					</button>
				</div>
				{#if !existingUser}
					<div class="flex">
						<input
							id="passwordConfirmation"
							type={showPassword2 ? 'text' : 'password'}
							name="passwordConfirmation"
							required
							class="h-8 min-w-32 grow rounded-none border border-r-0 bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
							placeholder="Zadejte heslo znovu"
						/>
						<button
							class="material-symbols-outlined flex h-8 items-center border border-l-0 border-black bg-gray-100 px-2 text-gray-500 hover:cursor-pointer"
							type="button"
							onclick={() => (showPassword2 = !showPassword2)}
						>
							{showPassword2 ? 'visibility_off' : 'visibility'}
						</button>
					</div>
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
			type="submit"
			class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
		>
			{existingUser ? 'Přihlásit se' : 'Registrovat'}
		</button>
	</form>

	<h4 class="mt-4 text-center">
		{existingUser ? 'Jste tu noví?' : 'Už máte účet?'}
		<button
			class="text-red-400 underline hover:cursor-pointer"
			onclick={() => {
				existingUser = !existingUser;
				// Reset form errors when switching
				if (form) form.code = undefined;
			}}
		>
			{existingUser ? 'Zaregistrujte se!' : 'Přihlašte se!'}
		</button>
	</h4>
</div>
