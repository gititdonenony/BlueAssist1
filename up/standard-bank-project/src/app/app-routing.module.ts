/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login-success',
    loadChildren: () => import('./pages/login-success/login-success.module').then( m => m.LoginSuccessPageModule)
  },
  {
    path: 'persnal-info',
    loadChildren: () => import('./pages/persnal-info/persnal-info.module').then( m => m.PersnalInfoPageModule)
  },
  {
    path: 'emergency-contacts-selected-state',
    loadChildren: () => import('./pages/emergency-contacts-selected-state/emergency-contacts-selected-state.module').then( m => m.EmergencyContactsSelectedStatePageModule)
  },
  {
    path: 'camera-capture',
    loadChildren: () =>
      import('src/app/pages/camera-capture/camera-capture.module').then(m => m.CameraCapturePageModule)
  },
  {
    path: 'upgrade-package',
    loadChildren: () => import('./pages/upgrade-package/upgrade-package.module').then( m => m.UpgradePackagePageModule)
  },
  {
    path: 'optional-add-one',
    loadChildren: () => import('./pages/optional-add-one/optional-add-one.module').then( m => m.OptionalAddOnePageModule)
  },
  {
    path: 'choose-a-bundle',
    loadChildren: () => import('./choose-a-bundle/choose-a-bundle.module').then( m => m.ChooseABundlePageModule)
  },
  {
    path: 'traffic-fines',
    loadChildren: () => import('./pages/fines/traffic-fines/traffic-fines.module').then( m => m.TrafficFinesPageModule)
  },
  {
    path: 'fines-details',
    loadChildren: () => import('./pages/fines/fines-details/fines-details.module').then( m => m.FinesDetailsPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/fines/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'medical-information',
    loadChildren: () => import('./pages/medical-information/medical-information.module').then( m => m.MedicalInformationPageModule)
  },
  {
    path: 'invite-family',
    loadChildren: () => import('./pages/invite-family/invite-family.module').then( m => m.InviteFamilyPageModule)
  },
  {
    path: 'add-vehicle',
    loadChildren: () => import('./pages/add-vehicle/add-vehicle.module').then( m => m.AddVehiclePageModule)
  },
  {
    path: 'my-details',
    loadChildren: () => import('./pages/profile/my-details/my-details.module').then( m => m.MyDetailsPageModule)
  },
  {
    path: 'family-members',
    loadChildren: () => import('./pages/profile/family-members/family-members.module').then( m => m.FamilyMembersPageModule)
  },
  {
    path: 'my-devices',
    loadChildren: () => import('./pages/profile/my-devices/my-devices.module').then( m => m.MyDevicesPageModule)
  },
  {
    path: 'my-vehicles',
    loadChildren: () => import('./my-vehicles/my-vehicles.module').then( m => m.MyVehiclesPageModule)
  },
  {
    path: 'incident-details',
    loadChildren: () => import('./incident-details/incident-details.module').then( m => m.IncidentDetailsPageModule)
  },
  {
    path: 'incident-photos',
    loadChildren: () => import('./incident-photos/incident-photos.module').then( m => m.IncidentPhotosPageModule)
  },

  {
    path: 'accident-details',
    loadChildren: () => import('./road-accident-fund/accident-details/accident-details.module').then( m => m.AccidentDetailsPageModule)
  },
  {
    path: 'accident-reporting',
    children: [
      {
        path: 'snap',
        children: [
          {
            path: 'accident-scene',
            loadChildren: () =>
              import('./pages/accident-reporting/snap/accident-scene/accident-scene.module').then(m => m.AccidentScenePageModule)
          },
          {
            path: 'your-vehicle-damage',
            loadChildren: () =>
              import('./pages/accident-reporting/snap/your-vehicle-damages/your-vehicle-damages.module').then(m => m.YourVehicleDamagesPageModule)
          },
          {
            path: 'their-vehicle-damage',
            loadChildren: () =>
              import('./pages/accident-reporting/snap/other-vehicle-damages/other-vehicle-damages.module').then(m => m.OtherVehicleDamagesPageModule)
          },
          {
            path: 'road-conditions',
            loadChildren: () =>
              import('./pages/accident-reporting/snap/road-conditions/road-conditions.module').then(m => m.RoadConditionsPageModule)
          }
        ]
      },
      {
        path: 'scan',
        children: [
          {
            path: 'other-driver-info',
            loadChildren: () => import('./pages/accident-reporting/scan/other-driver-info/other-driver-info.module').then(m => m.OtherDriverInfoPageModule)
          },
          {
            path: 'other-vehicle-info',
            loadChildren: () => import('./pages/accident-reporting/scan/other-vehicle-info/other-vehicle-info.module').then(m => m.OtherVehicleInfoPageModule)
          },
          {
            path: 'your-info',
            loadChildren: () => import('./pages/accident-reporting/scan/your-info/your-info.module').then(m => m.YourInfoPageModule)
          },
          {
            path: 'your-vehicle-info',
            loadChildren: () => import('./pages/accident-reporting/scan/your-vehicle-info/your-vehicle-info.module').then(m => m.YourVehicleInfoPageModule)
          },
          {
            path: 'passenger-info',
            loadChildren: () => import('./pages/accident-reporting/scan/passenger-info/passenger-info.module').then(m => m.PassengerInfoPageModule)
          },
          {
            path: 'passenger-info-capture',
            loadChildren: () => import('./pages/accident-reporting/scan/passenger-info-capture/passenger-info-capture.module').then(m => m.PassengerInfoCapturePageModule)
          },
          {
            path: 'injury-severity-question',
            loadChildren: () => import('./pages/accident-reporting/scan/injury-severity-question/injury-severity-question.module').then(m => m.InjurySeverityQuestionPageModule)
          },
          {
            path: 'witness-info',
            loadChildren: () => import('./pages/accident-reporting/scan/witness-info/witness-info.module').then(m => m.WitnessInfoPageModule)
          }
        ]
      },
      {
        path: 'submit',
        children: [
          {
            path: 'special-observations',
            loadChildren: () => import('./pages/accident-reporting/submit/special-observations/special-observations.module').then(m => m.SpecialObservationsPageModule)
          },
          {
            path: 'dangerous-goods',
            loadChildren: () => import('./pages/accident-reporting/submit/dangerous-goods/dangerous-goods.module').then(m => m.DangerousGoodsPageModule)
          },
          {
            path: 'submit-and-email',
            loadChildren: () => import('./pages/accident-reporting/submit/submit-and-email/submit-and-email.module').then(m => m.SubmitAndEmailPageModule)
          }
        ]
      }
    ]
  },
  {
    path: 'upload-docs',
    loadChildren: () => import('./road-accident-fund/upload-docs/upload-docs.module').then( m => m.UploadDocsPageModule)
  },
  {
    path: 'claim-submission-success',
    loadChildren: () => import('./road-accident-fund/claim-submission-success/claim-submission-success.module').then( m => m.ClaimSubmissionSuccessPageModule)
  },
  {
    path: 'licence-renewal-home',
    loadChildren: () => import('./pages/Licence-renewal/licence-renewal-home/licence-renewal-home.module').then( m => m.LicenceRenewalHomePageModule)
  },
  {
    path: 'vehicle-info',
    loadChildren: () => import('./pages/Licence-renewal/vehicle-info/vehicle-info.module').then( m => m.VehicleInfoPageModule)
  },
  {
    path: 'licence-cart',
    loadChildren: () => import('./pages/Licence-renewal/licence-cart/licence-cart.module').then( m => m.LicenceCartPageModule)
  },
  {
    path: 'paid-licence',
    loadChildren: () => import('./pages/Licence-renewal/paid-licence/paid-licence.module').then( m => m.PaidLicencePageModule)
  },
  {
    path: 'shop-home',
    loadChildren: () => import('./pages/shop/shop-home/shop-home.module').then( m => m.ShopHomePageModule)
  },
  {
    path: 'shop-one',
    loadChildren: () => import('./pages/shop/shop-one/shop-one.module').then( m => m.ShopOnePageModule)
  },
  {
    path: 'shop-product',
    loadChildren: () => import('./pages/shop/shop-product/shop-product.module').then( m => m.ShopProductPageModule)
  },
  {
    path: 'shop-cart',
    loadChildren: () => import('./pages/shop/shop-cart/shop-cart.module').then( m => m.ShopCartPageModule)
  },
  {
    path: 'shop-add-card',
    loadChildren: () => import('./pages/shop/shop-add-card/shop-add-card.module').then( m => m.ShopAddCardPageModule)
  },
  {
    path: 'shop-add-card-two',
    loadChildren: () => import('./pages/shop/shop-add-card-two/shop-add-card-two.module').then( m => m.ShopAddCardTwoPageModule)
  },
  {
    path: 'shop-two',
    loadChildren: () => import('./pages/shop/shop-two/shop-two.module').then( m => m.ShopTwoPageModule)
  },
  {
    path: 'shop-confirmation',
    loadChildren: () => import('./pages/shop/shop-confirmation/shop-confirmation.module').then( m => m.ShopConfirmationPageModule)
  },
  {
    path: 'emergency-contacts',
    loadChildren: () => import('./pages/emergency-contacts/emergency-contacts.module').then( m => m.EmergencyContactsPageModule)
  },
  {
    path: 'invite-family-sec',
    loadChildren: () => import('./pages/invite-family-sec/invite-family-sec.module').then( m => m.InviteFamilySecPageModule)
  },
  {
    path: 'add-vehicles-two',
    loadChildren: () => import('./add-vehicles-two/add-vehicles-two.module').then( m => m.AddVehiclesTwoPageModule)
  },
  {
    path: 'finish-home',
    loadChildren: () => import('./pages/finish-home/finish-home.module').then( m => m.FinishHomePageModule)
  },
  {
    path: 'finish',
    loadChildren: () => import('./finish/finish.module').then( m => m.FinishPageModule)
  },

  {
    path: 'cart',
    loadChildren: () => import('./pages/Licence-renewal/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/Licence-renewal/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'licence-info',
    loadChildren: () => import('./pages/Licence-renewal/licence-info/licence-info.module').then( m => m.LicenceInfoPageModule)
  },
  {
    path: 'roadcove',
    loadChildren: () => import('./roadcove/roadcove.module').then( m => m.RoadcovePageModule)
  },
  {
    path: 'shop-confermation',
    loadChildren: () => import('./shop-confermation/shop-confermation.module').then( m => m.ShopConfermationPageModule)
  },
  {
    path: 'persnal-info-two',
    loadChildren: () => import('./persnal-info-two/persnal-info-two.module').then( m => m.PersnalInfoTwoPageModule)
  },
  {
    path: 'emergency-contact-two',
    loadChildren: () => import('./emergency-contact-two/emergency-contact-two.module').then( m => m.EmergencyContactTwoPageModule)
  },
  {
    path: 'medical-two',
    loadChildren: () => import('./medical-two/medical-two.module').then( m => m.MedicalTwoPageModule)
  },
  {
    path: 'fmaily-members-two',
    loadChildren: () => import('./fmaily-members-two/fmaily-members-two.module').then( m => m.FmailyMembersTwoPageModule)
  },
  {
    path: 'incident-scene-photos',
    loadChildren: () => import('./incident-scene-photos/incident-scene-photos.module').then( m => m.IncidentScenePhotosPageModule)
  },
  {
    path: 'pothole-road-scene-photos',
    loadChildren: () => import('./pothole-road-scene-photos/pothole-road-scene-photos.module').then( m => m.PotholeRoadScenePhotosPageModule)
  },
  {
    path: 'pothole-vehicle-damage-photos',
    loadChildren: () => import('./pothole-vehicle-damage-photos/pothole-vehicle-damage-photos.module').then( m => m.PotholeVehicleDamagePhotosPageModule)
  },
  {
    path: 'pothole',
    loadChildren: () => import('./pages/pothole/pothole.module').then( m => m.PotholePageModule)
  },
  {
    path: 'delivery-address',
    loadChildren: () => import('./pages/Licence-renewal/delivery-address/delivery-address.module').then( m => m.DeliveryAddressPageModule)
  },
  {
    path: 'personal-info-my-details',
    loadChildren: () => import('./pages/profile/personal-info-my-details/personal-info-my-details.module').then( m => m.PersonalInfoMyDetailsPageModule)
  },
  {
    path: 'edit-my-vehicles',
    loadChildren: () => import('./pages/profile/edit-my-vehicles/edit-my-vehicles.module').then( m => m.EditMyVehiclesPageModule)
  },
  {
    path: 'edit-emergency-contact-two',
    loadChildren: () => import('./pages/profile/edit-emergency-contact-two/edit-emergency-contact-two.module').then( m => m.EditEmergencyContactTwoPageModule)
  },
  {
    path: 'edit-family-members',
    loadChildren: () => import('./pages/profile/edit-family-members/edit-family-members.module').then( m => m.EditFamilyMembersPageModule)
  },
  {
    path: 'confirm-id',
    loadChildren: () => import('./pages/fines/confirm-id/confirm-id.module').then( m => m.ConfirmIdPageModule)
  },
  {
    path: 'renault',
    loadChildren: () => import('./pages/renault/renault.module').then( m => m.RenaultPageModule)
  },

  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'otp-validation',
    loadChildren: () => import('./pages/otp-validation/otp-validation.module').then( m => m.OtpValidationPageModule)
  },
  {
    path: 'otp-validation-login',
    loadChildren: () => import('./pages/otp-validation-login/otp-validation-login.module').then( m => m.OtpValidationLoginPageModule)
  },
  {
    path: 'generic-popup',
    loadChildren: () => import('./generic-popup/generic-popup.module').then( m => m.GenericPopupPageModule)
  },  {
    path: 'barcode-scanner',
    loadChildren: () => import('./barcode-scanner/barcode-scanner.module').then( m => m.BarcodeScannerPageModule)
  },




 


  





  // {
  //   path: 'pages',
  //   loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
