<template>
  <div>
    {{ flowJsonData }}
  </div>
</template>

<script lang="ts" setup>
//ts传值展示默认值withDefaults  必须在ts下使用
const props = withDefaults(
  defineProps<{
    data: Object;
  }>(),
  {
    data: () => "",
  }
);
const flowJsonData = ref<String>("");
flowJsonData.value = JSON.stringify(props.data, null, 4).toString();
console.log(flowJsonData.value);

</script>
