<template>
  <div class="wrapper-content" @click="closeSortFilter">
    <Header
      :productsInBucketLength="productsInBucket.length"
      @open="showBusket = true"
    />

    <div class="container">
      <section class="subheader">
        <h1 class="subheader__title title-page">
          Каталог
        </h1>

        <div class="subheader__filter filter">
          <div class="filter__current" @click.stop="">
            <p class="filter__current-txt text-lg">
              Сортировать по:
            </p>
            <button
              type="button"
              class="filter__current-btn color-gray text-lg"
              :class="{ 'filter__current-btn--filter-opened': !filterHidden }"
              @click="filterHidden = !filterHidden"
            >
              <span>{{ currentSort }}</span>
            </button>
          </div>
          <transition name="bounce">
            <div class="filter__window" v-show="!filterHidden">
              <div class="filter__window-item">
                <input
                  type="radio"
                  hidden
                  name="radio-filter-sort"
                  id="radio-filter-sort-1"
                  class="filter__window-input"
                  checked
                  value="цене"
                  v-model="currentSort"
                />
                <label
                  for="radio-filter-sort-1"
                  class="filter__window-label text-md color-secondary"
                >
                  По цене
                </label>
              </div>
              <div class="filter__window-item">
                <input
                  type="radio"
                  hidden
                  name="radio-filter-sort"
                  id="radio-filter-sort-2"
                  class="filter__window-input"
                  value="популярности"
                  v-model="currentSort"
                />
                <label
                  for="radio-filter-sort-2"
                  class="filter__window-label text-md color-secondary"
                >
                  По популярности
                </label>
              </div>
            </div>
          </transition>
        </div>
      </section>
      <main class="main">
        <aside class="aside">
          <ul class="aside__list">
            <li
              class="aside__list-item"
              v-for="category in getProductsCategory"
              :key="category.id"
            >
              <input
                type="radio"
                name="filter-category"
                :value="category.id"
                class="aside__list-input"
                :id="category.id"
                hidden
                checked
                v-model="currentCategory"
              />
              <label
                :for="category.id"
                class="aside__list-lable aside__list-lable--active text-md color-secondary"
              >
                {{ category.name }}
              </label>
            </li>
          </ul>
        </aside>
        <section class="market">
          <div class="market__list flex-rov">
            <div
              class="market__list-item flex-col-25"
              v-for="product in filterCategory"
              :key="product.key"
            >
              <div class="product">
                <div class="product__rating rating">
                  <svg class="rating__svg star-svg">
                    <use xlink:href="#rating-icon"></use>
                  </svg>
                  <span class="color-warning text-bold text-sm">{{
                    product.rating
                  }}</span>
                </div>
                <div class="product__add-tobucket ">
                  <div class="radio-btn">
                    <input
                      type="radio"
                      :name="product.id"
                      :id="product.id"
                      class="radio-btn__inp"
                    />
                    <label
                      :for="product.id"
                      @click="addToBucket(product.id, $event)"
                      class="radio-btn__label"
                    >
                      <svg class="bucket-svg bucket-svg--gray bucket-svg--sm">
                        <use xlink:href="#bucket-icon"></use>
                      </svg>
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  class="product__add-tobucket"
                  @click="addToBucket(product.id, $event)"
                >
                  <svg class="bucket-svg bucket-svg--gray bucket-svg--sm">
                    <use xlink:href="#bucket-icon"></use>
                  </svg>
                </button>
                <div class="product__img">
                  <img
                    :src="
                      'https://frontend-test.idaproject.com' + product.photo
                    "
                    :alt="product.name"
                    class="product__img-item"
                  />
                </div>
                <div class="product__info">
                  <p class="product__info-name text-md color-gray">
                    {{ product.name }}
                  </p>
                  <p class="product__info-price text-md color-dark text-bold">
                    <span>{{ product.price.toLocaleString('ru') }}</span> ₽
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="paging">
            <button
              type="button"
              class="paging__arrow paging__arrow--prev"
              v-if="page != 1"
              @click="page--"
            >
              Назад
            </button>
            <button
              type="button"
              class="paging__item"
              v-for="(pageNumber, index) in pages.slice(page - 1, page + 5)"
              :key="index"
              @click="page = pageNumber"
              :class="{ 'paging__item--current': pageNumber == page }"
            >
              {{ pageNumber }}
            </button>
            <button
              type="button"
              class="paging__arrow paging__arrow--next"
              v-if="page < pages.length"
              @click="page++"
            >
              Вперёд
            </button>
          </div>
        </section>
      </main>
      <modalBucket
        :productList="productsInBucket"
        v-show="showBusket"
        @close="showBusket = false"
        @remove="removeProductFromBucket"
      />
    </div>
  </div>
</template>

<script>
import Header from '~/components/system/Header.vue'
import modalBucket from '@/components/Modals/ModalBucket.vue'
import { mapGetters } from 'vuex'
export default {
  components: { Header, modalBucket },
  data() {
    return {
      showBusket: false,
      filterHidden: true,
      currentSort: 'цене',
      currentCategory: 1,
      sortOf: 'price',
      productsInBucket: [],
      page: 1,
      perPage: 8,
      pages: []
    }
  },

  computed: {
    ...mapGetters(['getProductsCategory']),
    productsLoaded() {
      return this.$store.getters.getProductsLoaded
    },
    filterCategory() {
      let arrFiltered = this.productsLoaded
      arrFiltered = arrFiltered.filter(item => {
        if (item.category == this.currentCategory) {
          return item
        }
      })
      arrFiltered.sort((a, b) => {
        if (this.sortOf === 'price') {
          return b.price - a.price
        }
        if (this.sortOf === 'rating') {
          return b.rating - a.rating
        }
      })

      let numOfPages = Math.ceil(arrFiltered.length / this.perPage || 1)
      this.pages = []
      if (this.page > numOfPages) {
        this.page = 1
      }
      for (let i = 1; i <= numOfPages; i++) {
        this.pages.push(i)
      }

      return this.paginate(arrFiltered)
    }
  },
  methods: {
    closeSortFilter() {
      this.filterHidden = true
    },
    addToBucket(id, event) {
      console.log(event.target)
      event.target.setAttribute('disabled', 'disabled')

      this.filterCategory.filter(item => {
        if (item.id == id) {
          this.productsInBucket.push(item)
          return item
        }
      })

      if (!process.server) {
        let arrForStorage = JSON.stringify(this.productsInBucket)
        localStorage.setItem('bucket', arrForStorage)
      }
    },
    removeProductFromBucket(index) {
      this.productsInBucket.splice(index, 1)
      let arrForStorage = JSON.stringify(this.productsInBucket)
      localStorage.setItem('bucket', arrForStorage)
    },
    paginate(arr) {
      let page = this.page
      let perPage = this.perPage
      let from = page * perPage - perPage
      let to = page * perPage
      return arr.slice(from, to)
    }
  },
  mounted() {
    if (localStorage.bucket) {
      this.productsInBucket = JSON.parse(localStorage.bucket)
    }
  },
  watch: {
    showBusket() {
      if (this.showBusket) {
        document.body.style.overflow = 'hidden'
        return
      }
      document.body.style.overflow = 'auto'
    },
    currentSort() {
      if (this.currentSort == 'цене') {
        this.sortOf = 'price'
      } else {
        this.sortOf = 'rating'
      }
    }
  }
}
</script>
