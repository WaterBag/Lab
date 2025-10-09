<template>
  <div class="login-card">
    <div
      class="login-title"
      style="margin: 0;"
    >
      Oops! we are sorry...
    </div>

    <div
      class="gray-text"
      style="text-align: center; margin: 24px 0;"
    >
      Something went wrong and we couldn’t create your account. Please try again.
    </div>

    <t-button
      theme="primary"
      block
      size="large"
      content="Back to sign up"
      @click="$router.replace({ name: 'SignUp' })"
    />
  </div>
</template>
