<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	let sidebarOpen = $state(false);
	let showPersonalData = $state(false);

	let phoneString = $state('');
	onMount(() => {
		if (data.user) {
			phoneString =
				'+' +
				data.user!.phone.slice(0, 3) +
				' ' +
				data.user!.phone.slice(3, 6) +
				' ' +
				data.user!.phone.slice(6, 9) +
				' ' +
				data.user!.phone.slice(9, 12);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300"
		rel="stylesheet"
	/>
</svelte:head>

<header class="fixed z-10 flex h-14 w-full items-center border-b bg-white p-2">
	{#if data.user}
		<button
			class="material-symbols-outlined mx-2 transition-transform hover:cursor-pointer {sidebarOpen
				? 'rotate-180'
				: 'rotate-0'}"
			onclick={() => (sidebarOpen = !sidebarOpen)}>side_navigation</button
		>
	{/if}
	<a
		class="absolute left-1/2 flex -translate-x-1/2 items-center font-2 text-lg font-semibold"
		href="/"
	>
		<span class="material-symbols-outlined">forum</span>
		Ding
	</a>
</header>
<div class="h-14"></div>

{#if data.user}
	<div
		class="fixed top-14 bottom-14 z-10 flex w-64 flex-col items-center bg-white p-4 transition-transform {sidebarOpen
			? 'border-r'
			: '-translate-x-64'}"
	>
		<div class="flex w-full items-center justify-center">
			<h4 class="font-2 font-semibold">
				{data.user.name}
			</h4>
			<button
				onclick={() => (showPersonalData = !showPersonalData)}
				class="material-symbols-outlined ml-2 transition-transform hover:cursor-pointer {showPersonalData
					? 'rotate-180'
					: 'rotate-0'}">keyboard_arrow_down</button
			>
		</div>
		<div
			class="my-2 flex w-full flex-col items-center transition-transform {showPersonalData
				? 'scale-y-100'
				: 'scale-y-0'}"
		>
			{#if showPersonalData}
				<h4 class="text-center text-sm">{data.user.email}</h4>
				<h4 class="text-center text-sm">{phoneString}</h4>

				<form action="/?/signOut" method="POST">
					<button
						class="mt-2 mb-2 flex items-center justify-center border bg-black p-2 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
					>
						<span class="material-symbols-outlined mr-2">logout</span>
						Odhlásit se
					</button>
				</form>
			{/if}
		</div>
		<div class="flex w-full grow items-center justify-center border bg-red-50">
			<span>Work in progress</span>
		</div>
	</div>
{/if}

<footer
	class="fixed bottom-0 z-10 flex h-14 w-full items-center justify-center border-t bg-white p-4"
>
	<h4 class="text-center text-xs">
		Služba je ve vývoji. S problémy a připomínkami <a
			href="mailto:jakvejr@gmail.com"
			class="text-red-400 underline">se obraťte na vývojáře.</a
		>
	</h4>
</footer>

{@render children()}
<div class="h-14"></div>
