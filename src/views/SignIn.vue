<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <AppFormField label="Email" name="email" type="email" v-model="form.email" rules="required|email" />
        <AppFormField label="Password" name="password" type="password" v-model="form.password" rules="required" />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register' }">Create an account?</router-link>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall" @click="signInWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "test1@test.com",
        password: "test1test1",
      },
    };
  },
  methods: {
    async signIn() {
      try {
        await this.$store.dispatch("auth/signInWithEmailAndPassword", { ...this.form });
        this.successfulRedirect();
      } catch (error) {
        alert(error.message);
      }
    },
    async signInWithGoogle() {
      await this.$store.dispatch("auth/signInWithGoogle");
      this.successfulRedirect();
    },
    successfulRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: "Home" };
      this.$router.push(redirectTo);
    },
  },
  created() {
    this.$emit("ready");
  },
};
</script>
