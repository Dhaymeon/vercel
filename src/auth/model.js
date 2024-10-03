const supabase = require("../../config/supabase_config");

const signup_public_model = ({ fullName, email, password, phone, UUID }) => {
  return supabase
    .from("user_public")
    .insert([
      {
        name: fullName,
        email: email,
        uuid: UUID,
        phone_number: phone,
        data: { password: password },
      },
    ])
    .select();
};

const signup_private_model = (payload) => {
  return supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: payload.data,
    },
  });
};

const signup_public_model2 = ({ fullName, phone_number, password, UUID }) => {
  return supabase
    .from("user_public")
    .insert([
      {
        name: fullName,
        phone_number: phone_number,
        uuid: UUID,
        data: { password: password },
      },
    ])
    .select();
};

const signup_private_model2 = (payload2) => {
  return supabase.auth.signUp({
    password: payload2.password,
    phone: payload2.phone_number,
    options: {
      data: payload2.data,
    },
  });
};

const login_model = ({ email, password }) => {
  return supabase.auth.signInWithPassword({ email: email, password: password });
};

const fetchUserPublicModel = (payload) => {
  return supabase
    .from("user_public")
    .select("*")
    .or(`email.eq.${payload}`, `phone_number.eq.${payload}`);
};

const updateOTPmodel = ({ OTP, email }) => {
  return supabase.from("user_public").update({ otp: OTP }).eq("email", email);
};

const updateDetailsmodel = ({ newfullName, newphone_number, email }) => {
  return supabase
    .from("user_public")
    .update({ name: newfullName, phone_number: newphone_number })
    .eq("email", email);
};

// getting user by id from public table
const getUserById = (id) => {
  return supabase.from("user_public").select("*").eq("uuid", id);
};

// get user by id from authentication table
const getPrivateUserById = (UUID) => {
  return supabase.auth.admin.getUserById(UUID);
};

const updateUserInfoModel = ({ UUID, data }) => {
  return supabase.auth.admin.updateUserById(UUID, { user_metadata: data });
};
const getUserByPhoneNumber = (phone) => {
  return supabase.from("user_public").select("*").eq("phone_number", phone);
};

const deleteUserPrivateModel = (id) => {
  return supabase.auth.admin.deleteUser(id);
};

const deleteUserPublicModel = (id) => {
  return supabase.from("user_public").delete().eq("uuid", id);
};

module.exports = {
  signup_public_model,
  signup_private_model,
  signup_private_model2,
  signup_public_model2,
  login_model,
  fetchUserPublicModel,
  updateOTPmodel,
  updateDetailsmodel,
  getUserById,
  getPrivateUserById,
  updateUserInfoModel,
  getUserByPhoneNumber,
  deleteUserPrivateModel,
  deleteUserPublicModel,
};
