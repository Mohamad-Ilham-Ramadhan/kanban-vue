<script setup>
// segment
import Header from './components/Header.vue';
import Aside from './components/Aside.vue';
import Main from './components/Main.vue';


</script>

<template>
  <Header />

  <div class="flex flex-row overflow-hidden">
    <Aside />

    <Main />
  </div>
</template>

