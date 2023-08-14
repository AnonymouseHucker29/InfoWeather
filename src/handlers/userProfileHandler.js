export function userProfileHandler(sender_psid) {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        uri: `https://graph.facebook.com/${sender_psid}`,
        qs: {
          access_token: process.env.PAGE_ACCESS_TOKEN,
          fields: "first_name",
        },
        method: "GET",
      };

      const url = `${options.uri}?access_token=${options.qs.access_token}&fields=${options.qs.fields}`;

      const response = await fetch(url);
      const userProfile = await response.json();

      if (response.ok) {
        resolve(userProfile);
      }
    } catch (error) {
      console.error("Error:", error);
      reject(error);
    }
  });
}
