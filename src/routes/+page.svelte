<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	function getErrorMessage(code: string | undefined): string {
		if (code == undefined) return '';
		switch (code) {
			case 'INVALID_EMAIL':
				return 'Neplatný email.';
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
		<!-- <div class="my-4 h-80 w-full border bg-red-100"></div> -->
		<img src="/img.svg" alt="" class="mx-auto mb-8 w-full lg:w-2/3" />
		<p class="text-sm">
			Nunc tristique pulvinar lectus, non iaculis purus bibendum in. Mauris pellentesque augue
			ultricies mauris ullamcorper sagittis. Cras fermentum dolor nec leo mollis scelerisque. Nunc
			efficitur neque nec varius porta. Aenean tempor, velit a viverra commodo, urna mauris
			sollicitudin quam, quis tincidunt libero ipsum facilisis metus. Nunc a dui lectus. Suspendisse
			at ipsum velit. Morbi sed massa ut diam egestas accumsan. Nulla est dui, tristique quis est
			sit amet, rutrum volutpat odio. Aenean et est id arcu dignissim accumsan at ac lacus. Orci
			varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras in
			nulla sit amet ligula euismod elementum id iaculis lacus. Quisque libero mi, convallis id odio
			et, pellentesque semper lacus. Donec bibendum mattis ante eget sollicitudin. Nullam et tempor
			nisi, at egestas nisl. Mauris et egestas lectus.
		</p>
	</div>
	<div class="flex w-full flex-col gap-4">
		<div class="border bg-white p-4">
			<h3 class="mb-8 flex items-center font-2 font-semibold">
				<span class="material-symbols-outlined mr-2">person</span>
				{existingUser ? 'Vítejte zpátky!' : 'Zaregistrujte se:'}
			</h3>

			<form use:enhance action="?/{existingUser ? 'signIn' : 'signUp'}" method="POST">
				<label for="email" class="text-sm">Email:</label><br />
				<div class="mb-2 flex items-center">
					<input type="email" name="email" class="h-8 grow rounded-none border bg-gray-100 p-1" />
					<span class="material-symbols-outlined w-10 text-end">email</span>
				</div>

				{#if !existingUser}
					<label for="phone" class="text-sm">Telefon:</label><br />
					<div class="mb-1 flex items-center">
						<span>+420</span>
						<input
							type="tel"
							name="phone"
							class="ml-2 h-8 grow rounded-none border bg-gray-100 p-1"
						/>
						<span class="material-symbols-outlined w-10 text-end">phone</span>
					</div>

					<p class="mb-2 text-xs text-gray-500">
						Služba je momentálně dostupná pouze pro uživatele s českým telefonním číslem.
					</p>

					<label for="name" class="text-sm">Přezdívka:</label><br />
					<div class="mb-1 flex items-center">
						<input type="text" name="name" class="h-8 grow rounded-none border bg-gray-100 p-1" />
						<span class="material-symbols-outlined w-10 text-end">badge</span>
					</div>

					<p class="mb-2 text-xs text-gray-500">
						Pod tímto jménem vás uvidí vaši blízcí ve zprávách. Můžete ho kdykoliv změnit.
					</p>
				{/if}

				<label for="password" class="text-sm">Heslo:</label><br />
				<div class="mb-2 flex items-center">
					<div class="flex grow flex-col gap-2">
						<input
							type="password"
							name="password"
							class="h-8 rounded-none border bg-gray-100 p-1"
						/>
						{#if !existingUser}
							<input
								type="password"
								name="confirmPassword"
								class="h-8 rounded-none border bg-gray-100 p-1 placeholder:text-xs placeholder:text-gray-500"
								placeholder="Heslo znovu"
							/>
						{/if}
					</div>
					<span class="material-symbols-outlined w-10 text-end">key_vertical</span>
				</div>
				{#if errorMessage}
					<h4 class="mt-8 text-center text-sm text-red-400">
						{errorMessage}
					</h4>
				{/if}

				<button
					class="col-span-4 mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
					>{existingUser ? 'Přihlásit se' : 'Registrovat'}</button
				>

				<!-- <div class="flex"> -->
				<!-- 	<div class="mr-4 flex flex-col gap-2 text-sm"> -->
				<!-- 		<div class="flex h-8 items-center"> -->
				<!-- 			<label for="email" class="font-semibold">Email:</label> -->
				<!-- 		</div> -->
				<!-- 		{#if !existingUser} -->
				<!-- 			<div class="flex h-8 items-center"> -->
				<!-- 				<label for="phone" class="font-semibold">Telefon:</label> -->
				<!-- 			</div> -->
				<!-- 		{/if} -->
				<!-- 		<div class="flex h-8 items-center"> -->
				<!-- 			<label for="password" class="font-semibold">Heslo:</label> -->
				<!-- 		</div> -->
				<!-- 		{#if !existingUser} -->
				<!-- 			<div class="flex h-8 items-center"> -->
				<!-- 				<label for="name" class="font-semibold">Jméno:</label> -->
				<!-- 			</div> -->
				<!-- 		{/if} -->
				<!-- 	</div> -->
				<!-- 	<div class="flex grow flex-col gap-2"> -->
				<!-- 		<input type="email" name="email" class="h-8 rounded-none border bg-gray-100 p-1" /> -->
				<!-- 		{#if !existingUser} -->
				<!-- 			<div class="flex items-center"> -->
				<!-- 				<span>+420</span> -->
				<!-- 				<input -->
				<!-- 					bind:value={phoneValue} -->
				<!-- 					oninput={updatePhoneValue} -->
				<!-- 					type="tel" -->
				<!-- 					maxlength="9" -->
				<!-- 					name="phone" -->
				<!-- 					class="ml-2 h-8 min-w-0 grow rounded-none border bg-gray-100 p-1" -->
				<!-- 				/> -->
				<!-- 			</div> -->
				<!-- 		{/if} -->
				<!-- 		<input -->
				<!-- 			type="password" -->
				<!-- 			name="password" -->
				<!-- 			class="h-8 rounded-none border bg-gray-100 p-1" -->
				<!-- 		/> -->
				<!---->
				<!-- 		{#if !existingUser} -->
				<!-- 			<input -->
				<!-- 				type="text" -->
				<!-- 				name="name" -->
				<!-- 				class="h-8 rounded-none border bg-gray-100 p-1" -->
				<!-- 				maxlength="15" -->
				<!-- 			/> -->
				<!-- 			<p class="text-center text-xs"> -->
				<!-- 				Pod tímto jménem vás uvidí vaši blízcí ve zprávách. Můžete ho kdykoliv změnit. -->
				<!-- 			</p> -->
				<!-- 		{/if} -->
				<!-- 	</div> -->
				<!-- </div> -->
				<!---->
				<!-- {#if errorMessage} -->
				<!-- 	<h4 class="mt-8 text-center text-sm text-red-400"> -->
				<!-- 		{errorMessage} -->
				<!-- 	</h4> -->
				<!-- {/if} -->
				<!---->
				<!-- <button -->
				<!-- 	class="col-span-4 mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black" -->
				<!-- 	>{existingUser ? 'Přihlásit se' : 'Registrovat'}</button -->
				<!-- > -->
			</form>

			<h4 class="mt-4 text-center text-sm">
				{existingUser ? 'Jste tu noví?' : 'Už máte účet?'}
				<button
					class="text-red-400 hover:cursor-pointer"
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
			<p class="text-sm">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices risus vitae semper
				dapibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam risus tellus,
				commodo vel eros at, auctor facilisis nunc. Pellentesque sed velit at leo tempor gravida.
				Morbi mi augue, interdum porttitor pulvinar a, eleifend vitae risus. Ut vestibulum maximus
				risus, non pharetra nunc suscipit id. Donec pharetra arcu tellus, in vulputate felis
				faucibus nec. Sed gravida, sem et viverra eleifend, neque est tempor lorem, ullamcorper
				viverra turpis dolor eu sem. Etiam ultricies metus non blandit pulvinar. Nunc viverra lorem
				vestibulum, pellentesque ligula at, aliquet elit. Ut vitae tincidunt tellus, ut varius
				risus. Maecenas vel fringilla tellus. Praesent volutpat euismod mauris, nec volutpat ligula
				eleifend egestas. Aliquam blandit ligula sit amet leo cursus iaculis.
			</p>
		</div>
	</div>
</div>
