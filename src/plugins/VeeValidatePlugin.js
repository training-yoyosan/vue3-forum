import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import { required, email, min, url } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import firebase from "@/helpers/firebase";

export default (app) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("url", url);
  defineRule("unique", async (value, args) => {
    let collection, field, excluding;
    if (Array.isArray(args)) {
      [collection, field, excluding] = args;
    } else {
      ({ collection, field, exclude: excluding } = args);
    }

    if (excluding === value) {
      return true;
    }

    const querySnapshot = await firebase.firestore().collection(collection).where(field, "==", value).get();
    return querySnapshot.empty;
  });

  configure({
    generateMessage: localize("en", {
      messages: {
        required: "{field} is required",
        email: "{field} must be a valid email",
        min: "{field} must be 0:{min} characters long",
        unique: "{field} is already taken",
        url: "{field} must be a valid URL",
      },
    }),
  });

  app.component("VeeForm", Form);
  app.component("VeeField", Field);
  app.component("VeeErrorMessage", ErrorMessage);
};
