<script>
	import { enhance } from '$app/forms';
	let showResendButton = $state(true);
</script>

<div class="fixed top-14 bottom-0 flex w-screen items-center justify-center p-4">
	<div class="flex flex-col border bg-white p-4 md:w-1/2 lg:w-1/3">
		<h2 class="mb-8 font-2 text-2xl font-semibold">Koukněte do mailu :)</h2>
		<p class="text-sm">Měli byste tam najít email s ověřovacím odkazem.</p>
		<p class="mb-8 text-sm">Nezapomeňte zkontrolovat spam složku.</p>
		{#if showResendButton}
			<form
				use:enhance={() => {
					showResendButton = false;
				}}
				method="POST"
				action="?/sendVerificationEmail"
			>
				<p class="text-sm">
					Nic nepřišlo? <button class="text-start text-red-400 underline hover:cursor-pointer"
						>Klikněte sem pro odeslání nového mailu.</button
					>
				</p>
			</form>
		{:else}
			<p class="text-sm">Odesláno.</p>
		{/if}
	</div>
</div>
