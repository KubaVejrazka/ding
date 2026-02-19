<script>
	import { enhance } from '$app/forms';
</script>

<div class="m-4">
	<form use:enhance action="?/testSMS" method="POST">
		<button
			class="border bg-black p-2 font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
			>Test SMS API (admin only)</button
		>
	</form>
</div>
