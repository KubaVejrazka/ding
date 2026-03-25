<script lang="ts">
	let { message, time } = $props();

	function formatDate(date: Date) {
		const d = new Date(date);
		return `${d.getDate()}.${d.getMonth() + 1}. ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
	}
</script>

{#if message}
	<div
		class="mx-auto flex min-h-32 flex-col justify-between rounded-xl border border-red-400 bg-red-50 p-4 lg:w-1/2"
	>
		<p class="font-2 text-lg text-red-400">{message}</p>
		<span class="mt-2 text-end text-xs text-red-400">{formatDate(time)}</span>
	</div>
{:else}
	<p class="text-center text-gray-500">Zatím nebyla doručena žádná vaše zpráva.</p>
{/if}
