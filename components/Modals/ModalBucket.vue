<template>
  <transition name="slide-fade">
    <div class="bucket-window" @click="$emit('close')">
      <div class="bucket-window__wrapper" @click.stop="">
        <div class="bucket-window__content">
          <div class="bucket-window__header">
            <h2 class="bucket-window__header-title title-page text-bold">
              Корзина
            </h2>
            <button
              class="bucket-window__header-close"
              type="button"
              @click="$emit('close')"
            >
              <svg class="close-svg">
                <use xlink:href="#close-icon"></use>
              </svg>
            </button>
          </div>
          <transition name="slide-fade">
            <div
              class="bucket-window__body"
              v-show="productList.length == 0 && formSended == false"
            >
              <h3
                class="bucket-window__body-title title-lg color-black text-normal"
              >
                Пока что вы ничего не добавили в корзину.
              </h3>
              <button
                type="button"
                class="bucket-window__body-btn btn btn-dark text-lg"
                @click="$emit('close')"
              >
                Перейти к выбору
              </button>
            </div>
          </transition>
          <transition name="slide-fade">
            <div class="bucket-window__body" v-show="productList.length != 0">
              <p class="bucket-window__body-txt text-lg color-gray text-normal">
                Товары в корзине
              </p>
              <div class="bucket-window__body-list bucket-list">
                <div
                  class="bucket-list__item"
                  v-for="(product, index) in productList"
                  :key="product.id"
                >
                  <img
                    :src="
                      'https://frontend-test.idaproject.com' + product.photo
                    "
                    :alt="product.name"
                    class="bucket-list__item-img"
                  />
                  <div class="bucket-list__item-info">
                    <p class="bucket-list__item-name text-md color-gray">
                      {{ product.name }}
                    </p>
                    <p
                      class="bucket-list__item-price text-md color-dark text-bold"
                    >
                      <span>{{ product.price.toLocaleString('ru') }}</span> ₽
                    </p>
                    <div class="bucket-list__item-rating rating">
                      <svg class="rating__svg star-svg">
                        <use xlink:href="#rating-icon"></use>
                      </svg>
                      <span class="color-warning text-bold text-sm">{{
                        product.rating
                      }}</span>
                    </div>
                  </div>
                  <button
                    class="bucket-list__item-delete btn-delete"
                    @click="removeProduct(index)"
                  >
                    <svg class="btn__delete-svg delete-svg">
                      <use xlink:href="#delete-icon"></use>
                    </svg>
                  </button>
                </div>
              </div>
              <form
                @submit.prevent="onSubmit"
                action="/"
                class="bucket-window__body-form form-offer"
              >
                <label for="user_name" class="form-offer__caption">
                  Оформить заказ
                </label>
                <div class="form-offer__field">
                  <input
                    type="text"
                    name="user_name"
                    id="user_name"
                    class="form-offer__field-inp input text-lg color-dark"
                    placeholder="Ваше имя"
                    v-model="formOffer.name"
                  />
                </div>
                <div class="form-offer__field">
                  <input
                    type="tel"
                    name="user_tel"
                    id="user_tel"
                    class="form-offer__field-inp input text-lg color-dark"
                    placeholder="Телефон"
                    v-imask="phoneNumberMask"
                    @keypress="isNumber"
                    @accept="onAccept"
                    @complete="onComplete"
                    maxlength="16"
                    v-model="formOffer.tel"
                  />
                </div>
                <div class="form-offer__field">
                  <input
                    type="text"
                    name="user_address"
                    id="user_address"
                    class="form-offer__field-inp input text-lg color-dark"
                    placeholder="Адрес"
                    v-model="formOffer.address"
                  />
                </div>
                <transition name="slide-fade">
                  <div v-show="errors.length">
                    <b class="text-lg color-dark"
                      >Пожалуйста исправьте указанные ошибки:</b
                    >
                    <ul class="text-md color-danger">
                      <li v-for="(error, index) in errors" :key="index">
                        {{ error }}
                      </li>
                    </ul>
                  </div>
                </transition>
                <button type="submit" class="btn btn-dark form-offer__submit">
                  Отправить
                </button>
              </form>
            </div>
          </transition>

          <transition name="slide-fade">
            <div
              class="bucket-window__sended"
              v-show="formSended && productList.length == 0"
            >
              <img src="/img/ok.png" alt="" class="bucket-window__sended-img" />
              <h3 class="bucket-window__sended-title title-xl color-black">
                Заявка успешно отправлена
              </h3>
              <p class="text-md color-gray">
                Вскоре наш менеджер свяжется с Вами
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { IMaskDirective } from 'vue-imask'
export default {
  data() {
    return {
      formOffer: {
        name: '',
        address: '',
        tel: ''
      },
      formSended: false,
      phoneNumberMask: {
        mask: '+{7} (000) 000-00-00',
        lazy: true
      },

      errors: []
    }
  },
  directives: {
    imask: IMaskDirective
  },

  props: {
    productList: {
      type: Array,
      default: []
    }
  },

  methods: {
    removeProduct(index) {
      this.$emit('remove', index)
    },
    onSubmit() {
      console.log(this.formOffer)
    },
    onComplete(e) {
      const maskRef = e.detail
      this.userPhone = maskRef.unmaskedValue
    },
    isNumber(e) {
      let regex = /[0-9]/

      if (!regex.test(e.key)) {
        e.returnValue = false
        if (e.preventDefault) e.preventDefault()
      }
    },
    onAccept(e) {
      const maskRef = e.detail
      this.phone = maskRef.value
    },
    onSubmit(e) {
      this.errors = []

      if (!this.formOffer.name || this.formOffer.name.length < 3) {
        this.errors.push('Требуется указать имя.')
      }
      if (!this.formOffer.tel || this.formOffer.tel.length < 16) {
        this.errors.push('Требуется указать номер телефона.')
      }
      if (!this.formOffer.address || this.formOffer.address.length < 5) {
        this.errors.push('Требуется указать адрес.')
      }

      console.log('FINALY')
      e.preventDefault()
      if (
        this.formOffer.name &&
        this.formOffer.address &&
        this.formOffer.tel &&
        this.formOffer.name.length >= 3 &&
        this.formOffer.tel.length >= 16 &&
        this.formOffer.address.length >= 5
      ) {
        console.log('DONE')
        this.formOffer.name = ''
        this.formOffer.tel = ''
        this.formOffer.address = ''
        this.formSended = true
        this.productList.length = []
        localStorage.setItem('bucket', '')
        return true
      }
    }
  }
}
</script>
