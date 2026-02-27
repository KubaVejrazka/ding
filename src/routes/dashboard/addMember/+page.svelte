<script>
	import { enhance } from '$app/forms';
</script>

<div class="fixed top-14 bottom-14 flex w-screen items-center justify-center p-4">
	<div class="flex flex-col border bg-white p-4 md:w-1/2 lg:w-1/3">
		<h2 class="mb-8 font-2 text-2xl font-semibold">Přidejte nového člena do skupiny</h2>
		<p class="mb-8 text-justify text-sm">
			Zadejte email osoby, kterou chcete do skupiny přidat. Přijde jí do mailu pozvánka. Bude si
			muset také vytvořit Ding účet, pokud ho ještě nemá (z důvodu hrazení zpráv).
		</p>
		<form use:enhance method="POST" action="?/addMember">
			<label for="email" class="font-semibold">Email:</label><br />
			<div class="mb-1 flex items-center">
				<input
					required
					type="email"
					name="email"
					placeholder="jan.novak@email.cz"
					class="h-8 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
				/>
				<span class="material-symbols-outlined w-10 text-end">mail</span>
			</div>
			<button
				class="mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>Pozvat</button
			>
		</form>
	</div>
</div>
