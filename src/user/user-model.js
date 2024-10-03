const supabase = require("../../config/supabase_config");

const getUserByAccesToken = (token) => {
  return supabase.auth.getUser(token);
};

const refreshByRefreshToken = (refresh) => {
  return supabase.auth.refreshSession({ refresh_token: refresh });
};

const Insert_image_to_public_storage = (payload) => {
  return supabase.storage
    .from("Public_Bucket")
    .upload(payload.fileName, payload.formData);
};

module.exports = {
  getUserByAccesToken,
  refreshByRefreshToken,
  Insert_image_to_public_storage,
};
