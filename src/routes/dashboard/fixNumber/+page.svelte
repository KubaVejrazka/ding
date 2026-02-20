<script>
	import { enhance } from '$app/forms';
	let showResendButton = $state(true);

	let phoneValue = $state('');
	function updatePhoneValue() {
		if (phoneValue[phoneValue.length - 1] < '0' || phoneValue[phoneValue.length - 1] > '9')
			phoneValue = phoneValue.slice(0, -1);
	}
</script>

<div class="fixed top-14 bottom-14 flex w-screen items-center justify-center p-4">
	<div class="flex flex-col border bg-white p-4 md:w-1/2 lg:w-1/3">
		<h2 class="mb-8 font-2 text-2xl font-semibold">Opravte telefonní číslo</h2>
		<form method="POST" action="?/fixPhone">
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
			<button
				class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>Potvrdit</button
			>
		</form>
	</div>
</div>
