import axios from 'axios'

export const state = () => ({
  productsLoaded: [],
  category: []
})

export const mutations = {
  setProducts(state, products) {
    state.productsLoaded = products
  },
  addProductsCategory(state, category) {
    state.category = category
  }
}

export const actions = {
  async nuxtServerInit({ commit }, contex) {
    const resultProducts = await axios
      .get('https://frontend-test.idaproject.com/api/product')
      .then(res => {
        if (res.status == 200) {
          commit('setProducts', res.data)
        }
      })
      .catch(e => console.log(e))

    const resultProductsCategory = await axios
      .get('https://frontend-test.idaproject.com/api/product-category')
      .then(res => {
        if (res.status == 200) {
          commit('addProductsCategory', res.data)
        }
      })
      .catch(e => console.log(e))
    return { resultProducts, resultProductsCategory }
  }
}

export const getters = {
  getProductsLoaded(state) {
    return state.productsLoaded
  },
  getProductsCategory(state) {
    return state.category
  }
}
