<script setup lang="ts">
import TreeGrid from './components/TreeGrid.vue';
import { demoItems } from './data/items';
</script>

<template>
  <main class="page-shell">
    <section class="hero-card">
      <p class="eyebrow">МСТРОЙ Frontend Тестовое задание</p>
      <h1>Дерево элементов</h1>
    </section>

    <section class="grid-card">
      <TreeGrid :items="demoItems" />
    </section>
  </main>
</template>
