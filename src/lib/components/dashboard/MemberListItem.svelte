<script lang="ts">
	import { enhance } from '$app/forms';

	let { member, currentUser, isOwner, expanded = false, ontoggle } = $props();

	const canRemove = $derived(
		(isOwner && member.id !== currentUser.id) || (!isOwner && member.id === currentUser.id)
	);
</script>

<li class="mt-2 flex items-center justify-between">
	<div class="flex flex-col">
		<span class="font-semibold">{member.name}</span>
		<span class="text-xs">{member.email}</span>
	</div>
	{#if canRemove}
		<div>
			<button
				class="flex items-center hover:cursor-pointer"
				onclick={() => ontoggle?.()}
				aria-label="Možnosti"
			>
				<span class="material-symbols-outlined">more_vert</span>
			</button>
		</div>
	{/if}
</li>

{#if canRemove}
	<div class="flex justify-end transition-transform {expanded ? 'scale-y-100' : 'scale-y-0 h-0 overflow-hidden'}">
		<form
			use:enhance={() => {
				return async ({ update }) => {
					await update();
				};
			}}
			method="POST"
			action="?/removeFromGroup"
		>
			<input type="hidden" name="id" value={member.id} />
			<button
				class="mt-2 flex items-center gap-2 border border-red-400 bg-red-400 p-2 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-red-400"
			>
				<span class="material-symbols-outlined">logout</span>
				{member.id === currentUser.id ? 'Opustit skupinu' : 'Odstranit ze skupiny'}
			</button>
		</form>
	</div>
{/if}
