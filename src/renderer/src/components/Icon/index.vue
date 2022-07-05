<template>
  <i :class="['icn', `icn-${icon}` ]" />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TIcon',

  props: {
    icon: {
      type: String,
      required: true
    },

    size: {
      type: [String, Number],
      default: 20
    }
  }
})
</script>

<style lang="scss">

</style>