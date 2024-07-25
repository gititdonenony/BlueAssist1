// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'https://api.claimtec.co.za/v1/',
  apiAuth: 'auth/',
  apiClaim: 'claim/',
  apiAccount: 'account/',
  // previous api end points
  // url: 'https://stdbank.dentaldoctorsolutions.com/',
  // apiAuth: 'api/web/v1/auth/',
  // apiClaim: 'api/web/v1/claim/',
  // apiAccount: 'api/web/v1/account/',
  panicApiCallTime: 120000, // use 300000 for five min //180000 for three min
};
export const apiEndpoints = {
  login: 'login',
  uploadImage: 'upload-image',
  uploadBase64Image: 'upload-base64image',
  updateUserInfo: 'update-user-info',
  userInfo: 'user-info',
  emergencyAssistance: 'emergency-assistance',
  emergencyContact: 'emergency-contact',
  getEmergencyContact: 'get-emergency-contact',
  inviteFamily: 'invite-family',
  getInviteFamily: 'get-invite-family',
  getMedicalInfo: 'get-medical-info',
  medicalInfo: 'medical-info',
  vehicle: 'vehicle',
  getVehicle: 'get-vehicle',
  updateMedicalInfo: 'update-medical-info',
  deleteEmergencyContact: 'delete-emergency-contact',
  deleteVehicleInfo: 'delete-vehicle-info',
  deleteInviteFamily: 'delete-invite-family',
  pothole: 'pothole',
  incident: 'incident',
  getPothole: 'get-pothole',
  allBasket: 'all-basket',
  addToBasket: 'add-vehicle-basket',
  deleteItem: 'delete-item',
  itemUploadDocument: 'item-upload-document',
  raf: {
    postClaim: 'rafclaim',
    getClaim: 'get-rafclaim',
  },
  deliveryAddess: {
    get: 'get-all-license-address',
    add: 'licence-address',
  },
  cart: {
    getcheckoutUrl: 'get-checkout-url',
  },
  fines: {
    getFines: 'get-fine-for-id-number',
    checkOutFine: 'get-fine-checkout-url',
    addFine: 'add-fine-for-payment',
  },
  getSignup: "register-phone",
  sendOTP: "send-otp",
  verifyOtp: "verify-otp",
  verifyLoginOtp: "verify-login-otp",
  loginByNumber: 'login-phone',
  paymentStatus: 'payment-status',
  upgradePlan:'generate-token',
  rapidzone:'rapidzone',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
