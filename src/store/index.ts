import { createStore } from "vuex";

import gql from "graphql-tag";
import graphqlClient from "../utils/graphql";
import { ApolloError } from "apollo-client";

export default createStore({
  state: {
    currentTargetElement: null,
    moveableElements: [] as any,
    detailShirt: null,
    allShirts: [],
    myShirts: [],
    user: null,
    toast: {
      show: false,
      message: "",
      status: "",
    },
  },
  getters: {},
  mutations: {
    setShirtDetail(state, payload) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);

      payload;
      const diffDays =
        Math.round(
          currentDate.getTime() - new Date(payload.creationDate).getTime()
        ) /
        (1000 * 3600 * 24);
      console.log(this, new Date(), new Date(payload.creationDate), diffDays);
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
        console.log(this, new Date(), new Date(el.creationDate), diffDays);
        el.isNew = diffDays > 7 ? true : false;
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
        console.log(this, new Date(), new Date(el.creationDate), diffDays);
        el.isNew = diffDays > 7 ? true : false;
      });
      state.myShirts = payload;
    },
    setRegisterOrLogin(state, payload) {
      localStorage.setItem("shirts_token", payload.token);
      localStorage.setItem("shirtsUser", JSON.stringify(payload));
      state.user = payload;
    },
    setShowToastError(state, payload) {
      console.log(payload);
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
      console.log(payload);
      state.toast = {
        show: true,
        message: payload,
        status: "info",
      };
    },
    setCurrentTargetElement(state, payload) {
      state.currentTargetElement = payload;
    },
    addMoveableElement(state, payload) {
      const newMoveableElement = {
        id: state.moveableElements.length + 1,
        // tag: payload.isImage ? "img" : "p",
        // text: payload.txt,
        // src: payload.src,
        class: `target${state.moveableElements.length + 1}`,
        height: payload.isImage ? 70 : 24,
        html: payload.isImage
          ? `<img class="moveable-img" src="${payload.src}" cover />`
          : `<p>${payload.txt}</p>`,
      };
      state.moveableElements.push(newMoveableElement);
      console.log("moveableElements from store: ", state.moveableElements);
    },
  },
  actions: {
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
        console.log(response);
        if (response.errors) commit("setShowToastError", response.errors);
        else {
          commit("setRegisterOrLogin", response.data.createUser);
        }
        return response;
      } catch (error) {
        const graphQlErrors = (error as any).networkError.result.errors;
        commit("setShowToastError", graphQlErrors);
      }
    },
    setCurrentTargetElement({ commit }, payload) {
      commit("setCurrentTargetElement", payload);
    },
    addMoveableElement({ commit }, payload) {
      commit("addMoveableElement", payload);
    },
  },
  modules: {},
});
