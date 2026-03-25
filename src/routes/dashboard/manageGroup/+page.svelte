<script>
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="fixed top-14 bottom-14 flex w-screen items-center justify-center p-4">
	<div class="flex flex-col border bg-white p-4 md:w-1/2 lg:w-1/3">
		<h2 class="mb-8 font-2 text-2xl font-semibold">Upravte skupinu</h2>
		<form use:enhance method="POST" action="?/rename">
			<label for="name" class="font-semibold">Název skupiny:</label><br />
			<div class="mb-1 flex items-center">
				<input
					required
					type="text"
					name="name"
					maxlength="30"
					value={data.groupName}
					class="h-8 grow rounded-none border bg-gray-100 px-2 py-1 placeholder:text-xs placeholder:text-gray-500"
				/>
				<span class="material-symbols-outlined w-10 text-end">group</span>
			</div>
			<button
				class="mt-8 mb-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>Přejmenovat</button
			>
		</form>
		<hr />
		<form use:enhance method="POST" action="?/deleteGroup">
			<button
				class="mt-8 h-12 w-full border border-red-400 bg-red-400 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-red-400"
				>Smazat skupinu</button
			>
		</form>
	</div>
</div>
