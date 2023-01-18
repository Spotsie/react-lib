// @ts-nocheck
const DEFAULT_API_URL = "https://grpcweb.staging.spotsie.cloud";
export let API_URL = import.meta.env.SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;

try {
  API_URL = process.env.SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
} catch (error) {
  // if the process is not defined, check for webpack's DefinePlugin variable
  try {
    API_URL = import.meta.env.SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
  } catch (error) {
    try {
      API_URL = SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
    } catch (err) {
      API_URL = DEFAULT_API_URL;
    }
  }
}

const DEFAULT_ORGANIZATION_ID = 1;
export let API_ORGANIZATION_ID = DEFAULT_ORGANIZATION_ID;

try {
  API_ORGANIZATION_ID = !isNaN(Number(process.env.ORGANIZATION_ID))
    ? Number(process.env.ORGANIZATION_ID)
    : DEFAULT_ORGANIZATION_ID;
} catch (error) {
  try {
    API_ORGANIZATION_ID = !isNaN(Number(import.meta.env.ORGANIZATION_ID))
      ? Number(import.meta.env.ORGANIZATION_ID)
      : DEFAULT_ORGANIZATION_ID;
  } catch (error) {
    // if the process is not defined, check for webpack's DefinePlugin variable
    try {
      API_ORGANIZATION_ID = !isNaN(Number(ORGANIZATION_ID))
        ? Number(ORGANIZATION_ID)
        : DEFAULT_ORGANIZATION_ID;
    } catch (err) {
      API_ORGANIZATION_ID = DEFAULT_ORGANIZATION_ID;
    }
  }
}

const DEFAULT_NAMESPACE_ID = 10001;
export let API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;

try {
  API_NAMESPACE_ID = !isNaN(Number(process.env.NAMESPACE_ID))
    ? Number(process.env.NAMESPACE_ID)
    : DEFAULT_NAMESPACE_ID;
} catch (error) {
  try {
    API_NAMESPACE_ID = !isNaN(Number(import.meta.env.NAMESPACE_ID))
      ? Number(import.meta.env.NAMESPACE_ID)
      : DEFAULT_NAMESPACE_ID;
  } catch (error) {
    // if the process is not defined, check for webpack's DefinePlugin variable
    try {
      API_NAMESPACE_ID = !isNaN(Number(NAMESPACE_ID))
        ? Number(NAMESPACE_ID)
        : !isNaN(Number(NAMESPACE_ID))
        ? Number(NAMESPACE_ID)
        : DEFAULT_NAMESPACE_ID;
    } catch (err) {
      API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;
    }
  }
}

const DEFAULT_SPOTSIE_JWT =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nwb3RzaWUuaW8iLCJ1cG4iOiJhZG1pbkBsb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImdyb3VwcyI6WyJST0xFX1VTRVIiLCJST0xFX0FETUlOIl0sImlhdCI6MTY3MzYwMTIyMSwiZXhwIjoxNjczNjg3NjIxLCJhdXRoIjoiUk9MRV9VU0VSLCBST0xFX0FETUlOIiwianRpIjoiYTY4ODFmN2YtOTMzZS00ZjFkLWE5ZjYtNjcyODQxM2ZjOGY0In0.REsEo3nSL893D6_9ydXtQ-KEZZR9nUMtgCpg9ABiK8pVOgPTVuVmCYUxGPHpSHYEt3Vg-u6ovEsO6O97j-oZrtBvnVKilH50CbO5W6y5U3B0Ivpa8JQWOCtebwrrsVjrh0D_G2Qt7NslZv6d8kJpRneofUu43FLgG--W8zpVqWNOaVPmPoQPnFIriA0lLe_2FQGUvZrn8PLkO7_ErXoPoI_LUO3peak7TlJ7g8HTzC6dsk1rnQxsulU_4lckJs0_TOLfzGU1dLbuW6tfELgFjFbgkGe44WhkRqryKgbA294ByBkz5boTx3xo_7iVfidTAt_0ezPa41qdXN-7BFzGrg";
export let API_SPOTSIE_JWT = DEFAULT_SPOTSIE_JWT;

try {
  API_SPOTSIE_JWT = process.env.SPOTSIE_JWT ?? DEFAULT_SPOTSIE_JWT;
} catch (error) {
  try {
    API_SPOTSIE_JWT = import.meta.env.SPOTSIE_JWT ?? DEFAULT_SPOTSIE_JWT;
  } catch (error) {
    // if the process is not defined, check for webpack's DefinePlugin variable
    try {
      API_SPOTSIE_JWT = SPOTSIE_JWT ?? DEFAULT_SPOTSIE_JWT;
    } catch (err) {
      API_SPOTSIE_JWT = DEFAULT_SPOTSIE_JWT;
    }
  }
}
