import { createStore } from "vuex";

import gql from "graphql-tag";
import graphqlClient from "../utils/graphql";
import { ApolloError } from "apollo-client";

export default createStore({
  state: {
    currentTargetElement: {},
    moveableElements: {} as any,
    storeId: [] as any,
    shops: [] as any,
    colours: [] as any,
    storeItems: [] as any,
    genericLoading: false,
    dialogSteps: false,
    detailShirt: null,
    allShirts: [],
    myShirts: [],
    sizes: [] as any,
    user: null,
    toast: {
      show: false,
      message: "",
      status: "",
    },
  },
  getters: {},
  mutations: {
    setShirtStoreDetail(state, payload) {
      const alreadyItemExist = state.storeItems.find(
        (el: any) => el._id == payload._id
      );
      if (!alreadyItemExist) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);

        payload;
        const diffDays =
          Math.round(
            currentDate.getTime() - new Date(payload.creationDate).getTime()
          ) /
          (1000 * 3600 * 24);
        payload.isNew = diffDays > 7 ? true : false;
        state.storeItems.push(payload);
      }
    },
    setCreatedProduct(state, payload) {
      state.myShirts = payload;
    },
    setShirtDetail(state, payload) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);

      payload;
      const diffDays =
        Math.round(
          currentDate.getTime() - new Date(payload.creationDate).getTime()
        ) /
        (1000 * 3600 * 24);
      payload.isNew = diffDays > 7 ? true : false;
      state.detailShirt = payload;
    },
    setAllShirtsList(state, payload) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);

      payload.forEach((el: any) => {
        const diffDays =
          Math.round(
            currentDate.getTime() - new Date(el.creationDate).getTime()
          ) /
          (1000 * 3600 * 24);
        el.isNew = diffDays < 7 ? true : false;
      });
      state.allShirts = payload;
    },
    setMyShirtsList(state, payload) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
      payload.forEach((el: any) => {
        const diffDays =
          Math.round(
            currentDate.getTime() - new Date(el.creationDate).getTime()
          ) /
          (1000 * 3600 * 24);
        el.isNew = diffDays < 7 ? true : false;
      });
      state.myShirts = payload;
    },
    setAllSizes(state, payload) {
      state.sizes = payload;
    },
    setAllMyShops(state, payload) {
      const concated = state.shops.concat(payload);
      state.shops = concated;
    },
    setMyShopping(state, payload) {
      const concated = state.shops.concat(payload);
      state.shops = concated;
    },
    setLogout(state) {
      console.log("setLogout");
      localStorage.removeItem("shirts_token");
      localStorage.removeItem("shirtsUser");
      state.user = null;
    },
    setRegisterOrLogin(state, payload) {
      localStorage.setItem("shirts_token", payload.token);
      localStorage.setItem("shirtsUser", JSON.stringify(payload));
      state.user = payload;
    },
    setMyBrand(state, payload) {
      (state.user as any).brandId = payload._id;
      localStorage.removeItem("shirtsUser");
      localStorage.setItem("shirtsUser", JSON.stringify(state.user));
    },
    setShowToastError(state, payload) {
      if (payload[0].message == "Forbidden resource") {
        localStorage.removeItem("shirts_token");
        localStorage.removeItem("shirtsUser");
        state.user = null;
      }
      state.toast = {
        show: true,
        message: payload[0].message,
        status: "error",
      };
    },
    setShowToastInfo(state, payload) {
      state.toast = {
        show: true,
        message: payload,
        status: "info",
      };
    },
    setShowSuccessInfo(state, payload) {
      state.toast = {
        show: true,
        message: payload,
        status: "success",
      };
    },
    setCurrentTargetElement(state, payload) {
      state.currentTargetElement = payload;
    },
    setAllColours(state, payload) {
      state.colours = payload;
    },
    addMoveableElement(state, payload) {
      if (!state.moveableElements[payload.key])
        state.moveableElements[payload.key] = [];

      const newMoveableElement = {
        id: state.moveableElements[payload.key].length + 1,
        // tag: payload.isImage ? "img" : "p",
        // text: payload.txt,
        // src: payload.src,
        class: `target${payload.key}-${
          state.moveableElements[payload.key].length + 1
        }`,
        style: "height: 24px; top: 0; left: 0; position: absolute",
        height: payload.isImage ? 70 : 24,
        html: payload.isImage
          ? `<img class="moveable-img" src="${payload.src}" cover />`
          : `<p>${payload.txt}</p>`,
        isImage: payload.isImage,
      };
      // state.moveableElements[payload.key] = [
      //   newMoveableElement,
      //   ...state.moveableElements[payload.key],
      // ];
      state.moveableElements[payload.key].push(newMoveableElement);
    },
    editStyleMoveableElement(state, payload) {
      const moveableElement = state.moveableElements[payload.key].findIndex(
        (el: any) => el.id == payload.id
      );
      if (moveableElement >= 0)
        state.moveableElements[payload.key][moveableElement].style =
          payload.style;
    },
    setIdStore(state, payload) {
      const alreadyHasId = state.storeId.find((el: any) => el.id == payload.id);
      if (!alreadyHasId) state.storeId.push(payload);
      localStorage.setItem("itemStore", JSON.stringify(state.storeId));
    },
    removeStoreShirt(state, payload) {
      const indexStoreShirt = state.storeId.findIndex(
        (el: any) => el.id == payload
      );
      if (indexStoreShirt != -1) {
        state.storeItems.splice(indexStoreShirt, 1);
      }
    },
    handleGenericLoading(state, payload: boolean) {
      state.genericLoading = payload;
    },
    handleDialogStep(state, payload: boolean) {
      state.dialogSteps = payload;
    },
  },
  actions: {
    async fetchAllColours({ commit }) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query Colours {
              colours {
                _id
                name
              }
            }
          `,
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setAllColours", response.data.colours);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async fetchShirtStore({ commit }, id) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query Product($id: String!) {
              product(id: $id) {
                _id
                userId
                printTypeId
                title
                description
                design
                userPrice
                finalPrice
                creationDate
              }
            }
          `,
          variables: { id },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setShirtStoreDetail", response.data.product);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async fetchShirt({ commit }, id) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query Product($id: String!) {
              product(id: $id) {
                _id
                userId
                printTypeId
                title
                description
                design
                userPrice
                finalPrice
                creationDate
              }
            }
          `,
          variables: { id },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setShirtDetail", response.data.product);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async fetchAllShirtsList({ commit }) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query Products {
              products {
                _id
                userId
                printTypeId
                title
                description
                design
                userPrice
                finalPrice
                creationDate
              }
            }
          `,
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setAllShirtsList", response.data.products);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async fetchMyShirtsList({ commit }) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query UserProducts {
              userProducts {
                _id
                userId
                printTypeId
                design
                title
                description
                userPrice
                finalPrice
                creationDate
              }
            }
          `,
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setMyShirtsList", response.data.userProducts);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async fetchAllSizes({ commit }) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query Sizes {
              sizes {
                _id
                name
              }
            }
          `,
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setAllSizes", response.data.sizes);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async fetchAllMyShops({ commit }) {
      try {
        const response = await graphqlClient.query({
          query: gql`
            query myShops {
              myShops {
                _id
                userId
                clientId
                product {
                  _id
                  userId
                  printTypeId
                  title
                  description
                  design
                  userPrice
                  finalPrice
                }
                sizeId
                quantity
                creationDate
              }
            }
          `,
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else commit("setAllMyShops", response.data.myShops);
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async buyProduct({ commit }, { userId, productId, sizeId, quantity }) {
      try {
        const response = await graphqlClient.mutate({
          mutation: gql`
            mutation CreateSell($createSellInput: CreateSellInput!) {
              createSell(createSellInput: $createSellInput) {
                _id
                userId
                clientId
                product {
                  _id
                  userId
                  printTypeId
                  title
                  description
                  design
                  userPrice
                  finalPrice
                }
                sizeId
                quantity
                creationDate
              }
            }
          `,
          variables: {
            createSellInput: { userId, productId, sizeId, quantity },
          },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else {
          commit("setMyShopping", response.data.createSell);
          commit("setShowSuccessInfo", "Thanks for the purchasing!");
        }
        // else {
        //   commit("setRegisterOrLogin", response.data.login);
        // }
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async createProduct({ commit }, { design, userPrice, colourId, config }) {
      try {
        const response = await graphqlClient.mutate({
          mutation: gql`
            mutation ($createProductInput: CreateProductInput!) {
              createProduct(createProductInput: $createProductInput) {
                _id
                userId
                colourId
                printTypeId
                design
                userPrice
                creationDate
              }
            }
          `,
          variables: {
            createProductInput: {
              design,
              printTypeId: "6332288451afb258b78effc6",
              colourId,
              title: "test",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. In doloribus recusandae atque earum quos possimus eveniet cum vero sequi assumenda.",
              config,
              userPrice,
            },
          },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else {
          commit("setCreatedProduct", response.data.createProduct);
          commit("setShowSuccessInfo", "Thanks for create a Product!");
        }
        // else {
        //   commit("setRegisterOrLogin", response.data.login);
        // }
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async saveBrand({ commit }, { url }) {
      try {
        const response = await graphqlClient.mutate({
          mutation: gql`
            mutation CreateBrand($createBrandInput: CreateBrandInput!) {
              createBrand(createBrandInput: $createBrandInput) {
                _id
                design
                userId
              }
            }
          `,
          variables: {
            createBrandInput: { design: url },
          },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else {
          commit("setMyBrand", response.data.createBrand);
          commit("setShowSuccessInfo", "Successfull Brand saved");
        }
        // else {
        //   commit("setRegisterOrLogin", response.data.login);
        // }
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async login({ commit }, { email, password }) {
      try {
        const response = await graphqlClient.mutate({
          mutation: gql`
            mutation Login($login: LoginInput!) {
              login(login: $login) {
                _id
                brandId
                email
                token
              }
            }
          `,
          variables: {
            login: { email, password },
          },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else {
          commit("setShowSuccessInfo", "You have been login successfull!");
          commit("setRegisterOrLogin", response.data.login);
        }
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    async register({ commit }, { email, password }) {
      try {
        const response = await graphqlClient.mutate({
          mutation: gql`
            mutation ($createUserInput: CreateUserInput!) {
              createUser(createUserInput: $createUserInput) {
                _id
                brandId
                email
                token
              }
            }
          `,
          variables: {
            createUserInput: { email, password },
          },
          errorPolicy: "all",
        });
        if (response.errors) commit("setShowToastError", response.errors);
        else {
          commit("setShowSuccessInfo", "You have been register successfull!");
          commit("setRegisterOrLogin", response.data.createUser);
        }
        return response;
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    setIdStore({ commit }, payload) {
      commit("setIdStore", payload);
    },
    setCurrentTargetElement({ commit }, payload) {
      commit("setCurrentTargetElement", payload);
    },
    removeStoreShirt({ commit }, payload) {
      commit("removeStoreShirt", payload);
    },
    addMoveableElement({ commit }, payload) {
      commit("addMoveableElement", payload);
    },
    editStyleMoveableElement({ commit }, payload) {
      commit("editStyleMoveableElement", payload);
    },
    handleGenericLoading({ commit }, payload) {
      commit("handleGenericLoading", payload);
    },
    handleDialogStep({ commit }, payload) {
      commit("handleDialogStep", payload);
    },
    setLogout({ commit }) {
      commit("setLogout");
    },
  },
  modules: {},
});
