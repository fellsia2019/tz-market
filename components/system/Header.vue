<template>
  <section class="wrapper-header">
    <div class="container">
      <header class="header">
        <div class="header__logo logo">
          <nuxt-link class="title-lg color-gray" to="/">TestList</nuxt-link>
        </div>
        <div class="header__bucket bucket">
          <button type="button" class="bucket__btn" @click="$emit('open')">
            <svg
              class="bucket__btn-svg bucket-svg bucket-svg--dark bucket-svg--md"
            >
              <use xlink:href="#bucket-icon"></use>
            </svg>
            <transition name="bounce">
              <span class="bucket__btn-score" v-show="productsInBucketLength">
                {{ productsInBucketLength }}
              </span>
            </transition>
          </button>
        </div>
      </header>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    productsInBucketLength: {
      type: Number
    }
  }
}
</script>
