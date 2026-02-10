<script lang="ts">
	let existingUser = $state(false);
</script>

<div class="flex">
	<div class="m-4 grid grow grid-cols-2 gap-4">
		<div class="h-min border bg-white p-4">
			<h1 class="mb-8 font-2 text-4xl font-semibold">Groupchaty i bez internetu.</h1>
			<!-- <p class="text-sm"> -->
			<!-- 	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices risus vitae semper -->
			<!-- 	dapibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam risus tellus, -->
			<!-- 	commodo vel eros at, auctor facilisis nunc. Pellentesque sed velit at leo tempor gravida. -->
			<!-- 	Morbi mi augue, interdum porttitor pulvinar a, eleifend vitae risus. Ut vestibulum maximus -->
			<!-- 	risus, non pharetra nunc suscipit id. Donec pharetra arcu tellus, in vulputate felis -->
			<!-- 	faucibus nec. Sed gravida, sem et viverra eleifend, neque est tempor lorem, ullamcorper -->
			<!-- 	viverra turpis dolor eu sem. Etiam ultricies metus non blandit pulvinar. Nunc viverra lorem -->
			<!-- 	vestibulum, pellentesque ligula at, aliquet elit. Ut vitae tincidunt tellus, ut varius -->
			<!-- 	risus. Maecenas vel fringilla tellus. Praesent volutpat euismod mauris, nec volutpat ligula -->
			<!-- 	eleifend egestas. Aliquam blandit ligula sit amet leo cursus iaculis. -->
			<!-- </p> -->
			<div class="my-4 h-80 w-full border bg-red-100"></div>
			<p class="text-sm">
				Nunc tristique pulvinar lectus, non iaculis purus bibendum in. Mauris pellentesque augue
				ultricies mauris ullamcorper sagittis. Cras fermentum dolor nec leo mollis scelerisque. Nunc
				efficitur neque nec varius porta. Aenean tempor, velit a viverra commodo, urna mauris
				sollicitudin quam, quis tincidunt libero ipsum facilisis metus. Nunc a dui lectus.
				Suspendisse at ipsum velit. Morbi sed massa ut diam egestas accumsan. Nulla est dui,
				tristique quis est sit amet, rutrum volutpat odio. Aenean et est id arcu dignissim accumsan
				at ac lacus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
				ridiculus mus. Cras in nulla sit amet ligula euismod elementum id iaculis lacus. Quisque
				libero mi, convallis id odio et, pellentesque semper lacus. Donec bibendum mattis ante eget
				sollicitudin. Nullam et tempor nisi, at egestas nisl. Mauris et egestas lectus.
			</p>
		</div>
		<div class="flex w-full flex-col gap-4">
			<div class="border bg-white p-4">
				<h2 class="mb-8 font-2 text-2xl font-semibold">Jak to funguje?</h2>
				<p class="text-sm">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices risus vitae semper
					dapibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam risus tellus,
					commodo vel eros at, auctor facilisis nunc. Pellentesque sed velit at leo tempor gravida.
					Morbi mi augue, interdum porttitor pulvinar a, eleifend vitae risus. Ut vestibulum maximus
					risus, non pharetra nunc suscipit id. Donec pharetra arcu tellus, in vulputate felis
					faucibus nec. Sed gravida, sem et viverra eleifend, neque est tempor lorem, ullamcorper
					viverra turpis dolor eu sem. Etiam ultricies metus non blandit pulvinar. Nunc viverra
					lorem vestibulum, pellentesque ligula at, aliquet elit. Ut vitae tincidunt tellus, ut
					varius risus. Maecenas vel fringilla tellus. Praesent volutpat euismod mauris, nec
					volutpat ligula eleifend egestas. Aliquam blandit ligula sit amet leo cursus iaculis.
				</p>
			</div>
			<div class="border bg-white p-4">
				<h3 class="mb-8 flex items-center font-2 font-semibold">
					<span class="material-symbols-outlined mr-2">person</span>
					{existingUser ? 'Vítejte zpátky!' : 'Zaregistrujte se:'}
				</h3>
				<form>
					<div class="flex">
						<div class="mr-4 flex flex-col gap-2 text-sm">
							<div class="flex h-8 items-center">
								<label for="">Email:</label>
							</div>
							{#if !existingUser}
								<div class="flex h-8 items-center">
									<label for="">Telefon:</label>
								</div>
							{/if}
							<div class="flex h-8 items-center">
								<label for="">Heslo:</label>
							</div>
							{#if !existingUser}
								<div class="flex h-8 items-center">
									<label for="">Jméno:</label>
								</div>
							{/if}
						</div>
						<div class="flex grow flex-col gap-2">
							<input type="text" class="h-8 rounded-none border bg-gray-100 p-1" />
							{#if !existingUser}
								<div class="flex items-center">
									<h4>+420</h4>
									<input type="text" class="ml-2 h-8 grow rounded-none border bg-gray-100 p-1" />
								</div>
							{/if}
							<input type="text" class="h-8 rounded-none border bg-gray-100 p-1" />

							{#if !existingUser}
								<input type="text" class="h-8 rounded-none border bg-gray-100 p-1" />
								<p class="text-center text-xs">
									Pod tímto jménem vás uvidí vaši blízcí ve zprávách. Můžete ho kdykoliv změnit.
								</p>
							{/if}
						</div>
					</div>
					<button
						class="col-span-4 mt-8 h-12 w-full border bg-black font-2 font-semibold text-white transition-colors hover:cursor-pointer hover:bg-white hover:text-black"
						>{existingUser ? 'Přihlásit se' : 'Registrovat'}</button
					>
				</form>

				<h4 class="mt-4 text-center text-sm">
					{existingUser ? 'Jste tu noví?' : 'Už máte účet?'}
					<button
						class="text-red-400 hover:cursor-pointer"
						onclick={() => (existingUser = !existingUser)}
						>{existingUser ? 'Zaregistrujte se!' : 'Přihlašte se!'}
					</button>
				</h4>
			</div>
		</div>
	</div>
</div>

<!-- <div class="fixed top-14 bottom-0 w-64 border-r"></div> -->
