<template>
  <div>
    <!-- <flow-panel></flow-panel> -->
    <div class="box">
      <div class="box-left"></div>
      <div class="box-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import FlowPanel from "@/components/ef/panel.vue";
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  width: 100%;
  height: 50px;
  padding-left: 20px;
}
.box-left {
  background: red;
  height: 100%;
  flex: 1;
}
.box-right {
  background: black;
  height: 100;
  width: 100%;
  flex: 1;
}
</style>
