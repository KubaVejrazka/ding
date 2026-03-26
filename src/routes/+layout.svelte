<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { formatPhoneNumber } from '$lib/utils/phone';

	let { children, data } = $props();

	let sidebarOpen = $state(false);
	let showPersonalData = $state(false);

	const phoneString = $derived(data.user ? formatPhoneNumber(data.user.phone) : '');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300"
		rel="stylesheet"
	/>
</svelte:head>

<header class="fixed z-20 flex h-14 w-full items-center border-b bg-white p-2">
	{#if data.user}
		<button
			class="material-symbols-outlined mx-2 transition-transform hover:cursor-pointer {sidebarOpen
				? 'rotate-180'
				: 'rotate-0'}"
			onclick={() => (sidebarOpen = !sidebarOpen)}
			aria-label="Toggle navigation"
		>
			side_navigation
		</button>
	{/if}
	<a
		class="absolute left-1/2 flex -translate-x-1/2 items-center font-2 text-lg font-semibold"
		href="/"
	>
		<span class="material-symbols-outlined mr-1">forum</span>
		Ding
	</a>
</header>

<div class="h-14"></div>

{#if data.user}
	<!-- Side Navigation -->
	<div
		class="fixed top-14 bottom-14 z-10 flex w-64 flex-col items-center bg-white p-4 transition-transform {sidebarOpen
			? 'border-r translate-x-0'
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
					: 'rotate-0'}"
				aria-label="Show profile"
			>
				keyboard_arrow_down
			</button>
		</div>

		<div
			class="my-2 flex w-full flex-col items-center overflow-hidden transition-all {showPersonalData
				? 'max-h-40 opacity-100'
				: 'max-h-0 opacity-0'}"
		>
			<h4 class="text-center text-sm">{data.user.email}</h4>
			<h4 class="text-center text-sm">{phoneString}</h4>

			<form action="/?/signOut" method="POST" class="mt-2">
				<button
					class="mb-2 flex items-center justify-center border border-black bg-black p-2 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
				>
					<span class="material-symbols-outlined mr-2 text-base">logout</span>
					Odhlásit se
				</button>
			</form>
		</div>

		<div class="mt-4 flex w-full grow items-center justify-center border border-dashed border-gray-300 bg-gray-50 text-gray-400">
			<span class="text-xs uppercase tracking-widest">Brzy přibude</span>
		</div>
	</div>

	<!-- Overlay when sidebar is open on small screens (optional, but good for UX) -->
	{#if sidebarOpen}
		<button
			class="fixed inset-0 top-14 z-0 bg-black/5 md:hidden"
			onclick={() => (sidebarOpen = false)}
			aria-label="Close navigation"
		></button>
	{/if}
{/if}

<main class="min-h-[calc(100vh-112px)]">
	{@render children()}
</main>

<div class="h-14"></div>

<footer
	class="fixed bottom-0 z-20 flex h-14 w-full items-center justify-center border-t bg-white p-4"
>
	<h4 class="text-center text-xs">
		Služba je ve vývoji. S problémy a připomínkami <a
			href="mailto:jakvejr@gmail.com"
			class="text-red-400 underline">se obraťte na vývojáře.</a
		>
	</h4>
</footer>
