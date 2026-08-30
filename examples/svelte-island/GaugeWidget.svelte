<script lang="ts">
    import { onMount } from 'svelte';

    export let title: string = 'Cluster Health';
    export let percentage: number = 40;

    onMount(() => {
        const interval = setInterval(() => {
            percentage = Math.min(100, Math.max(10, percentage + (Math.floor(Math.random() * 7) - 3)));
        }, 1000);

        return () => clearInterval(interval);
    });
</script>

<div class="p-4 bg-surface-0 border border-border rounded-xl">
    <h4 class="font-bold text-sm text-surface-900">{title}</h4>
    <div class="text-2xl font-mono font-bold my-1 text-primary">{percentage}%</div>
    <div class="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
        <div class="bg-primary-500 h-full transition-all duration-300" style="width: {percentage}%;"></div>
    </div>
</div>
