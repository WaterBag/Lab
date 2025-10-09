<template>
  <CreationLayout title="申请加入团队">
    <t-loading>
      <t-form :data="applyForm">
        <t-form-item name="team_id">
          <t-select
            v-model="applyForm.team_id"
            filterable
          />
        </t-form-item>
      </t-form>
    </t-loading>
  </CreationLayout>
</template>

<script lang="ts" setup>
const applyForm = reactive({
  team_id: '',
})
</script>

<style lang="scss" scoped>

</style>
