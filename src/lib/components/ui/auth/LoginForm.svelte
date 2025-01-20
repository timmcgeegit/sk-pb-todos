<script>
    import { pb } from '$lib/pocketbase';
    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import { getAuthContext } from '$lib/pocketbase/auth.svelte';
  
    const auth = getAuthContext();
    
    let email = '';
    let password = '';
    let isLoading = false;
    let error = '';
  
    async function handleSubmit() {
      isLoading = true;
      error = '';
      
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        auth.user = authData.record;
      } catch (err) {
        error = err.message;
      } finally {
        isLoading = false;
      }
    }
  </script>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#if error}
      <div class="text-red-500 text-sm">{error}</div>
    {/if}
    
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input 
        id="email"
        type="email" 
        bind:value={email}
        placeholder="name@example.com"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="password">Password</Label>
      <Input 
        id="password"
        type="password" 
        bind:value={password}
        required
      />
    </div>
  
    <Button type="submit" class="w-full" disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Sign In'}
    </Button>
  </form>