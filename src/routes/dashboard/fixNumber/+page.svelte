<script lang="ts">
	import { enhance } from '$app/forms';

	let phoneValue = $state('');

	function updatePhoneValue(event: Event) {
		const target = event.target as HTMLInputElement;
		phoneValue = target.value.replace(/\D/g, '').slice(0, 9);
	}
</script>

<div class="fixed inset-0 flex items-center justify-center p-4">
	<div class="flex w-full flex-col border bg-white p-4 md:w-1/2 lg:w-1/3">
		<h2 class="mb-8 font-2 text-2xl font-semibold">Opravte telefonní číslo</h2>
		<form use:enhance method="POST" action="?/fixPhone">
			<label for="phone" class="font-semibold">Nové telefonní číslo:</label><br />
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
					class="h-8 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
				/>
				<span class="material-symbols-outlined w-10 text-end">phone</span>
			</div>
			<p class="mt-2 text-justify text-sm text-gray-500">
				Zadejte 9-místné číslo bez mezer. Po odeslání přivítací SMS už nebude možné číslo změnit.
			</p>

			<div class="mt-8 flex gap-4">
				<a
					href="/dashboard"
					class="flex h-12 flex-1 items-center justify-center border border-black bg-white font-2 font-semibold text-black transition-colors hover:bg-gray-100"
				>
					Zpět
				</a>
				<button
					type="submit"
					class="h-12 flex-1 border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>
					Potvrdit
				</button>
			</div>
		</form>
	</div>
</div>
