<script setup>
// segment
import Header from './components/Header.vue';
import Aside from './components/Aside.vue';
import Main from './components/Main.vue';


</script>

<template>
  <Header />

  <div class="h-screen flex flex-col">
    <Aside />
    <Main />
  </div>
</template>

