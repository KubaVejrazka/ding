<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();

	let sidebarOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300"
		rel="stylesheet"
	/>

	<title>Ding</title>
</svelte:head>

<header class="fixed flex h-14 w-full items-center border-b bg-white p-2">
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

<div
	class="fixed top-14 bottom-0 z-10 w-64 bg-white p-4 transition-transform {sidebarOpen
		? 'border-r'
		: '-translate-x-64'}"
>
	<form action="/?/signOut" method="POST">
		<button>signout</button>
	</form>
	<div class="mb-4 h-16 w-full border"></div>
	<div class="mb-4 h-16 w-full border"></div>
	<div class="mb-4 h-16 w-full border"></div>
</div>

{@render children()}
